'use strict';

describe('directive: templateComponent', function () {
  var $scope,
    element;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('basicStorageSelectorFactory', function() {
      return {};
    });

    $provide.service('basicStorageSelectorFactory', function() {
      return {};
    });
  }));


  beforeEach(inject(function ($compile, $templateCache, $rootScope) {
    $scope = $rootScope.$new();

    $templateCache.put('partials/template-editor/component.html', '<p>mock</p>');
    element = $compile('<template-component></template-component>')($scope);
    $scope.$digest();
  }));

  it('should exist', function () {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.basicStorageSelectorFactory).to.be.ok;
  });

});
