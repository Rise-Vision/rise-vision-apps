'use strict';

describe('directive: templateBrandingColors', function() {
  var $scope,
      element,
      componentsFactory,
      brandingFactory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('componentsFactory', function() {
      return {
        selected: { id: "TEST-ID" },
        registerDirective: sinon.stub()
      };
    });

    $provide.service('brandingFactory', function() {
      return brandingFactory = {
        setUnsavedChanges: sinon.spy()
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    componentsFactory = $injector.get('componentsFactory');
    brandingFactory = $injector.get('brandingFactory');

    $templateCache.put('partials/template-editor/components/component-branding/branding-colors.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    element = $compile("<template-branding-colors></template-branding-colors>")($scope);
    $scope = element.scope();

    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.brandingFactory).to.be.ok;
    expect($scope.saveBranding).to.be.a('function');
    expect(componentsFactory.registerDirective).to.have.been.called;
  });

  it('should initialize directive', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-branding-colors');
  });

  it('saveBranding: ', function() {
    $scope.saveBranding();

    brandingFactory.setUnsavedChanges.should.have.been.called;
  });

  it('colorpicker-selected event: ', function() {
    $scope.$emit('colorpicker-selected');
    $scope.$digest();

    brandingFactory.setUnsavedChanges.should.have.been.called;
  });

});
