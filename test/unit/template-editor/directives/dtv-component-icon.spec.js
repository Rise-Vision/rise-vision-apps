'use strict';

describe('directive: ComponentIcon', function () {
  var $scope,
    element,
    elementScope;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));


  beforeEach(inject(function ($compile, $rootScope) {
    $scope = $rootScope.$new();

    element = $compile('<component-icon icon="{{iconValue}}" type="{{typeValue}}">someicon</component-icon>')($scope);
    elementScope = element.isolateScope();
    $scope.$digest();
  }));

  it('should exist', function () {
    expect($scope).to.be.ok;
    expect(elementScope.icon).to.be.empty;
    expect(elementScope.type).to.be.empty;

    expect(element.html()).to.equal("");
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

});
