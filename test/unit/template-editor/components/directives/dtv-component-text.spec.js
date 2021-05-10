'use strict';

describe('directive: templateComponentText', function() {
  var $scope,
      element,
      factory;

  beforeEach(function() {
    factory = { selected: { id: "TEST-ID" } };
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
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/components/component-text.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();
    $scope.getAvailableAttributeData = sinon.stub().returns('data');

    element = $compile("<template-component-text></template-component-text>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } })
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-text');
    expect(directive.show).to.be.a('function');
  });

  it('should load text from attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test text";
    $scope.getAvailableAttributeData.returns(sampleValue);

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.value).to.equal(sampleValue);
  });

  it('should load multiline attribute from blueprint', function() {
    $scope.getAvailableAttributeData.returns(true);
    var directive = $scope.registerDirective.getCall(0).args[0];

    directive.show();

    expect($scope.getAvailableAttributeData).to.have.been.calledWith('TEST-ID', 'multiline');
    expect($scope.isMultiline).to.be.true;
  });

  it('should save text to attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test text";
    $scope.getAvailableAttributeData.returns(sampleValue);

    directive.show();

    $scope.value = "updated text";

    $scope.save();

    expect($scope.setAttributeData.calledWith(
      "TEST-ID", "value", "updated text"
    )).to.be.true;
  });

});
