'use strict';
describe('directive: sidebar', function() {
  var $compile,
      $rootScope,
      placeholderFactory;

  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('placeholderFactory', function() {
      return {};
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, _placeholderFactory_, $templateCache){
    $templateCache.put('partials/editor/sidebar.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    placeholderFactory = _placeholderFactory_;
  }));

  it('Replaces the element with the appropriate content', function() {
    var element = $compile("<sidebar></sidebar>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should set showPlaylist by default',function(){
    var $scope = $rootScope.$new();
    var element = $compile("<sidebar></sidebar>")($scope);
    $scope.$apply();
    expect(element.scope().showPlaylist).to.be.true;
  });

  it('should watch placeholder',function(){
    var $scope = $rootScope.$new();
    var scopeWatchSpy = sinon.spy($scope, '$watch');
    var element = $compile("<sidebar></sidebar>")($scope);
    $scope.$apply();
    scopeWatchSpy.should.have.been.calledWith('factory.placeholder');
  });

  it('should set showPlaylist when placeholder changes',function(){
    var $scope = $rootScope.$new();
    var element = $compile("<sidebar></sidebar>")($scope);
    $scope.$apply();
    element.scope().showPlaylist = false;
    $scope.$apply();
    expect(element.scope().showPlaylist).to.be.false;

    placeholderFactory.placeholder = {};
    $scope.$apply();
    expect(element.scope().showPlaylist).to.be.true;
  });
});
