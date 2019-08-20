'use strict';

describe('service: regularImageFactory', function() {

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranlate()));

  beforeEach(module(function($provide) {
    $provide.service('blueprintFactory', function() {
      return {
        getBlueprintData: sandbox.stub().returns('data')
      };
    });
    $provide.service('templateEditorFactory', function() {
      return {
        getAttributeData: sandbox.stub().returns('data'),
        setAttributeData: sandbox.stub()
      };
    });
    $provide.service('fileMetadataUtilsService', function() {
      return {
        metadataWithFileRemoved: sandbox.stub().returns([]),
        filesAttributeFor: sandbox.stub().returns('files')
      };
    });
    $provide.service('$q', function() {
      return Q;
    });
  }));

  var regularImageFactory, blueprintFactory, templateEditorFactory, fileMetadataUtilsService;
  var sandbox = sinon.sandbox.create();

  beforeEach(function() {
    inject(function($injector) {
      regularImageFactory = $injector.get('regularImageFactory');
      regularImageFactory.componentId = 'componentId';
      
      blueprintFactory = $injector.get('blueprintFactory');
      templateEditorFactory = $injector.get('templateEditorFactory');
      fileMetadataUtilsService = $injector.get('fileMetadataUtilsService');
    });
  });

  afterEach(function() {
   sandbox.restore();
  })

  it('should initialize', function () {
    expect(regularImageFactory).to.be.ok;
    expect(regularImageFactory.getImagesAsMetadata).to.be.a('function');
    expect(regularImageFactory.getDuration).to.be.a('function');
    expect(regularImageFactory.setDuration).to.be.a('function');
    expect(regularImageFactory.getBlueprintData).to.be.a('function');
    expect(regularImageFactory.areChecksCompleted).to.be.a('function');
    expect(regularImageFactory.removeImage).to.be.a('function');
    expect(regularImageFactory.updateMetadata).to.be.a('function');
  });

  describe('getImagesAsMetadata: ', function() {
    it('should return Template Editor attributes metadata', function() {
      var data = regularImageFactory.getImagesAsMetadata();      

      expect(data).to.equals('data');
      templateEditorFactory.getAttributeData.should.have.been.calledWith('componentId','metadata');
    });
  });

  describe('getDuration: ', function() {
    it('should return Template Editor attributes duration', function() {
      var data = regularImageFactory.getDuration();      

      expect(data).to.equals('data');
      templateEditorFactory.getAttributeData.should.have.been.calledWith('componentId','duration');
    });
  });

  describe('setDuration: ', function() {
    it('should set Template Editor attributes duration', function() {
      regularImageFactory.setDuration(55);      

      templateEditorFactory.setAttributeData.should.have.been.calledWith('componentId','duration',55);
    });
  });

  describe('getBlueprintData: ', function() {
    it('should return blueprint data', function() {
      var data = regularImageFactory.getBlueprintData('key');      

      expect(data).to.equals('data');
      blueprintFactory.getBlueprintData.should.have.been.calledWith('componentId','key');
    });
  });

  describe('areChecksCompleted: ', function() {
    it('should return true if componentId is in the list', function() {
      expect(regularImageFactory.areChecksCompleted({componentId:true})).to.be.true;
      expect(regularImageFactory.areChecksCompleted({otherID:true,componentId:true})).to.be.true;
    });

    it('should return false if empty or not present', function() {
      expect(regularImageFactory.areChecksCompleted(null)).to.be.false
      expect(regularImageFactory.areChecksCompleted({})).to.be.false;
      expect(regularImageFactory.areChecksCompleted({anotherId:true})).to.be.false;
    });

    it('should return false if componentId is not set', function() {
      regularImageFactory.componentId = null;
      expect(regularImageFactory.areChecksCompleted({componentId:true})).to.be.false;
    });
  });

  describe('removeImage: ', function() {
    it('should rely on fileMetadataUtilsService', function() {
      var metadata = []
      var data = regularImageFactory.removeImage({},metadata);      

      expect(data).to.deep.equals([]);
      fileMetadataUtilsService.metadataWithFileRemoved.should.have.been.calledWith(metadata,{});
    });
  });

  describe('updateMetadata: ', function() {
    it('should set attributes data and return metadata', function() {
      var metadata = ['metadata'];
      var data = regularImageFactory.updateMetadata(metadata);      

      expect(data).to.deep.equals(metadata);
      templateEditorFactory.setAttributeData.should.have.been.calledWith('componentId','metadata',metadata);
      templateEditorFactory.setAttributeData.should.have.been.calledWith('componentId','files','files');

      fileMetadataUtilsService.filesAttributeFor.should.have.been.calledWith(metadata);
    });
  });

  describe('canRemoveImage: ', function() {
    it('should always resolve as there is no need for user confirmation', function(done) {      
      regularImageFactory.canRemoveImage().then(function(){
        done();
      }).catch(function(){
        done('Should not reject');
      });
    });
  });

});
