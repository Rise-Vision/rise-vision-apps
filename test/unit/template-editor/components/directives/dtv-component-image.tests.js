'use strict';

describe('directive: TemplateComponentImage', function() {
  var $scope,
    element,
    factory,
    timeout,
    regularImageFactory,
    logoImageFactory,
    sandbox = sinon.sandbox.create();

  beforeEach(function() {
    factory = { selected: { id: 'TEST-ID' } };
  });

  afterEach(function() {
    sandbox.restore();
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
    $provide.service('logoImageFactory', function() {
      return {
        getBlueprintData: sandbox.stub().returns({}),
        getImagesAsMetadata: sandbox.stub().returns([]),
        areChecksCompleted: sandbox.stub().returns(true),
        getDuration: sandbox.stub().returns(10)
      };
    });
    $provide.service('regularImageFactory', function() {
      return {
        getBlueprintData: sandbox.stub().returns({}),
        getImagesAsMetadata: sandbox.stub().returns([]),
        areChecksCompleted: sandbox.stub().returns(true),
        getDuration: sandbox.stub().returns(10),
        canRemoveImage: sandbox.stub().returns(Q.resolve()),
        removeImage: sandbox.stub()
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
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $timeout, $injector){
    $templateCache.put('partials/template-editor/components/component-image.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    regularImageFactory = $injector.get('regularImageFactory');
    logoImageFactory = $injector.get('logoImageFactory');

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();
    $scope.showNextPanel = sinon.stub();
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
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } })
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-image');
    expect(directive.icon).to.equal('image');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.show).to.be.a('function');
    expect(directive.onBackHandler).to.be.a('function');
  });

  describe('show',function(){

    it('should use logoImageFactory when opening logo settings',function(){
      var directive = $scope.registerDirective.getCall(0).args[0];
      logoImageFactory.getImagesAsMetadata.returns([]);

      $scope.factory.selected = {type:'rise-image'};

      directive.show();

      expect(logoImageFactory.getImagesAsMetadata).to.have.been.called;
      expect(regularImageFactory.getImagesAsMetadata).to.not.have.been.called;
    });

    it('should use regularImageFactory whne opening images',function(){
      var directive = $scope.registerDirective.getCall(0).args[0];
      logoImageFactory.getImagesAsMetadata.returns([]);

      $scope.factory.selected = {type:'rise-image', id:'image-id'};

      directive.show();

      expect(regularImageFactory.getImagesAsMetadata).to.have.been.called;
      expect(regularImageFactory.componentId).to.equal('image-id');
      expect(logoImageFactory.getImagesAsMetadata).to.not.have.been.called;
    });

    it('should set image lists when available as attribute data', function() {
      var directive = $scope.registerDirective.getCall(0).args[0];
      var sampleImages = [
        { "file": 'image.png', "thumbnail-url": "http://image" },
        { "file": 'test|character.jpg', "thumbnail-url": "http://test%7Ccharacter.jpg" }
      ];

      regularImageFactory.getImagesAsMetadata.returns(sampleImages);

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

      regularImageFactory.getImagesAsMetadata.returns(sampleImages);
      regularImageFactory.getBlueprintData.returns("image.png");

      directive.show();

      expect($scope.isDefaultImageList).to.be.true;

      timeout.flush();
    });

    it('should not consider a default value if it is not', function() {
      var directive = $scope.registerDirective.getCall(0).args[0];
      var sampleImages = [
        { "file": "image.png", "thumbnail-url": "http://image" }
      ];

      regularImageFactory.getImagesAsMetadata.returns(sampleImages);
      regularImageFactory.getBlueprintData.returns("default.png");

      directive.show();

      expect($scope.isDefaultImageList).to.be.false;

      timeout.flush();
    });


  });

  

  describe('updateFileMetadata', function() {

    var sampleImages;

    beforeEach(function() {
      sampleImages = [
        { "file": "image.png", exists: true, "thumbnail-url": "http://image" },
        { "file": "image2.png", exists: false, "thumbnail-url": "http://image2" }
      ];

      regularImageFactory.componentId = 'TEST-ID';
    });

    it('should directly set metadata if it\'s not already loaded', function()
    {
      $scope.getAttributeData = function() {
        return null;
      };

      $scope.updateFileMetadata(regularImageFactory.componentId, sampleImages);

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
        { "file": "image.png", exists: false, "thumbnail-url": "http://image5" },
        { "file": "image2.png", exists: false, "thumbnail-url": "http://image6" }
      ];

      $scope.getAttributeData = function() {
        return sampleImages;
      };

      $scope.updateFileMetadata(regularImageFactory.componentId, updatedImages);

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
        { "file": "image.png", exists: false, "thumbnail-url": "http://image5" }
      ];
      var expectedImages = [
        { "file": "image.png", exists: false, "thumbnail-url": "http://image5" },
        { "file": "image2.png", exists: false, "thumbnail-url": "http://image2" }
      ];

      $scope.getAttributeData = function() {
        return sampleImages;
      };

      $scope.updateFileMetadata(regularImageFactory.componentId, updatedImages);

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

      $scope.updateFileMetadata(regularImageFactory.componentId, updatedImages);

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

    it('should confirm and call removal funciton',function(done){
      var image = {file:'file1'};
      
      $scope.removeImageFromList(image);

      regularImageFactory.canRemoveImage.should.have.been.calledWith(image);
      setTimeout(function(){
        regularImageFactory.removeImage.should.have.been.calledWith(image);
        done()
      },10);
    });

    it('should not call removal if confirmation was rejected', function(done) {
      var image = {file:'file1'};
      regularImageFactory.canRemoveImage.returns(Q.reject());

      $scope.removeImageFromList(image);

      regularImageFactory.canRemoveImage.should.have.been.calledWith(image);
      setTimeout(function(){
        regularImageFactory.removeImage.should.not.have.been.calledWith(image);
        done()
      },10);    
    });

  });
});
