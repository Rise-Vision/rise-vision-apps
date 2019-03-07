'use strict';
describe('controller: TemplateEditor', function() {

  var SAMPLE_COMPONENTS = [
    {
      "type": "rise-data-image",
      "id": "rise-data-image-01",
      "label": "template.rise-data-image",
      "attributes": {
        "file": {
          "label": "template.file",
          "value": "risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/rise-data-image-demo/heatmap-icon.png"
        }
      }
    },
    {
      "type": "rise-data-financial",
      "id": "rise-data-financial-01",
      "label": "template.rise-data-financial",
      "attributes": {
        "financial-list": {
          "label": "template.financial-list",
          "value": "-LNuO9WH5ZEQ2PLCeHhz"
        },
        "symbols": {
          "label": "template.symbols",
          "value": "CADUSD=X|MXNUSD=X|USDEUR=X"
        }
      }
    }
  ];

  var $scope,
    factory;

  beforeEach(function() {
    factory = { presentation: { templateAttributeData: {} } };
  });

  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.factory('templateEditorFactory',function() {
      return factory;
    });
  }));

  beforeEach(function() {
    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();

      $controller('TemplateEditorController', {
        $scope: $scope,
        editorFactory: $injector.get('templateEditorFactory')
      });

      $scope.$digest();
    });
  });

  it('should exist', function() {
    expect($scope).to.be.truely;
    expect($scope.factory).to.be.truely;
    expect($scope.factory.presentation).to.be.ok;
    expect($scope.factory.presentation.templateAttributeData).to.deep.equal({});
  });

  it('should define attribute and blueprint data functions',function() {
    expect($scope.getBlueprintData).to.be.a('function');
    expect($scope.getAttributeData).to.be.a('function');
    expect($scope.setAttributeData).to.be.a('function');
  });

  it('should get empty attribute data',function() {
    var data = $scope.getAttributeData("test-id");

    expect(data).to.deep.equal({ id: "test-id" });
    expect($scope.factory.presentation.templateAttributeData).to.deep.equal({
      components: [
        { id: "test-id" }
      ]
    });
  });

  it('should get undefined attribute data value',function() {
    var data = $scope.getAttributeData("test-id", "symbols");

    expect(data).to.not.be.ok;
  });

  it('should set an attribute data value',function() {
    $scope.setAttributeData("test-id", "symbols", "CADUSD=X|MXNUSD=X");

    expect($scope.factory.presentation.templateAttributeData).to.deep.equal({
      components: [
        {
          id: "test-id",
          symbols: "CADUSD=X|MXNUSD=X"
        }
      ]
    });
  });

  it('should get an attribute data value',function() {
    $scope.setAttributeData("test-id", "symbols", "CADUSD=X|MXNUSD=X");

    var data = $scope.getAttributeData("test-id", "symbols");

    expect(data).to.equal("CADUSD=X|MXNUSD=X");
  });

  it('should get attribute data',function() {
    $scope.setAttributeData("test-id", "symbols", "CADUSD=X|MXNUSD=X");

    var data = $scope.getAttributeData("test-id");

    expect(data).to.deep.equal({
      id: "test-id",
      symbols: "CADUSD=X|MXNUSD=X"
    });
  });

  it('should get null blueprint data',function() {
    factory.blueprintData = { components: [] };

    var data = $scope.getBlueprintData("rise-data-financial-01");

    expect(data).to.be.null;
  });

  it('should get null blueprint data value',function() {
    factory.blueprintData = { components: [] };

    var data = $scope.getBlueprintData("rise-data-financial-01", "symbols");

    expect(data).to.be.null;
  });

  it('should get blueprint data attributes',function() {
    factory.blueprintData = { components: SAMPLE_COMPONENTS };

    var data = $scope.getBlueprintData("rise-data-financial-01");

    expect(data).to.deep.equal({
      "financial-list": {
        "label": "template.financial-list",
        "value": "-LNuO9WH5ZEQ2PLCeHhz"
      },
      "symbols": {
        "label": "template.symbols",
        "value": "CADUSD=X|MXNUSD=X|USDEUR=X"
      }
    });
  });

  it('should get blueprint data value',function() {
    factory.blueprintData = { components: SAMPLE_COMPONENTS };

    var data = $scope.getBlueprintData("rise-data-financial-01", "symbols");

    expect(data).to.equal("CADUSD=X|MXNUSD=X|USDEUR=X");
  });

});
