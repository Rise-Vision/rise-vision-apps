'use strict';

describe('service: baseImageFactory', function() {

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranslate()));

  beforeEach(module(function($provide) {
    $provide.service('blueprintFactory', function() {
      return {
        getBlueprintData: sandbox.stub().returns('data'),
        getHelpText: sandbox.stub().returns('help text')
      };
    });
    $provide.service('attributeDataFactory', function() {
      return {
        getAttributeData: sandbox.stub().returns('data'),
        getAvailableAttributeData: sandbox.stub().returns('availabledata'),
        setAttributeData: sandbox.stub()
      };
    });
    $provide.service('fileMetadataUtilsService', function() {
      return {
        metadataWithFileRemoved: sandbox.stub().returns(['metadataWithFileRemoved']),
        filesAttributeFor: sandbox.stub().returns('files')
      };
    });
    $provide.service('$q', function() {
      return Q;
    });
  }));

  var baseImageFactory, blueprintFactory, attributeDataFactory, fileMetadataUtilsService;
  var sandbox = sinon.sandbox.create();

  beforeEach(function() {
    inject(function($injector) {
      baseImageFactory = $injector.get('baseImageFactory');
      baseImageFactory.componentId = 'componentId';
      
      blueprintFactory = $injector.get('blueprintFactory');
      attributeDataFactory = $injector.get('attributeDataFactory');
      fileMetadataUtilsService = $injector.get('fileMetadataUtilsService');
    });
  });

  afterEach(function() {
   sandbox.restore();
  })

  it('should initialize', function () {
    expect(baseImageFactory).to.be.ok;
    expect(baseImageFactory.getImagesAsMetadata).to.be.a('function');
    expect(baseImageFactory.getAvailableAttributeData).to.be.a('function');
    expect(baseImageFactory.setDuration).to.be.a('function');
    expect(baseImageFactory.getBlueprintData).to.be.a('function');
    expect(baseImageFactory.areChecksCompleted).to.be.a('function');
    expect(baseImageFactory.removeImage).to.be.a('function');
    expect(baseImageFactory.updateMetadata).to.be.a('function');
    expect(baseImageFactory.setTransition).to.be.a('function');
  });

  describe('getImagesAsMetadata: ', function() {
    it('should return Template Editor attributes metadata', function() {
      var data = baseImageFactory.getImagesAsMetadata();      

      expect(data).to.equals('data');
      attributeDataFactory.getAttributeData.should.have.been.calledWith('componentId','metadata');
    });
  });

  describe('getDuration: ', function() {
    it('should return Template Editor attributes duration', function() {
      var data = baseImageFactory.getAvailableAttributeData('duration');      

      expect(data).to.equals('availabledata');
      attributeDataFactory.getAvailableAttributeData.should.have.been.calledWith('componentId','duration');
    });
  });

  describe('setDuration: ', function() {
    it('should set Template Editor attributes duration', function() {
      baseImageFactory.setDuration(55);      

      attributeDataFactory.setAttributeData.should.have.been.calledWith('componentId','duration',55);
    });
  });

  describe('getBlueprintData: ', function() {
    it('should return blueprint data', function() {
      var data = baseImageFactory.getBlueprintData('key');      

      expect(data).to.equals('data');
      blueprintFactory.getBlueprintData.should.have.been.calledWith('componentId','key');
    });
  });

  describe('areChecksCompleted: ', function() {
    it('should return true if componentId is in the list', function() {
      baseImageFactory.checksCompleted = {componentId:true};
      expect(baseImageFactory.areChecksCompleted()).to.be.true;

      baseImageFactory.checksCompleted = {otherID:true,componentId:true};
      expect(baseImageFactory.areChecksCompleted()).to.be.true;
    });

    it('should return false if check is not completed', function() {
      baseImageFactory.checksCompleted = {componentId:false};
      expect(baseImageFactory.areChecksCompleted()).to.be.false;

      baseImageFactory.checksCompleted = {otherID:true,componentId:false};
      expect(baseImageFactory.areChecksCompleted()).to.be.false;
    });

    it('should return false if empty', function() {
      expect(baseImageFactory.areChecksCompleted()).to.be.false;
    });
    
    it('should return true if not present', function() {
      baseImageFactory.checksCompleted = {};
      expect(baseImageFactory.areChecksCompleted()).to.be.true;

      baseImageFactory.checksCompleted = {anotherId:true};
      expect(baseImageFactory.areChecksCompleted()).to.be.true;
    });

    it('should return true if componentId is not set', function() {
      baseImageFactory.checksCompleted = {componentId:true};
      baseImageFactory.componentId = null;
      expect(baseImageFactory.areChecksCompleted()).to.be.true;
    });
  });

  describe('removeImage: ', function() {
    it('should resolve fileMetadataUtilsService result', function(done) {
      var file = {file:'file1'};
      var metadata = [file];
      baseImageFactory.removeImage(file,metadata).then(function(result){
        expect(result).to.deep.equals(['metadataWithFileRemoved']);
        fileMetadataUtilsService.metadataWithFileRemoved.should.have.been.calledWith(metadata,file);
        done()
      }).catch(function(){
        done('should not reject');
      });
    });

    it('should resolve to empty list if metadataWithFileRemoved is undefined', function(done) {
      var file = {file:'file1'};
      var metadata = [file];
      fileMetadataUtilsService.metadataWithFileRemoved.returns(undefined);

      baseImageFactory.removeImage(file,metadata).then(function(result){
        expect(result).to.deep.equals([]);
        fileMetadataUtilsService.metadataWithFileRemoved.should.have.been.calledWith(metadata,file);
        done()
      }).catch(function(){
        done('should not reject');
      });
    });
  });

  describe('updateMetadata: ', function() {
    it('should set attributes data and return metadata', function() {
      var metadata = ['metadata'];
      var data = baseImageFactory.updateMetadata(metadata);      

      expect(data).to.deep.equals(metadata);
      attributeDataFactory.setAttributeData.should.have.been.calledWith('componentId','metadata',metadata);
      attributeDataFactory.setAttributeData.should.have.been.calledWith('componentId','files','files');

      fileMetadataUtilsService.filesAttributeFor.should.have.been.calledWith(metadata);
    });

    describe('isLogo: ', function() {
      it('should not update flag if isLogo is not true', function() {
        var metadata = ['metadata'];
        var data = baseImageFactory.updateMetadata(metadata);      

        attributeDataFactory.setAttributeData.should.have.been.calledTwice;
      });

      it('should update flag if isLogo is true', function() {
        var metadata = ['metadata'];
        blueprintFactory.getBlueprintData.returns('true');
        var data = baseImageFactory.updateMetadata(metadata);      

        attributeDataFactory.setAttributeData.should.have.been.calledThrice;
      });

      it('should update isLogo flag to false if some files are sent', function() {
        var metadata = ['metadata'];
        blueprintFactory.getBlueprintData.returns('true');
        var data = baseImageFactory.updateMetadata(metadata);      

        attributeDataFactory.setAttributeData.should.have.been.calledWith('componentId', 'isLogo', false);
      });

      it('should update isLogo flag to false if no files are sent', function() {
        var metadata = [];
        blueprintFactory.getBlueprintData.returns('true');
        var data = baseImageFactory.updateMetadata(metadata);      

        attributeDataFactory.setAttributeData.should.have.been.calledWith('componentId', 'isLogo', false);
      });

    });

    describe('isSetAsLogo',function() {
      it('should return true if blueprint is logo and attribute is true',function(){
        blueprintFactory.getBlueprintData.returns('true');
        attributeDataFactory.getAttributeData.returns(true);

        expect(baseImageFactory.isSetAsLogo()).to.equals(true);
      });

      it('should return false otherwise',function(){
        blueprintFactory.getBlueprintData.returns('false');
        attributeDataFactory.getAttributeData.returns(true);
        expect(baseImageFactory.isSetAsLogo()).to.equals(false);

        blueprintFactory.getBlueprintData.returns('true');
        attributeDataFactory.getAttributeData.returns(false);
        expect(baseImageFactory.isSetAsLogo()).to.equals(false);

        blueprintFactory.getBlueprintData.returns('false');
        attributeDataFactory.getAttributeData.returns(false);
        expect(baseImageFactory.isSetAsLogo()).to.equals(false);
      });
    });
  });

  describe('setTransition: ', function() {
    it('should set Template Editor transition attribute', function() {
      baseImageFactory.setTransition('fadeIn');      

      attributeDataFactory.setAttributeData.should.have.been.calledWith('componentId','transition','fadeIn');
    });
  });

  describe('getHelpText: ', function() {
    it('should return blueprint help text', function() {
      expect(baseImageFactory.getHelpText()).to.equals('help text');
      blueprintFactory.getHelpText.should.have.been.calledWith('componentId');
    });
  });

});
