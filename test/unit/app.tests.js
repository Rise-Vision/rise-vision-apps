'use strict';

describe('app:', function() {
  beforeEach(function () {
    angular.module('risevision.apps.partials',[]);

    module('risevision.apps');

    module(function ($provide) {
      $provide.service('canAccessApps',function(){
        return sinon.spy(function() {
          return Q.resolve("auth");
        })
      });

      $provide.service('plansFactory',function(){
        return {
          showPurchaseOptions: sinon.stub()
        };
      });

      $provide.service('$modal', function() {
        return {
          open: sinon.stub().returns({result: Q.resolve()})
        }
      });

    });

    inject(function ($injector) {
      $state = $injector.get('$state');
      canAccessApps = $injector.get('canAccessApps');
      plansFactory = $injector.get('plansFactory');
      userState = $injector.get('userState');
      $rootScope = $injector.get('$rootScope');
      $location = $injector.get('$location');
      $modal = $injector.get('$modal');
    });
  });

  var $state, canAccessApps, plansFactory, userState, $rootScope, $location, $modal;

  describe('state apps.plans:',function(){
    it('should register state',function(){
      var state = $state.get('apps.plans');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/plans?cid');
      expect(state.controller).to.be.ok;
    });

    it('should redirect to home',function(done){
      var $location = {
        search: function() { 
          return {};
        },
        replace: sinon.spy()
      };
      sinon.spy($state,'go');
      
      $state.get('apps.plans').controller[2]($location, $state);
      setTimeout(function() {
        $location.replace.should.have.been.called;
        $state.go.should.have.been.calledWith('apps.home');

        done();
      }, 10);
    });

  });

  describe('state apps.users.add:',function(){
    it('should register parent',function(){
      var state = $state.get('apps.users');
      expect(state).to.be.ok;
      expect(state.url).to.equal('?cid');
      expect(state.abstract).to.be.true;
      expect(state.template).to.equal('<div ui-view></div>');
    });

    it('should register state',function(){
      var state = $state.get('apps.users.add');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/users/add');
      expect(state.controller).to.be.ok;
    });

    it('should redirect to home',function(done){
      var $location = {
        search: function() { 
          return {};
        },
        replace: sinon.spy()
      };
      sinon.spy($state,'go');
      
      $state.get('apps.users.add').controller[2]($location, $state);
      setTimeout(function() {
        $location.replace.should.have.been.called;
        $state.go.should.have.been.calledWith('apps.home');

        done();
      }, 10);
    });

  });

  describe('onboarding links', function() {
    it('should show purchase options for apps.plans', function(done) {
      $state.go('apps.plans');
      $rootScope.$digest();

      setTimeout(function() {
        expect(plansFactory.showPurchaseOptions).to.have.been.called;
        expect($modal.open).to.not.have.been.called;

        done();
      }, 10);

    });

    it('should show purchase options for /signup?show_product=true', function(done) {
      sinon.stub($location, 'search').returns({
        show_product: true
      });
      $state.go('common.auth.signup');
      $rootScope.$digest();

      setTimeout(function() {
        expect(plansFactory.showPurchaseOptions).to.have.been.called;
        expect($modal.open).to.not.have.been.called;

        done();
      }, 10);

    });

    it('should not show purchase options for /signup', function(done) {
      $state.go('common.auth.signup');
      $rootScope.$digest();

      setTimeout(function() {
        expect(plansFactory.showPurchaseOptions).to.not.have.been.called;
        expect($modal.open).to.not.have.been.called;

        done();
      }, 10);
    });

    it('should check next state and show add user modal', function(done) {
      sinon.stub(userState, 'getSelectedCompanyId').returns('selectedCompanyId');

      $state.go('apps.users.add');
      $rootScope.$digest();

      setTimeout(function() {
        expect(plansFactory.showPurchaseOptions).to.not.have.been.called;
        $modal.open.should.have.been.calledWith({
          templateUrl: 'partials/common-header/user-settings-modal.html',
          controller: 'AddUserModalCtrl',
          resolve: sinon.match.object
        });
        expect($modal.open.getCall(0).args[0].resolve.companyId()).to.equal('selectedCompanyId');

        done();
      }, 10);
    });


  });

  describe('state apps.home:',function(){
    it('should register state',function(){
      var state = $state.get('apps.home');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/');
      expect(state.controller).to.be.ok;
    });

    it('should redirect to editor',function(){
      var $location = {
        replace: sinon.spy()
      };

      sinon.spy($state,'go');
      
      $state.get('apps.home').controller[2]($location, $state);

      $location.replace.should.have.been.called;
      $state.go.should.have.been.calledWith('apps.editor.home');
    });
  });

  describe('state common.auth.signup:',function(){
    it('should register state',function(){
      var state = $state.get('common.auth.signup');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/signup');
      expect(state.controller).to.be.ok;
    });

    it('should redirect to home',function(){
      var $location = {
        replace: sinon.spy()
      };
      sinon.spy($state,'go');
      
      $state.get('common.auth.signup').controller[2]($location, $state);

      $rootScope.$digest();

      $location.replace.should.have.been.called;
      $state.go.should.have.been.calledWith('apps.home');
    });
  });

  describe('state common.auth.signin:',function(){
    it('should register state',function(){
      var state = $state.get('common.auth.signin');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/signin');
      expect(state.controller).to.be.ok;
    });

    it('should redirect to home',function(done){
      var canAccessApps = function() {
        return Q.resolve();
      };

      sinon.spy($state,'go');

      var $location = {
        replace: sinon.spy()
      };

      $state.get('common.auth.signin').controller[3]($state, canAccessApps, $location);
      setTimeout(function() {
        $location.replace.should.have.been.called;
        $state.go.should.have.been.calledWith('apps.home');

        done();
      }, 10);
    });

    it('should not redirect to home if not signed in',function(done){
      var canAccessApps = function() {
        return Q.reject();
      };

      sinon.spy($state,'go');

      var $location = {
        replace: sinon.spy()
      };

      $state.get('common.auth.signin').controller[3]($state, canAccessApps, $location);
      setTimeout(function() {
        $location.replace.should.not.have.been.called;
        $state.go.should.not.have.been.called;

        done();
      }, 10);
    });
  });

  describe('showWhiteBackground:', function(){
    beforeEach(function() {
      $rootScope.$digest();
    });

    it('should show white background for the Schedule page page',function() {
      $rootScope.$broadcast('$stateChangeSuccess', {name:'apps.schedules.details'});
      $rootScope.$digest();
      expect($rootScope.showWhiteBackground).to.be.true;
    });

    it('should not show white background for other pages',function() {
      $rootScope.$broadcast('$stateChangeSuccess', {name:'apps.editor.list'});
      $rootScope.$digest();
      expect($rootScope.showWhiteBackground).to.be.false;
    });

  });

});
