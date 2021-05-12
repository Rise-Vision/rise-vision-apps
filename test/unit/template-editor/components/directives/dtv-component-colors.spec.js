'use strict';

describe('directive: templateComponentColors', function() {
  var $scope,
    element,
    factory,
    attributeDataFactory;

  beforeEach(function() {
    factory = { selected: { id: 'TEST-ID' } };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });

    $provide.service('attributeDataFactory', function() {
      return {
        setAttributeDataGlobal: sinon.stub(),
        getAttributeDataGlobal: sinon.stub()
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    attributeDataFactory = $injector.get('attributeDataFactory');

    $templateCache.put('partials/template-editor/components/component-colors.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();

    element = $compile('<template-component-colors></template-component-colors>')($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: 'TEST-ID' } });
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-override-brand-colors');
    expect(directive.show).to.be.a('function');
  });

  it('should save colors if override is true', function() {
    $scope.override = true;
    $scope.baseColor = 'red';
    $scope.accentColor = 'green';
    $scope.save();
    expect(attributeDataFactory.setAttributeDataGlobal.calledWith('brandingOverride', {baseColor: 'red', accentColor: 'green'})).to.be.true;
  });

  it('should not save colors if override is false', function() {
    $scope.override = false;
    $scope.baseColor = 'red';
    $scope.accentColor = 'green';
    $scope.save();
    expect(attributeDataFactory.setAttributeDataGlobal.calledWith('brandingOverride', null)).to.be.true;
  });

  it('should load colors and set override to true', function() {
    attributeDataFactory.getAttributeDataGlobal.returns({baseColor: 'red', accentColor: 'green'});
    $scope.load();
    expect($scope.override).to.be.true;
    expect($scope.baseColor).to.equal('red');
    expect($scope.accentColor).to.equal('green');
  });

  it('should set override to false', function() {
    attributeDataFactory.getAttributeDataGlobal.returns(null);
    $scope.load();
    expect($scope.override).to.be.false;
  });

  it('should save baseColor on change', function() {
    attributeDataFactory.getAttributeDataGlobal.returns({baseColor: 'red', accentColor: 'green'});
    $scope.load(); //register $watch for baseColor
    $scope.$digest();

    $scope.save = sinon.stub();

    $scope.baseColor = 'blue';
    $scope.$digest();

    expect($scope.save).to.be.calledOnce;
  });

  it('should save accentColor on change', function() {
    attributeDataFactory.getAttributeDataGlobal.returns({baseColor: 'red', accentColor: 'green'});
    $scope.load(); //register $watch for accentColor
    $scope.$digest();

    $scope.save = sinon.stub();

    $scope.accentColor = 'blue';
    $scope.$digest();

    expect($scope.save).to.be.calledOnce;
  });

});
