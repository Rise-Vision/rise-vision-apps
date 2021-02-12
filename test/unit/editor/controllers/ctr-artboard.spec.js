'use strict';
describe('controller: Artboard', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.factory('editorFactory',function(){
      return { };
    });
  }));
  var $scope;
  beforeEach(function(){


    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();

      $controller('ArtboardController', {
        $scope : $scope,
        editorFactory: $injector.get('editorFactory')

      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.truely;

    expect($scope.factory).to.be.truely;
    expect($scope.factory).to.deep.equal({});
  });
});
