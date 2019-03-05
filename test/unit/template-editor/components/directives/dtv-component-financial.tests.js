'use strict';

describe('directive: TemplateComponentFinancial', function() {
  var $scope,
      element,
      factory,
      timeout;

  beforeEach(function() {
    factory = {};
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $timeout){
    $templateCache.put('partials/template-editor/components/component-financial.html', '<p>mock</p>');
    $scope = $rootScope.$new();
    $scope.registerDirective = sinon.stub();
    timeout = $timeout
    element = $compile("<template-component-financial></template-component-financial>")($scope);
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.registerDirective).to.have.been.called;
  });

  it('should reset all state flags on enter', function() {
    expect($scope.showInstrumentList).to.be.false;
    expect($scope.showSymbolSelector).to.be.false;
    expect($scope.enteringInstrumentSelector).to.be.false;
    expect($scope.exitingInstrumentSelector).to.be.false;
    expect($scope.enteringSymbolSelector).to.be.false;
    expect($scope.exitingSymbolSelector).to.be.false;
  });

  it('should define navigation functions', function() {
    expect($scope.showSymbolSearch).to.be.a('function');
    expect($scope.selectInstruments).to.be.a('function');
  });

  it('should show symbol search', function() {
    $scope.showSymbolSearch();

    expect($scope.showInstrumentList).to.be.false;
    expect($scope.showSymbolSelector).to.be.false;
    expect($scope.enteringSymbolSelector).to.be.true;
    expect($scope.exitingSymbolSelector).to.be.false;

    timeout.flush();

    expect($scope.showInstrumentList).to.be.false;
    expect($scope.showSymbolSelector).to.be.true;
    expect($scope.enteringSymbolSelector).to.be.false;
    expect($scope.exitingSymbolSelector).to.be.false;
  });

  it('should go back to instrument list', function() {
    $scope.showSymbolSearch();
    timeout.flush();

    $scope.selectInstruments();

    expect($scope.showInstrumentList).to.be.false;
    expect($scope.showSymbolSelector).to.be.false;
    expect($scope.enteringSymbolSelector).to.be.false;
    expect($scope.exitingSymbolSelector).to.be.true;

    timeout.flush();

    expect($scope.showInstrumentList).to.be.true;
    expect($scope.showSymbolSelector).to.be.false;
    expect($scope.enteringSymbolSelector).to.be.false;
    expect($scope.exitingSymbolSelector).to.be.false;
  });

});
