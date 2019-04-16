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
  
  var elm, $scope;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    var tpl = '<user-media-player></user-media-player>';
    $templateCache.put('partials/displays/user-media-player.html', '<p></p>');

    elm = $compile(tpl)($rootScope.$new());
    $rootScope.$digest();
    
    $scope = elm.scope();
  }));

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
