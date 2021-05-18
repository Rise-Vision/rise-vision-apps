'use strict';

describe('directive: templateComponent', function () {
  var $scope,
    element;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('storageManagerFactory', function() {
      return {};
    });
    $provide.service('componentsFactory', function() {
      return {};
    });    
  }));


  beforeEach(inject(function ($compile, $templateCache, $rootScope, $injector) {
    $templateCache.put('partials/template-editor/component.html', '<p>mock</p>');
    element = $compile('<template-component></template-component>')($rootScope.$new());
    $rootScope.$digest();

    $scope = element.isolateScope();
  }));

  it('should exist', function () {
    expect($scope).to.be.ok;
    expect($scope.componentsFactory).to.be.ok;
    expect($scope.storageManagerFactory).to.be.ok;
  });

});
