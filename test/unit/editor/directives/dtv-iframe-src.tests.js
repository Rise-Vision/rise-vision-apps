'use strict';
describe('directive: iframe src', function() {
  beforeEach(module('risevision.editor.directives'));

  var elm, $scope, $compile;

  beforeEach(inject(function($rootScope, $compile) {
    $scope = $rootScope.$new();
    $scope.widgetUrl = 'https://risevision.com';

    elm = $compile('<iframe src="about:blank" iframe-src="widgetUrl"></iframe>')($scope);
    $scope.$digest();
  }));

  it('should set src property', function() {
    expect(elm.attr('src')).to.equal("https://risevision.com");
  })
});
