'use strict';

describe('directive: ComponentIcon', function () {
  var $scope,
    element,
    elementScope;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranlate()));


  beforeEach(inject(function ($compile, $rootScope) {
    $scope = $rootScope.$new();
    //the directive is using "replaceWith()" function, so in order to see rendered HTML we need to wrap it into <div> 
    //ref: https://stackoverflow.com/questions/18895738/#18898115
    element = $compile('<div> <component-icon icon="{{iconValue}}" type="{{typeValue}}"></component-icon> </div>')($scope);
    elementScope = element.children().isolateScope();
    $scope.$digest();
  }));

  it('should exist', function () {
    expect($scope).to.be.ok;
    expect(elementScope.icon).to.be.empty;
    expect(elementScope.type).to.be.empty;
  });

  it("should render Font Awesome icon", function (done) {
    $scope.iconValue = "fa-test";
    $scope.typeValue = undefined;
    $scope.$digest();

    setTimeout(function () {
      expect(elementScope.icon).to.equal("fa-test");
      expect(elementScope.type).to.be.empty;
      expect(element.children()[0].tagName).to.equal("I");
      done();
    });
  });

  it("should render SVG icon", function (done) {
    $scope.iconValue = "svg-data";
    $scope.typeValue = "svg";
    $scope.$digest();

    setTimeout(function () {
      expect(elementScope.icon).to.equal("svg-data");
      expect(elementScope.type).to.equal("svg");
      expect(element.children()[0].tagName.toUpperCase()).to.equal("SVG");
      done();
    });
  });

});
