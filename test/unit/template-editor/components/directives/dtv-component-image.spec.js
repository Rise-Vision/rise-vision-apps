'use strict';

describe('directive: TemplateComponentImage', function() {
  var $scope,
    element,
    factory,
    timeout,
    baseImageFactory,
    logoImageFactory,
    storageManagerFactory,
    sandbox = sinon.sandbox.create(),
    fileDownloader = sandbox.stub();

  beforeEach(function() {
    factory = { selected: { id: 'TEST-ID' } };
  });

  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });
    $provide.service('logoImageFactory', function() {
      return {
        getBlueprintData: sandbox.stub().returns({}),
        getImagesAsMetadata: sandbox.stub().returns([]),
        areChecksCompleted: sandbox.stub().returns(true),
        getDuration: sandbox.stub().returns(10),
        getTransition: sandbox.stub().returns(null),
        getHelpText: sandbox.stub().returns(null)
      };
    });
    $provide.service('baseImageFactory', function() {
      return {
        getBlueprintData: sandbox.stub().returns({}),
        getImagesAsMetadata: sandbox.stub().returns([]),
        areChecksCompleted: sandbox.stub().returns(true),
        getDuration: sandbox.stub().returns(10),
        getTransition: sandbox.stub().returns(null),
        removeImage: sandbox.stub().returns(Q.resolve()),
        isSetAsLogo: sandbox.stub().returns(false),
        setTransition: sandbox.stub(),
        getHelpText: sandbox.stub().returns('help text')
      };
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
                    },
                    timeCreated: {
                      value: 100
                    }
                  }]
                }
              };
            }
          }
        });
      };
    });
    $provide.factory('fileDownloader', function() {
      return fileDownloader;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $timeout, $injector){
    $templateCache.put('partials/template-editor/components/component-image.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    baseImageFactory = $injector.get('baseImageFactory');
    logoImageFactory = $injector.get('logoImageFactory');
    storageManagerFactory = $injector.get('storageManagerFactory');

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();
    $scope.editComponent = sinon.stub();
    $scope.fileExistenceChecksCompleted = {};
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
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } });
    expect($scope.isEditingLogo).to.be.a('function');
    expect($scope.sortItem).to.be.a('function');
    expect($scope.saveDuration).to.be.a('function');
    expect($scope.saveTransition).to.be.a('function');
  });

  describe('registerDirective:', function() {
    describe('image:', function() {
      it('should initialize', function() {
        $scope.registerDirective.should.have.been.calledTwice;

        var directive = $scope.registerDirective.getCall(0).args[0];
        expect(directive).to.be.ok;
        expect(directive.type).to.equal('rise-image');
        expect(directive.iconType).to.equal('streamline');
        expect(directive.icon).to.equal('image');
        expect(directive.element).to.be.an('object');
        expect(directive.panel).to.equal('.image-component-container');
        expect(directive.show).to.be.a('function');
        expect(directive.onBackHandler).to.be.a('function');
      });

      it('show:', function() {
        $scope.registerDirective.getCall(0).args[0].show();

        expect(storageManagerFactory.fileType).to.equal('image');
        expect(storageManagerFactory.isSingleFileSelector).to.equal($scope.isEditingLogo);
        expect(storageManagerFactory.onSelectHandler).to.be.a('function');
      });
    });

    describe('logo:', function() {
      it('should initialize', function() {
        var directive = $scope.registerDirective.getCall(1).args[0];
        expect(directive).to.be.ok;
        expect(directive.type).to.equal('rise-image-logo');
        expect(directive.iconType).to.equal('streamline');
        expect(directive.icon).to.equal('circleStar');
        expect(directive.title).to.equal('Logo Settings');
        expect(directive.element).to.be.an('object');
        expect(directive.panel).to.equal('.image-component-container');
        expect(directive.show).to.be.a('function');
      });

      it('show:', function() {
        $scope.registerDirective.getCall(0).args[0].show();

        expect(storageManagerFactory.fileType).to.equal('image');
        expect(storageManagerFactory.isSingleFileSelector).to.equal($scope.isEditingLogo);
        expect(storageManagerFactory.onSelectHandler).to.be.a('function');
      });
    });
  });

  it('uploadManager:', function() {
    expect($scope.uploadManager).to.be.ok;
    expect($scope.uploadManager.isSingleFileSelector).to.be.ok;
    expect($scope.uploadManager.isSingleFileSelector).to.equal($scope.isEditingLogo);
    expect($scope.uploadManager.onUploadStatus).to.be.ok;
    expect($scope.uploadManager.addFile).to.be.ok;
  });

  describe('show',function(){

    it('should use logoImageFactory when opening logo settings',function(){
      var directive = $scope.registerDirective.getCall(1).args[0];
      logoImageFactory.getImagesAsMetadata.returns([]);

      $scope.factory.selected = {type:'rise-image'};

      directive.show();

      expect(logoImageFactory.getImagesAsMetadata).to.have.been.called;
      expect(baseImageFactory.getImagesAsMetadata).to.not.have.been.called;
    });

    it('should use baseImageFactory when opening images',function(){
      var directive = $scope.registerDirective.getCall(0).args[0];
      logoImageFactory.getImagesAsMetadata.returns([]);

      $scope.factory.selected = {type:'rise-image', id:'image-id'};

      directive.show();

      expect(baseImageFactory.getImagesAsMetadata).to.have.been.called;
      expect(baseImageFactory.componentId).to.equal('image-id');
      expect($scope.helpText).to.equal('help text');
    });

    it('should set image lists when available as attribute data', function() {
      var directive = $scope.registerDirective.getCall(0).args[0];
      var sampleImages = [
        { "file": 'image.png', "thumbnail-url": "http://image" },
        { "file": 'test|character.jpg', "thumbnail-url": "http://test%7Ccharacter.jpg" }
      ];

      baseImageFactory.getImagesAsMetadata.returns(sampleImages);

      directive.show();

      expect($scope.selectedImages).to.deep.equal(sampleImages);
      expect($scope.factory.loadingPresentation).to.be.true;

      timeout.flush();
    });

    it('should detect default images', function() {
      var directive = $scope.registerDirective.getCall(0).args[0];
      var sampleImages = [
        { "file": "image.png", "thumbnail-url": "http://image" }
      ];

      baseImageFactory.getImagesAsMetadata.returns(sampleImages);
      baseImageFactory.getBlueprintData.returns("image.png");

      directive.show();

      expect($scope.isDefaultImageList).to.be.true;

      timeout.flush();
    });

    it('should not consider a default value if it is not', function() {
      var directive = $scope.registerDirective.getCall(0).args[0];
      var sampleImages = [
        { "file": "image.png", "thumbnail-url": "http://image" }
      ];

      baseImageFactory.getImagesAsMetadata.returns(sampleImages);
      baseImageFactory.getBlueprintData.returns("default.png");

      directive.show();

      expect($scope.isDefaultImageList).to.be.false;

      timeout.flush();
    });

    it('should show logo when isLogo is true and a logo is available',function(){
      var directive = $scope.registerDirective.getCall(0).args[0];
      var sampleImages = [
        { "file": 'logo.png', "thumbnail-url": "http://logo" }
      ];

      logoImageFactory.getImagesAsMetadata.returns(sampleImages);
      baseImageFactory.isSetAsLogo.returns(true);

      directive.show();

      expect($scope.selectedImages).to.deep.equal(sampleImages);
    });
  });

  describe('updateFileMetadata', function() {

    var sampleImages;

    beforeEach(function() {
      sampleImages = [
        {
          "file": "image.png",
          exists: true,
          "thumbnail-url": "http://image",
          "time-created": "123"
        },
        {
          "file": "image2.png",
          exists: false,
          "thumbnail-url": "http://image2",
          "time-created": "345"
        }
      ];

      baseImageFactory.componentId = 'TEST-ID';
    });

    it('should directly set metadata if it\'s not already loaded', function()
    {
      $scope.getAttributeData = function() {
        return null;
      };

      $scope.updateFileMetadata(baseImageFactory.componentId, sampleImages);

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

    it('should combine metadata if it\'s already loaded', function(){
      var updatedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "987"
        },
        {
          "file": "image2.png",
          exists: false,
          "thumbnail-url": "http://image6",
          "time-created": "654"
        }
      ];

      $scope.getAttributeData = function() {
        return sampleImages;
      };

      $scope.updateFileMetadata(baseImageFactory.componentId, updatedImages);

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

    it('should only update the provided images', function() {
      var updatedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "876"
        }
      ];
      var expectedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "876"
        },
        {
          "file": "image2.png",
          exists: false,
          "thumbnail-url": "http://image2",
          "time-created": "345"
        }
      ];

      $scope.getAttributeData = function() {
        return sampleImages;
      };

      $scope.updateFileMetadata(baseImageFactory.componentId, updatedImages);

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

    it('should not update images that are not already present', function() {
      var updatedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "999"
        },
        {
          "file": "imageNew.png",
          exists: false,
          "thumbnail-url": "http://imageN",
          "time-created": "432"
        }
      ];
      var expectedImages = [
        {
          "file": "image.png",
          exists: false,
          "thumbnail-url": "http://image5",
          "time-created": "999"
        },
        {
          "file": "image2.png",
          exists: false,
          "thumbnail-url": "http://image2",
          "time-created": "345"
        }
      ];

      $scope.getAttributeData = function() {
        return sampleImages;
      };

      $scope.updateFileMetadata(baseImageFactory.componentId, updatedImages);

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

  describe('removeImageFromList',function(){
    it('should forward call to imageFactory and update with the result',function(done){
      var image = {file:'file1'};
      var expectedImages = [{file: 'file2'}];
      baseImageFactory.removeImage.returns(Q.resolve(expectedImages));

      $scope.removeImageFromList(image);

      baseImageFactory.removeImage.should.have.been.calledWith(image);
      setTimeout(function(){
        expect($scope.selectedImages).to.deep.equal(expectedImages);
        done();
      },10);
    });
  });

  describe('isEditingLogo:',function(){
    it('should default to false',function(){
      expect($scope.isEditingLogo()).be.false;
    });

    it('should be be true when picking logo',function(){
      var directive = $scope.registerDirective.getCall(1).args[0];

      directive.show();

      expect($scope.isEditingLogo()).be.true;
    });

    it('should be false picking a regular image',function(){
      var directive = $scope.registerDirective.getCall(0).args[0];

      directive.show();

      expect($scope.isEditingLogo()).be.false;
    });
  });

  describe('onDesignPublished:', function() {
    it('should download canva file and update canvaUploadList', function(done) {
      var file = {};
      fileDownloader.resolves(file);

      var options = {
        exportUrl: 'http://localhost/image.png',
        designId: '123',
        designTitle: 'title'
      };     
      $scope.onDesignPublished(options);

      setTimeout(function() {
        fileDownloader.should.have.been.calledWith(options.exportUrl,'canva/title_123.png');
        expect($scope.canvaUploadList).to.deep.equal([file]);
        done();
      });
    });

    it('should handle title not provided', function(done) {
      var file = {};
      fileDownloader.resolves(file);

      var options = {
        exportUrl: 'http://localhost/image.png',
        designId: '123',
      };     
      $scope.onDesignPublished(options);

      setTimeout(function() {
        fileDownloader.should.have.been.calledWith(options.exportUrl,'canva/123.png');
        expect($scope.canvaUploadList).to.deep.equal([file]);
        done();
      });
    });
  });

  it('selectFromStorage:', function() {
    $scope.selectFromStorage();

    $scope.editComponent.should.have.been.calledWith({
      type: 'rise-storage-selector'
    });
  });

  describe('sortItem: ', function() {
    var _callSort = function(oldIndex, newIndex) {
      $scope.sortItem({
        data: {
          oldIndex: oldIndex,
          newIndex: newIndex
        }
      });
    };

    beforeEach(function() {
      $scope.selectedImages = [
        'image0',
        'image1',
        'image2',
        'image3'
      ];
    });

    it('should move item up/down: ', function() {
      _callSort(0, 1);

      expect($scope.selectedImages.indexOf('image0')).to.equal(1);

      _callSort(2, 1);

      expect($scope.selectedImages.indexOf('image2')).to.equal(1);
      expect($scope.selectedImages.indexOf('image0')).to.equal(2);

      _callSort(2, 0);
      expect($scope.selectedImages.indexOf('image0')).to.equal(0);
    });

  });

  describe('saveTransition:', function() {
    it('should forward call to imageFactory', function() {
      $scope.values.transition = 'fadeIn';
      $scope.saveTransition();
      expect(baseImageFactory.setTransition).to.have.been.calledWith('fadeIn');
    });
  });

});
