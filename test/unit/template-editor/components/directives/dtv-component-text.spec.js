'use strict';

describe('directive: templateComponentText', function() {
  var $scope,
      element,
      $window,
      $timeout,
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
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    componentsFactory = $injector.get('componentsFactory');
    attributeDataFactory = $injector.get('attributeDataFactory');

    sinon.stub($window, 'dispatchEvent');

    $templateCache.put('partials/template-editor/components/component-text.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    element = $compile("<template-component-text></template-component-text>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  afterEach(function() {
    $window.dispatchEvent.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect(componentsFactory.registerDirective).to.have.been.called;

    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-text');
    expect(directive.show).to.be.a('function');
    expect(directive.getName).to.be.a('function');

    expect($scope.alignmentOptions).to.be.an('array');
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

    it('should dispatch resize event on load', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];

      directive.show();

      $window.dispatchEvent.should.not.have.been.called;

      $timeout.flush();

      $window.dispatchEvent.should.have.been.called;
      expect($window.dispatchEvent.getCall(0).args[0]).to.be.ok;
      expect($window.dispatchEvent.getCall(0).args[0].type).to.equal('resize');
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

  describe('fontsize:', function() {
    it('should not show fontsize if option is not initialized', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];

      directive.show();

      expect($scope.showFontSize).to.be.false;
      expect($scope.fontsize).to.not.be.ok;
    });

    it('should load font size from blueprint', function() {
      attributeDataFactory.getAvailableAttributeData.withArgs('TEST-ID', 'fontsize').returns('15');

      var directive = componentsFactory.registerDirective.getCall(0).args[0];

      directive.show();

      expect(attributeDataFactory.getAvailableAttributeData).to.have.been.calledWith('TEST-ID', 'fontsize');

      expect($scope.showFontSize).to.be.true;
      expect($scope.fontsize).to.equal(15);
    });

    it('should not save font size if not shown', function() {
      $scope.showFontSize = false;
      $scope.fontsize = 12;

      $scope.save();

      expect(attributeDataFactory.setAttributeData).to.have.been.calledOnce;
    });

    it('should save font size to attribute data', function() {
      $scope.showFontSize = true;
      $scope.fontsize = 12;

      $scope.save();

      expect(attributeDataFactory.setAttributeData).to.have.been.calledWith(sinon.match.any, 'fontsize', 12);
    });

  });

  describe('alignment:', function() {
    it('should not show alignment if options are not initialized', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];

      directive.show();

      expect(attributeDataFactory.getAvailableAttributeData).to.have.been.calledWith('TEST-ID', 'verticalalign');
      expect(attributeDataFactory.getAvailableAttributeData).to.have.been.calledWith('TEST-ID', 'horizontalalign');

      expect($scope.showAlignment).to.be.false;
      expect($scope.alignment).to.not.be.ok;
    });

    it('should load alignment options from blueprint', function() {
      attributeDataFactory.getAvailableAttributeData.withArgs('TEST-ID', 'verticalalign').returns('bottom');
      attributeDataFactory.getAvailableAttributeData.withArgs('TEST-ID', 'horizontalalign').returns('center');

      var directive = componentsFactory.registerDirective.getCall(0).args[0];

      directive.show();

      expect(attributeDataFactory.getAvailableAttributeData).to.have.been.calledWith('TEST-ID', 'verticalalign');
      expect(attributeDataFactory.getAvailableAttributeData).to.have.been.calledWith('TEST-ID', 'horizontalalign');

      expect($scope.showAlignment).to.be.true;
      expect($scope.alignment).to.be.an('object');
      expect($scope.alignment.name).to.equal('Bottom Center');
    });

    it('should not save alignment if not shown', function() {
      $scope.showAlignment = false;
      $scope.alignment = $scope.alignmentOptions[3];

      $scope.save();

      expect(attributeDataFactory.setAttributeData).to.have.been.calledOnce;
    });

    it('should save alignment to attribute data', function() {
      $scope.showAlignment = true;
      $scope.alignment = $scope.alignmentOptions[3];

      $scope.save();

      expect(attributeDataFactory.setAttributeData).to.have.been.calledWith(sinon.match.any, 'verticalalign', 'middle');
      expect(attributeDataFactory.setAttributeData).to.have.been.calledWith(sinon.match.any, 'horizontalalign', 'left');
      expect(attributeDataFactory.setAttributeData).to.have.been.calledWith(sinon.match.any, 'textalign', 'left');
    });
  });

});
