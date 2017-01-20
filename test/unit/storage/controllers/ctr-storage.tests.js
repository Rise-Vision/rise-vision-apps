'use strict';
describe('controller: Storage', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('storageFactory',function(){
      return storageFactory = {
          storageFull: false,
          setSelectorType: function() {
            selectorTypeSet = true;
          }
        }
    });
  }));
  var $scope, storageFactory, selectorTypeSet;
  beforeEach(function(){
    selectorTypeSet = false;
    inject(function($injector,$rootScope, $controller){

      $scope = $rootScope.$new();
      $controller('StorageController', {
        $scope : $scope
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
  });

  it('should set storageFull',function(){
    expect(storageFactory.storageFull).to.be.true;
    expect(selectorTypeSet).to.be.true;
  });

});
