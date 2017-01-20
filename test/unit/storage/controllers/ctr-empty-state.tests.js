'use strict';
describe('controller: Empty State', function() {
  beforeEach(module('risevision.storage.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('storageFactory',function(){
      return storageFactory = {
        selectorType: 'multiple-files-folders'
        }
    });
    $provide.value('SELECTOR_TYPES', {
      MULTIPLE_FILES_FOLDERS: 'multiple-files-folders'
    });
  }));
  var $scope, storageFactory;
  beforeEach(function(){
    inject(function($injector,$rootScope, $controller){

      $scope = $rootScope.$new();
      $controller('EmptyStateController', {
        $scope : $scope
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
  });

  it('should not default to MULTIPLE_FILES_FOLDERS',function(){
    expect($scope.isMultipleFilesFoldersSelector).to.be.true;
  });

});
