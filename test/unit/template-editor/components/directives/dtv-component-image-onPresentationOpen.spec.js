'use strict';

describe('directive: TemplateComponentImage: onPresentationOpen', function() {
  var $scope,
    element,
    factory,
    componentsFactory,
    attributeDataFactory,
    timeout;

  beforeEach(function() {
    factory = {
      presentation: { id: 'TEST-ID' }
    };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('componentsFactory', function() {
      return {
        selected: { id: "TEST-ID" },
        registerDirective: sinon.stub()
      };
    });
    $provide.service('templateEditorFactory', function() {
      return factory;
    });
    $provide.service('attributeDataFactory', function() {
      return {
        getAttributeData: sinon.stub(),
        getAvailableAttributeData: sinon.stub(),
        setAttributeData: sinon.stub(),
        getBlueprintData: sinon.stub().returns(null),
        getComponentIds: sinon.stub().returns(['component1', 'component2'])
      };
    });
    $provide.service('logoImageFactory', function() {
      return {
        getImagesAsMetadata: function() { return []; }
      };
    });
    $provide.service('baseImageFactory', function() {
      return {
        getBlueprintData: function() { return {}; },
        isSetAsLogo: function() { return false; }
      };
    });
    $provide.service('fileExistenceCheckService', function() {
      return {
        requestMetadataFor: function() {
          return Q.resolve([]);
        }
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $timeout, $injector){
    componentsFactory = $injector.get('componentsFactory');
    attributeDataFactory = $injector.get('attributeDataFactory');

    $templateCache.put('partials/template-editor/components/component-image.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    componentsFactory.registerDirective = sinon.stub();
    $scope.fileExistenceChecksCompleted = {};

    timeout = $timeout;
    element = $compile("<template-component-image></template-component-image>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should check file existence when presentation opens', function(done)
  {
    // I had to mock as this because directly setting $q provider above broke registerDirective() call
    $scope.waitForPresentationId = function(metadata) {
      return Q.resolve(metadata);
    };

    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    var sampleImages = [
      { "file": 'image.png', "thumbnail-url": "http://image" },
      { "file": 'test.jpg', "thumbnail-url": "http://test.jpg" }
    ];

    attributeDataFactory.getAttributeData = function(componentId, key) {
      switch(key) {
        case 'metadata': return sampleImages;
        case 'files': return 'image.png|test.png';
      }
    };

    directive.onPresentationOpen();

    expect($scope.fileExistenceChecksCompleted).to.deep.equal({
      component1: false,
      component2: false
    });

    setTimeout(function() {
      expect($scope.fileExistenceChecksCompleted).to.deep.equal({
        component1: true,
        component2: true
      });

      done();
    }, 100);
  });

});
