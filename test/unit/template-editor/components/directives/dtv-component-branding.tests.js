'use strict';

describe('directive: templateComponentBranding', function() {
  var $scope,
      element,
      factory,
      company,
      rootScope,
      compile;

  beforeEach(function() {
    factory = { selected: { id: "TEST-ID" } };
    company = {
      postalCode: '12345'
    };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    rootScope = $rootScope;
    compile = $compile;
    $templateCache.put('partials/template-editor/components/component-branding/component-branding.html', '<p>mock</p>');

    compileDirective();
  }));

  function compileDirective() {
    element = compile("<template-component-branding></template-component-branding>")(rootScope.$new());
    $scope = element.scope();

    $scope.registerDirective = sinon.stub();
    $scope.setPanelTitle = sinon.stub();

    $scope.$digest();
  }

  it('should compile html', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } })
    expect($scope.registerDirective).to.have.been.called;
  });

  it('should initialize directive', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-branding');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.icon).to.equal('ratingStar');
    expect(directive.show).to.be.a('function');
    expect(directive.onBackHandler).to.be.a('function');
  });

  it('directive.show: ', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    directive.show();

    $scope.setPanelTitle.should.have.been.calledWith('Branding Settings')
  });

  it('directive.onBackHandler: ', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    expect(directive.onBackHandler()).to.be.false;

    $scope.setPanelTitle.should.have.been.calledWith();
  });

});
