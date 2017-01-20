'use strict';
describe('controller: StorageLoginCtrl', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('userState',function(){
      return {
        authenticatePopup: function() {
          return Q.resolve();
        }
      }
    });
    $provide.service('uiFlowManager', function() {
      return {
        invalidateStatus: function() {
          newStatus = true;
        }
      };
    });
  }));
  var $scope, newStatus;
  beforeEach(function(){
    newStatus = false;
    inject(function($injector,$rootScope, $controller){

      $scope = $rootScope.$new();
      $controller('StorageLoginCtrl', {
        $scope : $scope
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.login).to.be.a('function');
  });

  it('should log user in and update status',function(done){
    $scope.login().then(function() {
      expect(newStatus).to.be.true;
      
      done();
    })
    .then(null, done);
  });

});
