'use strict';
describe('controller: TemplateEditor', function() {
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.factory('templateEditorFactory',function() {
      return {};
    });
  }));

  var $scope;

  beforeEach(function() {
    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();

      $controller('TemplateEditorController', {
        $scope: $scope,
        editorFactory: $injector.get('templateEditorFactory')
      });

      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.truely;
    expect($scope.factory).to.be.truely;
  });
});
