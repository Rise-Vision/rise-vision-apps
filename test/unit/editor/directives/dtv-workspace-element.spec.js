'use strict';
describe('directive: workspace-element', function() {
  var $scope,
      element,
      artboardFactory;

  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('artboardFactory', function() {
      return artboardFactory = {};
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $scope = _$rootScope_.$new();
    element = _$compile_("<div workspace-element></div>")($scope);
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
  });

  it('Should inject function to artboardFactory', function() {
    expect(artboardFactory.getWorkspaceElement).to.be.ok;
    expect(artboardFactory.getWorkspaceElement).to.be.a('function');
  });

  it('should return element',function(){
    expect(artboardFactory.getWorkspaceElement()).to.be.ok;
  });

});
