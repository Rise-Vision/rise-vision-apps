'use strict';
describe('controller: Sign In', function() {
  beforeEach(module('risevision.apps.launcher.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('canAccessApps', function() {
      return function() {
        var deferred = Q.defer();
        if(isLoggedIn) {
           deferred.resolve();
        } else {
          deferred.reject();
        }

        return deferred.promise;
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
  var $scope, isLoggedIn, currentState;
  beforeEach(function () {
    currentState = '';
  });

  it('should redirect user to home as it is already logged in',function(done){
    isLoggedIn = true;
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();

      $controller('SignInCtrl', {
        canAccessApps: $injector.get('canAccessApps'),
        $state: $injector.get('$state')
      });
      $scope.$digest();
    });

    setTimeout(function(){
      expect(currentState).to.equal('apps.launcher.home');
      done();
    },10);
  });

  it('should do nothing when it is not logged in',function(done){
    isLoggedIn = false;
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();

      $controller('SignInCtrl', {
        canAccessApps: $injector.get('canAccessApps'),
        $state: $injector.get('$state')
      });
      $scope.$digest();
    });

    setTimeout(function(){
      expect(currentState).to.not.equal('apps.launcher.home');
      done();
    },10);
  });
});
