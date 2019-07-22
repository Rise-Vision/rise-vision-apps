'use strict';

describe('directive: TemplateComponentImage', function() {
  var $scope,
    element,
    factory,
    timeout;

  beforeEach(function() {
    factory = { selected: { id: 'TEST-ID' } };
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

    $provide.service('storageAPILoader', function() {
      return function() {
        return Q.resolve({
          files: {
            get: function() {
              return {
                result: {
                  result: true,
                  files: [{
                    metadata: {
                      thumbnail: "http://thumbnail.png"
                    }
                  }]
                }
              };
            }
          }
        });
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $timeout){
    $templateCache.put('partials/template-editor/components/component-image.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();
    $scope.showNextPanel = sinon.stub();
    $scope.getBlueprintData = function() {
      return null;
    };

    timeout = $timeout;
    element = $compile("<template-component-image></template-component-image>")($scope);
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
    expect(directive.type).to.equal('rise-image');
    expect(directive.icon).to.equal('fa-image');
    expect(directive.show).to.be.a('function');
    expect(directive.onBackHandler).to.be.a('function');
  });

  it('should set image lists when available as attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleImages = [
      { "file": 'image.png', "thumbnail-url": "http://image" }
    ];

    $scope.getAttributeData = function(componentId, key) {
      switch(key) {
        case 'metadata': return sampleImages;
        case 'files': return 'image.png';
      }
    };

    directive.show();

    expect($scope.selectedImages).to.deep.equal(sampleImages);

    timeout.flush();
  });

  it('should detect default images', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleImages = [
      { "file": "image.png", "thumbnail-url": "http://image" }
    ];

    $scope.getAttributeData = function(componentId, key) {
      switch(key) {
        case 'metadata': return sampleImages;
        case 'files': return 'image.png';
      }
    };
    $scope.getBlueprintData = function() {
      return "image.png";
    };

    directive.show();

    expect($scope.isDefaultImageList).to.be.true;

    timeout.flush();
  });

  it('should not consider a default value if it is not', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleImages = [
      { "file": "image.png", "thumbnail-url": "http://image" }
    ];

    $scope.getAttributeData = function(componentId, key) {
      switch(key) {
        case 'metadata': return sampleImages;
        case 'files': return 'image.png';
      }
    };
    $scope.getBlueprintData = function() {
      return "default.png";
    };

    directive.show();

    expect($scope.isDefaultImageList).to.be.false;

    timeout.flush();
  });

  it('should get thumbnail URLs when not available as attribute data', function(done) {
    var TEST_FILE = 'risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/file1.png';
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.getAttributeData = function() {
      return null;
    };
    $scope.getBlueprintData = function() {
      return TEST_FILE;
    };

    directive.show();
    timeout.flush();

    setTimeout(function() {
      var expectedMetadata = [
        {
          file: TEST_FILE,
          exists: true,
          'thumbnail-url': 'http://thumbnail.png'
        }
      ];

      timeout.flush();
      expect($scope.selectedImages).to.deep.equal(expectedMetadata);

      expect($scope.setAttributeData).to.have.been.called.twice;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', expectedMetadata
      )).to.be.true;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'files', TEST_FILE
      )).to.be.true;

      done();
    }, 100);
  });

  describe('updateImageMetadata', function() {

    var sampleImages;

    beforeEach(function() {
      sampleImages = [
        { "file": "image.png", exists: true, "thumbnail-url": "http://image" },
        { "file": "image2.png", exists: false, "thumbnail-url": "http://image2" }
      ];

      $scope.componentId = 'TEST-ID';
    });

    it('should directly set metadata if it\'s not already loaded', function()
    {
      $scope.getAttributeData = function() {
        return null;
      };

      $scope.updateImageMetadata(sampleImages);

      expect($scope.isDefaultImageList).to.be.false;
      expect($scope.selectedImages).to.deep.equal(sampleImages);

      expect($scope.setAttributeData).to.have.been.called.twice;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', sampleImages
      ), 'set metadata attribute').to.be.true;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'files', 'image.png|image2.png'
      ), 'set files attribute').to.be.true;
    });

    it('should combine metadata if it\'s already loaded', function()
    {
      var updatedImages = [
        { "file": "image.png", exists: false, "thumbnail-url": "http://image5" },
        { "file": "image2.png", exists: false, "thumbnail-url": "http://image6" }
      ];

      $scope.getAttributeData = function() {
        return sampleImages;
      };

      $scope.updateImageMetadata(updatedImages);

      expect($scope.isDefaultImageList).to.be.false;
      expect($scope.selectedImages).to.deep.equal(updatedImages);

      expect($scope.setAttributeData).to.have.been.called.twice;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', updatedImages
      ), 'set metadata attribute').to.be.true;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'files', 'image.png|image2.png'
      ), 'set files attribute').to.be.true;
    });

    it('should only update the provided images', function()
    {
      var updatedImages = [
        { "file": "image.png", exists: false, "thumbnail-url": "http://image5" }
      ];
      var expectedImages = [
        { "file": "image.png", exists: false, "thumbnail-url": "http://image5" },
        { "file": "image2.png", exists: false, "thumbnail-url": "http://image2" }
      ];

      $scope.getAttributeData = function() {
        return sampleImages;
      };

      $scope.updateImageMetadata(updatedImages);

      expect($scope.isDefaultImageList).to.be.false;
      expect($scope.selectedImages).to.deep.equal(expectedImages);

      expect($scope.setAttributeData).to.have.been.called.twice;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', expectedImages
      ), 'set metadata attribute').to.be.true;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'files', 'image.png|image2.png'
      ), 'set files attribute').to.be.true;
    });

    it('should not update images that are not already present', function()
    {
      var updatedImages = [
        { "file": "image.png", exists: false, "thumbnail-url": "http://image5" },
        { "file": "imageNew.png", exists: false, "thumbnail-url": "http://imageN" }
      ];
      var expectedImages = [
        { "file": "image.png", exists: false, "thumbnail-url": "http://image5" },
        { "file": "image2.png", exists: false, "thumbnail-url": "http://image2" }
      ];

      $scope.getAttributeData = function() {
        return sampleImages;
      };

      $scope.updateImageMetadata(updatedImages);

      expect($scope.isDefaultImageList).to.be.false;
      expect($scope.selectedImages).to.deep.equal(expectedImages);

      expect($scope.setAttributeData).to.have.been.called.twice;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'metadata', expectedImages
      ), 'set metadata attribute').to.be.true;

      expect($scope.setAttributeData.calledWith(
        'TEST-ID', 'files', 'image.png|image2.png'
      ), 'set files attribute').to.be.true;
    });

  });

});
