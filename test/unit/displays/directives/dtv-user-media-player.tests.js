'use strict';
describe('directive: user media player', function() {
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory',function(){
      return {
        display: {}
      }
    });

  }));
  
  var elm, $scope, $compile;

  beforeEach(inject(function($rootScope, _$compile_, $templateCache) {
    $templateCache.put('partials/displays/user-media-player.html', '<p></p>');
    $scope = $rootScope.$new();
    $compile = _$compile_;
    compileDirective();
  }));

  function compileDirective() {
    var tpl = '<user-media-player></user-media-player>';
    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });
    $scope.$digest();

  }

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p></p>');
    expect($scope.setCurrentTab).to.be.a('function');
    expect($scope.currentTab).to.equal('windows');
  });

  it('should set current tab', function() {
    $scope.setCurrentTab('linux');

    expect($scope.currentTab).to.equal('linux');
  });
  
});
