'use strict';
describe('directive: toolbar', function() {
  var $compile,
      $rootScope,
      $scope,
      $q,
      element,
      addNewPlaceholderCalled,
      currentState,
      openPresentationPropertiesCalled,
      validatePresentationResp;

  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('editorFactory', function() {
      return {
        presentation: {},
        openPresentationProperties: function() {
          openPresentationPropertiesCalled = true;
        },
        validatePresentation: function() {
          return validatePresentationResp;
        }
      };
    });
    $provide.service('placeholdersFactory', function() {
      return {
        addNewPlaceholder: function(){
            addNewPlaceholderCalled = true;
        }
      };
    });
    $provide.service('$state', function() {
      return {
        go: function(state) {
          currentState = state;
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

    validatePresentationResp = $q.resolve();
  }));

  it('should exist', function() {
    expect($scope).to.be.truely;
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

  describe('showArtboard:',function(){
    it('should show artboard',function(done){
      $scope.showArtboard()
        .then(function() {
          expect($scope.designMode).to.be.true;
          done();
        });

      $scope.$digest();
    });

    it('should not show artboard because JSON is not valid',function(done){
      validatePresentationResp = $q.reject();

      $scope.showArtboard()
        .catch(function() {
          expect($scope.designMode).to.be.falsey;
          done();
        });

      $scope.$digest();
    });
  });

  describe('showHtmlEditor:',function(){
    it('should show html editor',function(){
      $scope.designMode = true;
      $scope.showHtmlEditor();
      expect($scope.designMode).to.be.false;
    });
  });
});
