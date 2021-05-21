'use strict';

describe('directive: templateComponentText', function() {
  var $scope,
      element,
      componentsFactory,
      attributeDataFactory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('componentsFactory', function() {
      return {
        selected: { id: "TEST-ID" },
        registerDirective: sinon.stub()
      };
    });

    $provide.service('attributeDataFactory', function() {
      return {
        setAttributeData: sinon.stub(),
        getAvailableAttributeData: sinon.stub().returns('data')
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    componentsFactory = $injector.get('componentsFactory');
    attributeDataFactory = $injector.get('attributeDataFactory');

    $templateCache.put('partials/template-editor/components/component-text.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    element = $compile("<template-component-text></template-component-text>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect(componentsFactory.registerDirective).to.have.been.called;

    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-text');
    expect(directive.show).to.be.a('function');
    expect(directive.getName).to.be.a('function');
  });

  describe('show:', function() {
    it('should load text from attribute data', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];
      var sampleValue = "test text";
      attributeDataFactory.getAvailableAttributeData.returns(sampleValue);

      directive.show();

      expect($scope.componentId).to.equal("TEST-ID");
      expect($scope.value).to.equal(sampleValue);
    });

    it('should load multiline attribute from blueprint', function() {
      attributeDataFactory.getAvailableAttributeData.returns(true);
      var directive = componentsFactory.registerDirective.getCall(0).args[0];

      directive.show();

      expect(attributeDataFactory.getAvailableAttributeData).to.have.been.calledWith('TEST-ID', 'multiline');
      expect($scope.isMultiline).to.be.true;
    });
  });

  it('getName:', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    var sampleValue = "test text";
    attributeDataFactory.getAvailableAttributeData.returns(sampleValue);

    expect(directive.getName('componentId')).to.equal(sampleValue);

    attributeDataFactory.getAvailableAttributeData.should.have.been.calledWith('componentId', 'value');
  });

  describe('save:', function() {
    it('should save text to attribute data', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];
      var sampleValue = "test text";
      attributeDataFactory.getAvailableAttributeData.returns(sampleValue);

      directive.show();

      $scope.value = "updated text";

      $scope.save();

      expect(attributeDataFactory.setAttributeData.calledWith(
        "TEST-ID", "value", "updated text"
      )).to.be.true;
    });    
  });

});
