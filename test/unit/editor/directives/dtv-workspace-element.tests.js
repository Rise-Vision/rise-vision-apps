'use strict';
describe('directive: workspace-element', function() {
  var $scope,
      element,
      placeholdersFactory;

  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('placeholdersFactory', function() {
      return placeholdersFactory = {};
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

  it('Should inject function to placeholdersFactory', function() {
    expect(placeholdersFactory.getWorkspaceElement).to.be.ok;
    expect(placeholdersFactory.getWorkspaceElement).to.be.a('function');
  });

  it('should return element',function(){
    expect(placeholdersFactory.getWorkspaceElement()).to.be.ok;
  });

});
