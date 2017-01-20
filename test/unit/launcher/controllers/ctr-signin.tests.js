'use strict';
describe('controller: Sign In', function() {
  beforeEach(module('risevision.apps.launcher.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('userState', function() {
      return {
        authenticate: function(forceAuth) {

          var deferred = Q.defer();
          if(!forceAuth){
            goToLogin = false;
            if(isLoggedIn) {

               deferred.resolve();
            } else {
              deferred.reject();
            }
          }else{
            goToLogin = true;
            deferred.resolve();
          }

          return deferred.promise;
        }
      };
    });
    $provide.service('$state',function(){
      return {
        _state : '',
        go : function(state, params){
          if (state){
            this._state = state;
          }
          currentState = this._state;
          return this._state;
        }
      }
    });
  }));
  var $scope, isLoggedIn, goToLogin, currentState;
  beforeEach(function () {
    currentState = '';
  });

  it('should redirect user to home as it is already logged in',function(done){
    isLoggedIn = true;
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();

      $controller('SignInCtrl', {
        userState: $injector.get('userState'),
        $state: $injector.get('$state')
      });
      $scope.$digest();
    });

    setTimeout(function(){
      expect(goToLogin).to.be.false;
      expect(currentState).to.equal('apps.launcher.home');
      done();
    },10);
  });

  it('should redirect to google auth when it is not logged in',function(done){
    isLoggedIn = false;
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();

      $controller('SignInCtrl', {
        userState: $injector.get('userState'),
        $state: $injector.get('$state')
      });
      $scope.$digest();
    });

    setTimeout(function(){
      expect(goToLogin).to.be.true;
      expect(currentState).to.not.equal('apps.launcher.home');
      done();
    },10);
  });
});
