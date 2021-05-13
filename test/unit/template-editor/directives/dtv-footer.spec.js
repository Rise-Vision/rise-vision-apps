'use strict';

describe('directive: footer', function() {
  var element, $scope;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));

  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return {};
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/footer.html', '<p>mock</p>');

    $scope = $rootScope.$new();
    element = $compile('<template-editor-footer></template-editor-footer>')($scope);
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.templateEditorFactory).to.be.ok;
  });

  it('Replaces the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

});
