'use strict';

describe('directive: templateBrandingColors', function() {
  var $scope,
      element,
      factory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('brandingFactory', function() {
      return factory = {
        setUnsavedChanges: sinon.spy()
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/components/component-branding/branding-colors.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    element = $compile("<template-branding-colors></template-branding-colors>")($scope);
    $scope = element.scope();

    $scope.registerDirective = sinon.stub();
    $scope.setPanelTitle = sinon.stub();
    $scope.setPanelIcon = sinon.stub();
    $scope.showPreviousPanel = sinon.stub();

    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.brandingFactory).to.be.ok;
    expect($scope.saveBranding).to.be.a('function');
    expect($scope.registerDirective).to.have.been.called;
  });

  it('should initialize directive', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-branding-colors');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.icon).to.equal('palette');
    expect(directive.panel).to.equal('.branding-colors-container');
    expect(directive.show).to.be.a('function');
    expect(directive.onBackHandler).to.be.a('function');
  });

  it('saveBranding: ', function() {
    $scope.saveBranding();

    factory.setUnsavedChanges.should.have.been.called;
  });

  it('colorpicker-selected event: ', function() {
    $scope.$emit('colorpicker-selected');
    $scope.$digest();

    factory.setUnsavedChanges.should.have.been.called;
  });

  it('directive.show: ', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    directive.show();

    $scope.setPanelTitle.should.have.been.calledWith('Color Settings');
  });

  it('directive.onBackHandler: ', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    $scope.showPreviousPanel.returns('backPanel');

    expect(directive.onBackHandler()).to.equal('backPanel');

    $scope.setPanelTitle.should.have.been.calledWith('Brand Settings');
    $scope.setPanelIcon.should.have.been.calledWith('ratingStar', 'streamline');

    $scope.showPreviousPanel.should.have.been.called;
  });

});
