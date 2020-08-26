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
            showPlansModal: sinon.stub()
          };
        });
      });

      inject(function ($injector) {
        $state = $injector.get('$state');
        canAccessApps = $injector.get('canAccessApps');
        plansFactory = $injector.get('plansFactory');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
      });
  });

  var $state, canAccessApps, plansFactory, $rootScope, $location;

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

    it('should redirect to home',function(done){
      var canAccessApps = function() {
        return Q.resolve();
      };
      var $location = {
        search: function() { 
          return {};
        },
        replace: sinon.spy()
      };

      sinon.spy($state,'go');
      
      $state.get('common.auth.signup').controller[4]($location, $state, canAccessApps, plansFactory);
      setTimeout(function() {
        $location.replace.should.have.been.called;
        $state.go.should.have.been.calledWith('apps.home');

        done();
      }, 10);
    });

    it('should redirect to store product if signed in',function(done){
      var STORE_URL = "https://store.risevision.com/";
      var IN_RVA_PATH = "product/productId/?cid=companyId";

      var userState = {
        getSelectedCompanyId: function() {
          return 'cid123'
        }
      };
      var canAccessApps = function() {
        return Q.resolve()
      };
      var $location = {search: function() {return {show_product:123}}};
      var $window = {location:{}}

      $state.get('common.auth.signup').controller[4]($location, $state, canAccessApps, plansFactory);
      setTimeout(function() {
        expect(plansFactory.showPlansModal).to.have.been.called;
        done();
      }, 10);
    });

    it('should not redirect to store product if not signed in',function(done){
      var canAccessApps = function() {
        return Q.reject();
      };

      var $location = {search: function() {return {show_product:123}}};

      sinon.spy($state,'go');
      $state.get('common.auth.signup').controller[4]($location, $state, canAccessApps, plansFactory);

      setTimeout(function() {
        $state.go.should.not.have.been.called;

        done();
      }, 10);
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
