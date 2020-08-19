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
        $state.go.should.have.been.calledWith('apps.launcher.home');

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
        $state.go.should.have.been.calledWith('apps.launcher.home');

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
  
  describe('state apps.launcher:', function() {
    it('should register launcher state',function(){
      var state = $state.get('apps.launcher');
      expect(state).to.be.ok;
      expect(state.abstract).to.be.true;
      expect(state.template).to.equal('<div class="app-launcher" ui-view></div>');
      expect(state.url).to.equal('?cid');
    });

    describe('launcher.home:', function() {
      it('should register launcher.home state',function(){
        var state = $state.get('apps.launcher.home');
        expect(state).to.be.ok;
        expect(state.url).to.equal('/');
        expect(state.controller).to.equal('AppsHomeCtrl');
      });

      it('should redirect to onboarding', function(done) {
        var canAccessApps = function() {
          return Q.resolve();
        };
        var onboardingFactory = {
          isOnboarding: function() {
            return true;
          }
        };

        var $location = {
          replace: sinon.spy()
        };

        sinon.spy($state, 'go');
        $state.get('apps.launcher.home').resolve.canAccessApps[4]($state, $location, canAccessApps, onboardingFactory);

        setTimeout(function() {
          $location.replace.should.have.been.called;
          $state.go.should.have.been.calledWith('apps.launcher.onboarding');

          done();
        }, 10);
      });

      it('should not redirect to onboarding if not required', function(done) {
        var canAccessApps = function() {
          return Q.resolve();
        };
        var onboardingFactory = {
          isOnboarding: function() {
            return false;
          }
        };

        var $location = {
          replace: sinon.spy()
        };

        sinon.spy($state, 'go');
        $state.get('apps.launcher.home').resolve.canAccessApps[4]($state, $location, canAccessApps, onboardingFactory);

        setTimeout(function() {
          $location.replace.should.not.have.been.called;
          $state.go.should.not.have.been.called;

          done();
        }, 10);
      });

    });

    describe('launcher.onboarding:', function() {
      it('should register launcher.onboarding state',function(){
        var state = $state.get('apps.launcher.onboarding');
        expect(state).to.be.ok;
        expect(state.url).to.equal('/onboarding');
        expect(state.controller).to.equal('OnboardingCtrl');
      });

      it('should redirect to home if not showing onboarding', function(done) {
        var canAccessApps = function() {
          return Q.resolve();
        };
        var onboardingFactory = {
          isOnboarding: function() {
            return false;
          }
        };

        var $location = {
          replace: sinon.spy()
        };

        sinon.spy($state, 'go');
        $state.get('apps.launcher.onboarding').resolve.canAccessApps[4]($state, $location, canAccessApps, onboardingFactory);

        setTimeout(function() {
          $location.replace.should.have.been.called;
          $state.go.should.have.been.calledWith('apps.launcher.home');

          done();
        }, 10);
      });

      it('should not redirect to home', function(done) {
        var canAccessApps = function() {
          return Q.resolve();
        };
        var onboardingFactory = {
          isOnboarding: function() {
            return true;
          }
        };

        var $location = {
          replace: sinon.spy()
        };

        sinon.spy($state, 'go');
        $state.get('apps.launcher.onboarding').resolve.canAccessApps[4]($state, $location, canAccessApps, onboardingFactory);

        setTimeout(function() {
          $location.replace.should.not.have.been.called;
          $state.go.should.not.have.been.called;

          done();
        }, 10);
      });
    });
  });

  describe('showWhiteBackground:', function(){
    it('should show white background for onboarding page',function() {
      $rootScope.$broadcast('$stateChangeSuccess', {name:'apps.launcher.onboarding'});
      $rootScope.$digest();
      expect($rootScope.showWhiteBackground).to.be.true;
    });

    it('should show white background for Apps Home page',function() {
      $rootScope.$broadcast('$stateChangeSuccess', {name:'apps.launcher.home'});
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
