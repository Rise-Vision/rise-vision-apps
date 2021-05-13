'use strict';

describe('directive: templateComponentHtml', function() {
  var $scope, $timeout,
      element,
      attributeDataFactory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('componentsFactory', function() {
      return { selected: { id: "TEST-ID" } };
    });

    $provide.service('attributeDataFactory', function() {
      return {
        setAttributeData: sinon.stub(),
        getAvailableAttributeData: sinon.stub().returns('data')
      };
    });

  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    $timeout = $injector.get('$timeout');
    attributeDataFactory = $injector.get('attributeDataFactory');

    $templateCache.put('partials/template-editor/components/component-html.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();

    element = $compile("<template-component-html></template-component-html>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.registerDirective).to.have.been.called;

    expect($scope.codemirrorOptions).to.deep.equal({});

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-html');
    expect(directive.show).to.be.a('function');
  });

  it('should load html from attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test html";
    attributeDataFactory.getAvailableAttributeData.returns(sampleValue);

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.html).to.equal(sampleValue);
  });

  it('should set codemirror options asynchronously', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    directive.show();

    $timeout.flush();

    expect($scope.codemirrorOptions).to.deep.equal({
      lineNumbers: true,
      theme: 'default',
      lineWrapping: false,
      mode: 'htmlmixed'
    });
  });

  it('should save html to attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test html";
    attributeDataFactory.getAvailableAttributeData.returns(sampleValue);

    directive.show();

    $scope.html = "updated html";

    $scope.save();

    expect(attributeDataFactory.setAttributeData.calledWith(
      "TEST-ID", "html", "updated html"
    )).to.be.true;
  });

});
