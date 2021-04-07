'use strict';

describe('directive: templateComponentHtml', function() {
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
    $templateCache.put('partials/template-editor/components/component-html.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();
    $scope.getAvailableAttributeData = sinon.stub().returns('data');

    element = $compile("<template-component-html></template-component-html>")($scope);
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
    expect(directive.type).to.equal('rise-html');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.icon).to.exist;
    expect(directive.show).to.be.a('function');
  });

  it('should load html from attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test html";
    $scope.getAvailableAttributeData.returns(sampleValue);

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.html).to.equal(sampleValue);
  });

  it('should save html to attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test html";
    $scope.getAvailableAttributeData.returns(sampleValue);

    directive.show();

    $scope.html = "updated html";

    $scope.save();

    expect($scope.setAttributeData.calledWith(
      "TEST-ID", "html", "updated html"
    )).to.be.true;
  });

});
