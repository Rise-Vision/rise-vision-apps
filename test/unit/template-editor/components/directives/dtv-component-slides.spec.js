'use strict';

describe('directive: templateComponentSlides', function() {
  var $scope,
      element,
      componentsFactory,
      attributeDataFactory,
      slidesUrlValidationService,
      sandbox = sinon.sandbox.create();

  beforeEach(function() {
    slidesUrlValidationService = { validate: sandbox.stub().returns(Q.resolve()) };
  });

  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('componentsFactory', function() {
      return {
        selected: { id: "TEST-ID" },
        registerDirective: sandbox.stub()
      };
    });

    $provide.service('attributeDataFactory', function() {
      return {
        setAttributeData: sandbox.stub()
      };
    });

    $provide.service('slidesUrlValidationService', function() {
      return slidesUrlValidationService;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    componentsFactory = $injector.get('componentsFactory');
    attributeDataFactory = $injector.get('attributeDataFactory');

    $templateCache.put('partials/template-editor/components/component-slides.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    componentsFactory.registerDirective = sandbox.stub();

    element = $compile("<template-component-slides></template-component-slides>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect(componentsFactory.registerDirective).to.have.been.called;

    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-slides');
    expect(directive.show).to.be.a('function');
  });

  it('should load Slides URL from attribute data', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    var sampleData = {
      src: 'https://docs.google.com/presentation/d/e/2PACX-1vTncMMQxJIzZNdNIFqAsTI8ydohnKU97taOG-dvwYcxS3d0DjdkLlcEqUQKeL-z_nvYQIcFwxKC81b1/pub?start=false&loop=false&delayms=3000'
    };

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleData[attributeName];
    };

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.src).to.equal(sampleData.src);
  });

  it('should load duration from attribute data', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    var sampleData = {
      src: 'https://docs.google.com/presentation/d/e/2PACX-1vTncMMQxJIzZNdNIFqAsTI8ydohnKU97taOG-dvwYcxS3d0DjdkLlcEqUQKeL-z_nvYQIcFwxKC81b1/pub?start=false&loop=false&delayms=3000',
      duration: 2
    };

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleData[attributeName];
    };

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.duration).to.equal(sampleData.duration);
  });

  it('should set duration to 10 when default value and blueprint are undefined', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return undefined;
    };

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.duration).to.equal(10);
  });

  it('should validate URL when is shown', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    var sampleData = {
      src: 'https://docs.google.com/presentation/d/e/2PACX-1vTncMMQxJIzZNdNIFqAsTI8ydohnKU97taOG-dvwYcxS3d0DjdkLlcEqUQKeL-z_nvYQIcFwxKC81b1/pub?start=false&loop=false&delayms=3000',
      duration: 2
    };

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleData[attributeName];
    };

    directive.show();

    expect(slidesUrlValidationService.validate).to.have.been.called;
  });

  describe('URL input', function() {

    beforeEach(function() {
      var sampleData = {
        src: 'https://docs.google.com/presentation/d/e/2PACX-1vTncMMQxJIzZNdNIFqAsTI8ydohnKU97taOG-dvwYcxS3d0DjdkLlcEqUQKeL-z_nvYQIcFwxKC81b1/pub?start=false&loop=false&delayms=3000',
        duration: 2
      };
  
      attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
        return sampleData[attributeName];
      };
    });

    it('should accept Slides ID as src', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];
      
      directive.show();
  
      var slideId = '1tB3mxkrQcNSfVCCKzFEAfb-KNXWEePu7EnP8MWqUVV8';
      $scope.src = slideId;
      $scope.saveSrc();
  
      expect($scope.src).to.equal('https://docs.google.com/presentation/d/' + slideId + '/embed');
    });
  
    it('should accept published URL as src', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];
  
      directive.show();
  
      var publishedUrl = 'https://docs.google.com/presentation/d/e/2PACX-1vTncMMQxJIzZNdNIFqAsTI8ydohnKU97taOG-dvwYcxS3d0DjdkLlcEqUQKeL-z_nvYQIcFwxKC81b1/pub?start=false&loop=false&delayms=3000';
      $scope.src = publishedUrl;
      $scope.saveSrc();
  
      expect($scope.src).to.equal(publishedUrl);
    });
  
    it('should accept browser URL as src', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];
  
      directive.show();
  
      var browserSlidesUrl = 'https://docs.google.com/presentation/d/1tB3mxkrQcNSfVCCKzFEAfb-KNXWEePu7EnP8MWqUVV8/edit#slide=id.p';
      $scope.src = browserSlidesUrl;
      $scope.saveSrc();
  
      expect($scope.src).to.equal('https://docs.google.com/presentation/d/1tB3mxkrQcNSfVCCKzFEAfb-KNXWEePu7EnP8MWqUVV8/embed');
    });
  
    it('should accept empty URL as src', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];

      directive.show();
  
      var emptyUrl = '';
      $scope.src = emptyUrl;
      $scope.saveSrc();
  
      expect($scope.src).to.equal(emptyUrl);
    });

    it('should not accept non Slides URL as src', function() {
      var directive = componentsFactory.registerDirective.getCall(0).args[0];

      directive.show();
  
      var nonSlidesUrl = 'https://www.risevision.com';
      $scope.src = nonSlidesUrl;
      $scope.saveSrc();
  
      expect($scope.src).to.equal(nonSlidesUrl);
      expect($scope.validationResult).to.equal('INVALID');
    });

  });

});
