'use strict';

describe('directive: brandingColors', function() {
  var $scope,
      element,
      factory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('brandingFactory', function() {
      return factory = {
        updateDraftColors: sinon.spy()
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/components/component-branding/branding-colors.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    element = $compile("<branding-colors></branding-colors>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.brandingFactory).to.be.ok;
    expect($scope.saveBranding).to.be.a('function');
  });

  it('saveBranding: ', function() {
    $scope.saveBranding();

    factory.updateDraftColors.should.have.been.called;
  });

});
