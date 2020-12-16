"use strict";

describe("app:", function() {
  beforeEach(function() {
    module(function($locationProvider) {
      locationProvider = $locationProvider;

      sinon.stub(locationProvider, 'hashPrefix');
      sinon.stub(locationProvider, 'html5Mode');
    });

    module("ui.router");

    module(function($urlRouterProvider) {
      urlRouterProvider = $urlRouterProvider

      sinon.spy(urlRouterProvider, 'when');
    });
  });

  beforeEach(function () {
    module("risevision.common.components.userstate");

    inject(function ($injector) {
      $state = $injector.get("$state");
      $rootScope = $injector.get("$rootScope");
      urlStateService = $injector.get("urlStateService");

      sinon.stub(urlStateService, "redirectToState");
    });
  });

  var $state, $rootScope, urlStateService;
  var locationProvider, urlRouterProvider;

  describe("mappings: ", function() {
    it("calls mappings config", function() {
      expect(locationProvider).to.be.ok;
      expect(locationProvider.html5Mode).to.have.been.calledWith(true);
      expect(locationProvider.hashPrefix).to.have.been.calledWith('/');

      expect(urlRouterProvider).to.be.ok;
      expect(urlRouterProvider.when).to.have.been.called;
    });

    it("validates google auth rule", function() {
      var goooleRegex = urlRouterProvider.when.getCall(0).args[0];

      expect(
        goooleRegex.test('/page?x=1&id_token=1234&client_id=A1223')
      ).to.be.true;
      expect(
        goooleRegex.test('/page?x=1&id_token=1234')
      ).to.be.false;
      expect(
        goooleRegex.test('/page?x=1&client_id=A1223')
      ).to.be.false;
      expect(
        goooleRegex.test('/page?x=1')
      ).to.be.false;
      expect(
        goooleRegex.test('/page')
      ).to.be.false;
    });

    it("validates root hash matcher", function() {
      var args = urlRouterProvider.when.getCall(1).args[1];

      expect(args).to.be.ok;
      expect(args.length).to.equal(4);

      var matcher = args[3];
      expect(matcher).to.be.ok;
      expect(matcher).to.be.a("function");
    });

    describe("root matcher: ", function() {
      let location, userAuthFactory, openidConnect, rootMatcher;
      let searchOutput;

      beforeEach(function () {
        searchOutput = {};
        location = {
          hash: function() { return null },
          search: function() { return searchOutput; }
        };
        userAuthFactory = { authenticate: sinon.stub() };
        openidConnect = { signinRedirectCallback: sinon.stub().resolves() };

        var args = urlRouterProvider.when.getCall(1).args[1];
        rootMatcher = args[3];
      });

      it("should return false if there's no hash and no search code", function() {
        var response = rootMatcher(location, userAuthFactory, openidConnect)

        expect(response).to.be.false;
      });

      it("should return false if there's hash but with no tokens", function() {
        location.hash = function() { return 'some_hash' };

        var response = rootMatcher(location, userAuthFactory, openidConnect)

        expect(response).to.be.false;
      });

      it("should signin redirect callback if there's hash with id_token", function(done) {
        location.hash = function() { return '&id_token=1234' };

        rootMatcher(location, userAuthFactory, openidConnect);

        setTimeout(function() {
          openidConnect.signinRedirectCallback.should.have.been.calledOnce;
          userAuthFactory.authenticate.should.have.been.calledWith(true);

          done();
        }, 10);
      });
    });
  });

  describe("states: ", function() {
    it("common.auth.unauthorized", function() {
      var state = $state.get("common.auth.unauthorized");
      expect(state).to.be.ok;
      expect(state.url).to.equal("/unauthorized/:state");
      expect(state.controller).to.equal("LoginCtrl");
    });

    it("common.auth.createaccount", function() {
      var state = $state.get("common.auth.createaccount");
      expect(state).to.be.ok;
      expect(state.url).to.equal("/createaccount/:state");
      expect(state.controller).to.equal("LoginCtrl");
      expect(state.params).to.deep.equal({
        isSignUp: true,
        joinAccount: false
      });
    });

    it("common.auth.joinaccount", function() {
      var state = $state.get("common.auth.joinaccount");
      expect(state).to.be.ok;
      expect(state.url).to.equal("/joinaccount/:companyName");
      expect(state.controller).to.equal("LoginCtrl");
      expect(state.params).to.deep.equal({
        isSignUp: true,
        joinAccount: true
      });
    });
  });

  describe("listeners: ", function() {
    it("should register", function() {
      expect($rootScope.$$listeners["risevision.user.authorized"]).to.be.ok;
      expect($rootScope.$$listeners.$stateChangeStart).to.be.ok;
    });

    describe("common.auth.unauthorized", function() {
      it("should restore previous state after authentication", function() {
        $state.go("common.auth.unauthorized", {
          state: "stateString"
        });

        $rootScope.$digest();

        expect($state.current.name).to.equal("common.auth.unauthorized");

        $rootScope.$broadcast("risevision.user.authorized");

        $rootScope.$digest();

        urlStateService.redirectToState.should.have.been.calledWith("stateString");
      });

      it("should go to blank state after authentication", function() {
        $state.go("common.auth.unauthorized", {});

        $rootScope.$digest();

        expect($state.current.name).to.equal("common.auth.unauthorized");

        $rootScope.$broadcast("risevision.user.authorized");

        $rootScope.$digest();

        urlStateService.redirectToState.should.have.been.called;
      });
    });

    describe("$stateChangeStart", function() {
      beforeEach(function() {
        sinon.stub($state, "go");
      });

      it("should not redirect for null state", function() {
        $rootScope.$broadcast("$stateChangeStart", {});

        $rootScope.$digest();

        $state.go.should.not.have.been.called;
      });

      it("should not redirect for random state", function() {
        $rootScope.$broadcast("$stateChangeStart", {
          name: "common.auth.randomState"
        });

        $rootScope.$digest();

        $state.go.should.not.have.been.called;
      });

      it("should redirect and use existing state variable", function() {
        $rootScope.$broadcast("$stateChangeStart", {
          name: "common.auth.unauthorized"
        }, {}, null, {
          state: "existingState"
        });

        $rootScope.$digest();

        $state.go.should.have.been.calledWith("common.auth.unauthorized", {
          state: "existingState"
        });
      });

      it("should not redirect if state variable exists", function() {
        $rootScope.$broadcast("$stateChangeStart", {
          name: "common.auth.unauthorized"
        }, {
          state: "existingState"
        }, null, {});

        $rootScope.$digest();

        $state.go.should.not.have.been.called;
      });

      it("should not redirect if existing state isnt there", function() {
        $rootScope.$broadcast("$stateChangeStart", {
          name: "common.auth.unregistered"
        }, {}, null, {});

        $rootScope.$digest();

        $state.go.should.not.have.been.called;
      });

      it("should redirect for unregistered state", function() {
        $rootScope.$broadcast("$stateChangeStart", {
          name: "common.auth.unregistered"
        }, {}, null, {
          state: "existingState"
        });

        $rootScope.$digest();

        $state.go.should.have.been.calledWith("common.auth.unregistered", {
          state: "existingState"
        });
      });

      it("should redirect for createaccount state", function() {
        $rootScope.$broadcast("$stateChangeStart", {
          name: "common.auth.createaccount"
        }, {}, null, {
          state: "existingState"
        });

        $rootScope.$digest();

        $state.go.should.have.been.calledWith("common.auth.createaccount", {
          state: "existingState"
        });
      });

    });
  });


});
