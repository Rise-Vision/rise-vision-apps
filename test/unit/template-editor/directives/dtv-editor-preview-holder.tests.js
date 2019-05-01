'use strict';

describe('directive: TemplateEditorPreviewHolder', function() {
  var sandbox = sinon.sandbox.create(),
      $scope,
      element,
      factory;

  beforeEach(function() {
    factory = {
      blueprintData: { width: "1000", height: "1000" }
    };
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

  beforeEach(inject(function($compile, $rootScope, $templateCache, $window){
    $templateCache.put('partials/template-editor/preview-holder.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    sandbox.stub($window.document, 'getElementById').returns({
      clientHeight: 500,
      setAttribute: function() {}
    });

    element = $compile("<template-editor-preview-holder></template-editor-preview-holder>")($scope);
    $scope.$digest();
  }));

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
  });

  it('should define component directive registry functions', function() {
    expect($scope.getEditorPreviewUrl).to.be.a('function');
    expect($scope.getTemplateAspectRatio).to.be.a('function');
  });

  describe('getTemplateAspectRatio', function() {
    it('should calculate the 100 aspect ratio', function() {
      factory.blueprintData = { width: "1000", height: "1000" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("100.00");
    });

    it('should calculate the 200 aspect ratio', function() {
      factory.blueprintData = { width: "1000", height: "2000" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("200.00");
    });

    it('should calculate the 50 aspect ratio', function() {
      factory.blueprintData = { width: "2000", height: "1000" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("50.00");
    });

    it('should calculate the 16:9 aspect ratio', function() {
      factory.blueprintData = { width: "1920", height: "1080" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("56.25");
    });

    it('should calculate the 4:3 aspect ratio', function() {
      factory.blueprintData = { width: "800", height: "600" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("75.00");
    });

    it('should calculate a 333.33 aspect ratio', function() {
      factory.blueprintData = { width: "300", height: "1000" };

      var aspectRatio = $scope.getTemplateAspectRatio();

      expect(aspectRatio).to.equal("333.33");
    });
  });

  describe('getMobileWidth', function() {
    it('should calculate mobile width for 16:9 aspect ratio', function() {
      factory.blueprintData = { width: "1920", height: "1080" };

      var aspectRatio = $scope.getMobileWidth();

      expect(aspectRatio).to.equal("284");
    });

    it('should calculate mobile width for 9:16 aspect ratio', function() {
      factory.blueprintData = { width: "1080", height: "1920" };

      var aspectRatio = $scope.getMobileWidth();

      expect(aspectRatio).to.equal("90");
    });
  });

  describe('getDesktopWidth', function() {
    it('should calculate desktop width for 16:9 aspect ratio', function() {
      factory.blueprintData = { width: "1920", height: "1080" };

      var aspectRatio = $scope.getDesktopWidth();

      expect(aspectRatio).to.equal("889");
    });

    it('should calculate desktop width for 9:16 aspect ratio', function() {
      factory.blueprintData = { width: "1080", height: "1920" };

      var aspectRatio = $scope.getDesktopWidth();

      expect(aspectRatio).to.equal("281");
    });
  });

});
