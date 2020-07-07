'use strict';

describe('directive: templateComponentSchedules', function() {
  var $scope,
      element,
      rootScope,
      compile;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    rootScope = $rootScope;
    compile = $compile;
    $templateCache.put('partials/template-editor/components/component-schedules.html', '<p>mock</p>');

    compileDirective();
  }));

  function compileDirective() {
    element = compile("<template-component-schedules></template-component-schedules>")(rootScope.$new());
    $scope = element.scope();

    $scope.registerDirective = sinon.stub();
    $scope.resetPanelHeader = sinon.stub();
    $scope.setPanelTitle = sinon.stub();
    $scope.setPanelIcon = sinon.stub();
    $scope.showPreviousPanel = sinon.stub();
    $scope.editComponent = sinon.stub();

    $scope.$digest();
  }

  it('should compile html', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.registerDirective).to.have.been.called;
  });

  it('should initialize directive', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-schedules');
    expect(directive.show).to.be.a('function');
    expect(directive.onBackHandler).to.be.a('function');
  });

  it('directive.show: ', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    directive.show();

    $scope.setPanelTitle.should.have.been.calledWith('Schedules');
  });

  it('directive.onBackHandler: ', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.showTooltip = true;

    directive.onBackHandler();

    expect($scope.showTooltip).to.be.false;
  });

});
