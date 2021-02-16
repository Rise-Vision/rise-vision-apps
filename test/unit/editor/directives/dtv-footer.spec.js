'use strict';
describe('directive: footer', function() {
  var $scope,
      element;

  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('editorFactory', function() {
      return {};
    });
    $provide.service('artboardFactory', function() {
      return {};
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/editor/footerbar.html', '<p>mock</p>');
    $scope = $rootScope.$new();
    element = $compile("<footer></footer>")($scope);
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.artboardFactory).to.ok;
  });

  it('Replaces the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

});
