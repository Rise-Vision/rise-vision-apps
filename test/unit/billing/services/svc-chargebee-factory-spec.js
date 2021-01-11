"use strict";

describe("Services: ChargebeeFactory", function() {
  var sandbox = sinon.sandbox.create();
  var clock, $rootScope, $window, $loading, userState, storeService, plansFactory, currentPlanFactory, chargebeePortal;

  beforeEach(module("risevision.apps.billing.services"));

  beforeEach(module(function ($provide) {
    $provide.value("CHARGEBEE_TEST_SITE", "risevision-test");
    $provide.value("CHARGEBEE_PROD_SITE", "risevision");
    $provide.service("$rootScope", function() {
      return {
        $emit: function() {}
      };
    });
    $provide.service("$q", function() {return Q;});
    $provide.service("$loading", function() {
      return {
        startGlobal: sandbox.stub(),
        stopGlobal: sandbox.stub()
      };
    });
    $provide.service("storeService", function() {
      return {
        createSession: function() {}
      };
    });
    $provide.service("userState", function() {
      return {
        isTestCompanySelected: function() {
          return true;
        }
      };
    });
    $provide.service("plansFactory", function() {
      return {
        showPurchaseOptions: sinon.stub(),
        isPlansModalOpen: false
      };
    });
    $provide.service("currentPlanFactory", function() {
      return {
        currentPlan: {
          isPurchasedByParent: false
        }
      };
    });
  }));

  beforeEach(function() {
    inject(function($injector, _$rootScope_) {
      $rootScope = _$rootScope_;
      $window = $injector.get("$window");
      $loading = $injector.get("$loading");
      userState = $injector.get("userState");
      storeService = $injector.get("storeService");
      plansFactory = $injector.get("plansFactory");
      currentPlanFactory = $injector.get("currentPlanFactory");

      chargebeePortal = {
        open: sandbox.stub()
      };
      $window.Chargebee = {
        init: function () {
          return {
            createChargebeePortal: function () {
              return chargebeePortal;
            },
            logout: sandbox.stub(),
            setPortalSession: sandbox.stub()
          };
        },
        getPortalSections: function () {
          return {
            ACCOUNT_DETAILS: "ACCOUNT_DETAILS",
            ADDRESS: "ADDRESS",
            PAYMENT_SOURCES: "PAYMENT_SOURCES",
            SUBSCRIPTION_DETAILS: "SUBSCRIPTION_DETAILS",
            EDIT_SUBSCRIPTION: "EDIT_SUBSCRIPTION"
          };
        }
      };
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("getChargebeeInstance: ", function() {
    var getChargebeeInstance;

    beforeEach(function() {
      clock = sandbox.useFakeTimers(Date.now());

      inject(function($injector) {
        getChargebeeInstance = $injector.get("getChargebeeInstance");
      });
    });

    it("should exist", function() {
      expect(getChargebeeInstance).to.be.ok;
      expect(getChargebeeInstance).to.be.a("function");
    });

    it("should return a new session", function(done) {
      sandbox.stub(storeService, "createSession").returns(Q.resolve({
        id: "sessionId1"
      }));

      getChargebeeInstance("companyId1").then(function() {
        expect(storeService.createSession).to.have.been.calledOnce;
        expect($loading.startGlobal).to.have.been.calledOnce;
        expect($loading.stopGlobal).to.have.been.calledOnce;
        done();
      });
    });

    it("should use the same session when requesting the same companyId", function(done) {
      sandbox.stub(storeService, "createSession").returns(Q.resolve({
        id: "sessionId1"
      }));

      getChargebeeInstance("companyId1").then(function() {
        getChargebeeInstance("companyId1").then(function() {
          expect(storeService.createSession).to.have.been.calledOnce;
          done();
        });
      });
    });

    it("should return a new session when requesting the same companyId but current session has expired", function(done) {
      var sessionStart = String(Date.now() / 1000);
      var sessionExpiration = String(Date.now() / 1000 + 60 * 60);

      sandbox.stub(storeService, "createSession").returns(Q.resolve({
        id: "sessionId1",
        created_at: sessionStart,
        expires_at: sessionExpiration
      }));

      getChargebeeInstance("companyId1").then(function() {
        clock.tick(60 * 60 * 1000 - 30000);

        getChargebeeInstance("companyId1").then(function() {
          expect(storeService.createSession).to.have.been.calledTwice;
          done();
        });
      });
    });

    it("should return a new session when requesting a different companyId", function(done) {
      sandbox.stub(storeService, "createSession").returns(Q.resolve({
        id: "sessionId1"
      }));

      getChargebeeInstance("companyId1").then(function() {
        getChargebeeInstance("companyId2").then(function() {
          expect(storeService.createSession).to.have.been.calledTwice;
          done();
        });
      });
    });

    describe("_handleChargebeePortalError", function() {
      it("should handle failure", function(done) {
        sandbox.stub(storeService, "createSession").returns(Q.reject("error"));

        getChargebeeInstance("companyId1").catch(function(err) {
          expect(err).to.equal("error");
          done();
        });
      });
    });
  });

  describe("ChargebeeFactory: ", function() {
    var chargebeeFactoryInstance;
    var chargebeeSections;

    beforeEach(function() {
      inject(function($injector) {
        chargebeeFactoryInstance = $injector.get("ChargebeeFactory")();
        chargebeeSections = $window.Chargebee.getPortalSections();

        sandbox.stub(storeService, "createSession").returns(Q.resolve({
          id: "sessionId1"
        }));
      });
    });

    it("should exist", function() {
      expect(chargebeeFactoryInstance).to.be.ok;
      expect(chargebeeFactoryInstance.openPortal).to.be.a("function");
    });

    it("should open Customer Portal for a Test company", function(done) {
      sandbox.spy($window.Chargebee, "init");
      sandbox.stub(userState, "isTestCompanySelected").returns(true);

      chargebeeFactoryInstance.openPortal("companyId1");

      setTimeout(function () {
        expect($window.Chargebee.init.getCall(0).args[0].site).to.equal("risevision-test");
        expect(chargebeePortal.open).to.have.been.calledOnce;
        expect(plansFactory.showPurchaseOptions).to.not.have.been.called;
        expect(plansFactory.apiError).to.not.be.ok;
        done();
      });
    });

    it("should open Customer Portal for a Prod company", function(done) {
      sandbox.spy($window.Chargebee, "init");
      sandbox.stub(userState, "isTestCompanySelected").returns(false);

      chargebeeFactoryInstance.openPortal("companyId1");

      setTimeout(function () {
        expect($window.Chargebee.init.getCall(0).args[0].site).to.equal("risevision");
        expect(chargebeePortal.open).to.have.been.calledOnce;
        expect(plansFactory.showPurchaseOptions).to.not.have.been.called;
        expect(plansFactory.apiError).to.not.be.ok;
        done();
      });
    });

    it("should fail to create a Customer Portal session", function(done) {
      storeService.createSession.restore();

      sandbox.spy($window.Chargebee, "init");
      sandbox.stub(userState, "isTestCompanySelected").returns(true);
      sandbox.stub(storeService, "createSession").returns(Q.reject("API error"));

      chargebeeFactoryInstance.openPortal("companyId1");

      setTimeout(function () {
        expect(chargebeePortal.open).to.not.have.been.called;
        expect(plansFactory.showPurchaseOptions).to.not.have.been.called;
        expect(plansFactory.apiError).to.be.not.null;
        done();
      });
    });

    it("should open Account Details section", function(done) {
      chargebeeFactoryInstance.openAccountDetails("companyId1");

      setTimeout(function () {
        expect(chargebeePortal.open).to.have.been.calledOnce;
        expect(chargebeePortal.open.getCall(0).args[1].sectionType).to.equal(chargebeeSections.ACCOUNT_DETAILS);
        expect(plansFactory.apiError).to.not.be.ok;
        done();
      });
    });

    it("should open Address section", function(done) {
      chargebeeFactoryInstance.openAddress("companyId1");

      setTimeout(function () {
        expect(chargebeePortal.open).to.have.been.calledOnce;
        expect(chargebeePortal.open.getCall(0).args[1].sectionType).to.equal(chargebeeSections.ADDRESS);
        expect(plansFactory.apiError).to.not.be.ok;
        done();
      });
    });

    it("should open Payment Sources section", function(done) {
      chargebeeFactoryInstance.openPaymentSources("companyId1");

      setTimeout(function () {
        expect(chargebeePortal.open).to.have.been.calledOnce;
        expect(chargebeePortal.open.getCall(0).args[1].sectionType).to.equal(chargebeeSections.PAYMENT_SOURCES);
        expect(plansFactory.apiError).to.not.be.ok;
        done();
      });
    });

    it("should open Subscription Details section", function(done) {
      chargebeeFactoryInstance.openSubscriptionDetails("companyId1", "subs1");

      setTimeout(function () {
        expect(chargebeePortal.open).to.have.been.calledOnce;
        expect(chargebeePortal.open.getCall(0).args[1].sectionType).to.equal(chargebeeSections.SUBSCRIPTION_DETAILS);
        expect(chargebeePortal.open.getCall(0).args[1].params.subscriptionId).to.equal("subs1");
        expect(plansFactory.apiError).to.not.be.ok;
        done();
      });
    });

    it("should open Edit Subscription section", function(done) {
      chargebeeFactoryInstance.openEditSubscription("companyId1", "subs1");

      setTimeout(function () {
        expect(chargebeePortal.open).to.have.been.calledOnce;
        expect(chargebeePortal.open.getCall(0).args[1].sectionType).to.equal(chargebeeSections.EDIT_SUBSCRIPTION);
        expect(chargebeePortal.open.getCall(0).args[1].params.subscriptionId).to.equal("subs1");
        expect(plansFactory.apiError).to.not.be.ok;
        done();
      });
    });

    describe("companies with origin=chargebee without Chargebee account", function () {
      beforeEach(function() {
        storeService.createSession.restore(); // Method was already mocked

        sandbox.stub(storeService, "createSession").returns(Q.reject({
          status: 404
        }));
      });

      it("should show Plans Modal for companies with origin=chargebee without Chargebee account", function(done) {
        sandbox.stub(userState, "isTestCompanySelected").returns(true);

        chargebeeFactoryInstance.openPortal("companyId1");

        setTimeout(function () {
          expect(chargebeePortal.open).to.not.have.been.called;
          expect(plansFactory.showPurchaseOptions).to.have.been.calledOnce;

          done();
        });
      });

      it("should open Store Account instead of Customer Portal Account Details", function(done) {
        chargebeeFactoryInstance.openAccountDetails("companyId1");

        setTimeout(function () {
          expect(chargebeePortal.open).to.not.have.been.called;
          expect(plansFactory.showPurchaseOptions).to.have.been.calledOnce;
          done();
        });
      });

      it("should open Store Account instead of Customer Portal Address", function(done) {
        chargebeeFactoryInstance.openAddress("companyId1");

        setTimeout(function () {
          expect(chargebeePortal.open).to.not.have.been.called;
          expect(plansFactory.showPurchaseOptions).to.have.been.calledOnce;
          done();
        });
      });

      it("should open Store Account instead of Customer Portal Billing Sources", function(done) {
        chargebeeFactoryInstance.openPaymentSources("companyId1");

        setTimeout(function () {
          expect(chargebeePortal.open).to.not.have.been.called;
          expect(plansFactory.showPurchaseOptions).to.have.been.calledOnce;
          done();
        });
      });

      it("should open Store Account instead of Customer Portal Subscription Details", function(done) {
        chargebeeFactoryInstance.openSubscriptionDetails("companyId1");

        setTimeout(function () {
          expect(chargebeePortal.open).to.not.have.been.called;
          expect(plansFactory.showPurchaseOptions).to.have.been.calledOnce;
          done();
        });
      });

      it("should open Store Account instead of Customer Portal Edit Subscription", function(done) {
        chargebeeFactoryInstance.openEditSubscription("companyId1");

        setTimeout(function () {
          expect(chargebeePortal.open).to.not.have.been.called;
          expect(plansFactory.showPurchaseOptions).to.have.been.calledOnce;
          done();
        });
      });

      describe("companies with Plans Purchased by Parent", function () {
        it("should return 403 error", function(done) {
          currentPlanFactory.currentPlan.isPurchasedByParent = true;

          chargebeeFactoryInstance.openPortal("companyId1");

          setTimeout(function () {
            expect(chargebeePortal.open).to.not.have.been.called;
            expect(plansFactory.showPurchaseOptions).to.not.have.been.called;
            expect(chargebeeFactoryInstance.apiError).to.equal(403);

            done();
          });
        });

      });

    });

  });
});
