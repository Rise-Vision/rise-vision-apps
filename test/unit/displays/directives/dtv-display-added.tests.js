'use strict';
describe('directive: display added', function() {
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
    $templateCache.put('partials/displays/display-added.html', '<p></p>');
    $scope = $rootScope.$new();
    $compile = _$compile_;
    compileDirective();
  }));

  function compileDirective() {
    var tpl = '<display-added></display-added>';
    inject(function($compile) {
      elm = $compile(tpl)($scope);
    });
    $scope.$digest();

  }

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p></p>');
    expect($scope.display).to.be.an('object');
    expect($scope.display).to.deep.equal({});
  });
  
});
