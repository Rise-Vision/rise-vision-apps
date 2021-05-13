'use strict';

describe('directive: templateComponent', function () {
  var $scope,
    element,
    componentsFactory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('storageManagerFactory', function() {
      return {};
    });
  }));


  beforeEach(inject(function ($compile, $templateCache, $rootScope, $injector) {
    componentsFactory = $injector.get('componentsFactory');

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

  it('should proxy componentsFactory functions', function () {
    expect($scope.registerDirective).to.equal(componentsFactory.registerDirective);
    expect($scope.editComponent).to.equal(componentsFactory.editComponent);
    expect($scope.showPreviousPage).to.equal(componentsFactory.showPreviousPage);
    expect($scope.resetPanelHeader).to.equal(componentsFactory.resetPanelHeader);
    expect($scope.setPanelIcon).to.equal(componentsFactory.setPanelIcon);
    expect($scope.setPanelTitle).to.equal(componentsFactory.setPanelTitle);
  });

});
