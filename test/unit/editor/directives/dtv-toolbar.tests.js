'use strict';
describe('directive: toolbar', function() {
  var $compile,
      $rootScope,
      $scope,
      $q,
      element,
      addNewPlaceholderCalled,
      openPresentationPropertiesCalled;

  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('editorFactory', function() {
      return {
        presentation: {},
        openPresentationProperties: function() {
          openPresentationPropertiesCalled = true;
        }
      };
    });
    $provide.service('artboardFactory', function() {
      return {}
    });
    $provide.service('placeholdersFactory', function() {
      return {
        addNewPlaceholder: function(){
            addNewPlaceholderCalled = true;
        }
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache, _$q_){
    $templateCache.put('partials/editor/toolbar.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $q = _$q_;
    element = $compile("<toolbar></toolbar>")($scope);
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.artboardFactory).to.be.ok;
    expect($scope.addNewPlaceholder).to.be.a('function');
    expect($scope.openProperties).to.be.a('function');
  });

  it('Replaces the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('addNewPlaceholder:',function(){
    it('should add new placeholder',function(){
      $scope.addNewPlaceholder();
      expect(addNewPlaceholderCalled).to.be.truely;
    });
  });

  describe('openProperties:',function(){
    it('should open properties',function(){
      $scope.openProperties();
      expect(openPresentationPropertiesCalled).to.be.truely;
    });
  });
});
