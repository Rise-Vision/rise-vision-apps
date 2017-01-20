'use strict';
  
describe('service: presentationPropertiesFactory:', function() {
  beforeEach(module('risevision.editor.services'));
  var presentationPropertiesFactory, newPresentationProperties, existentPresentationProperties, presentation, editorFactory, presentationParser, id, name, width, height, widthUnits, heightUnits, backgroundStyle, backgroundScaleToFit, hidePointer, donePlaceholder;
  beforeEach(module(function ($provide) {

    newPresentationProperties = {
      id: '',
      name: 'New Presentation',
      width: 1920,
      height: 1080,
      widthUnits: 'px',
      heightUnits: 'px',
      background: undefined,
      hidePointer: true,
      donePlaceholder: '',
      isTemplate: false,
      isStoreProduct: false
    };

    existentPresentationProperties = {
      id: '1f81244a-f434-4e3f-8551-6a0159cd164a',
      name: 'TEST PRESENTAION',
      width: 1280,
      height: 720,
      widthUnits: 'px',
      heightUnits: 'px',
      background: {'color':'rgba(255,255,255,1)'},
      hidePointer: true,
      donePlaceholder: 'done placeholder',
      isTemplate: true,
      isStoreProduct: false
    };

    presentation = {
      id: '1f81244a-f434-4e3f-8551-6a0159cd164a',
      name: 'TEST PRESENTAION',
      width: 1280,
      height: 720,
      widthUnits: 'px',
      heightUnits: 'px',
      backgroundStyle: 'rgba(255,255,255,1)',
      backgroundScaleToFit: false,
      hidePointer: true,
      donePlaceholder: 'done placeholder',
      isTemplate: true,
      isStoreProduct: false
    };

    editorFactory = {
      presentation: presentation
    };
    
    $provide.service('editorFactory',function () {
      return editorFactory;
    });

    presentationParser = {
      updatePresentation: function () {
        return;
      }
    }

    $provide.service('presentationParser',function () {
      return presentationParser;
    });

  }));

  beforeEach(function(){
    chai.config.truncateThreshold = 0;
    inject(function($injector){
      presentationPropertiesFactory = $injector.get('presentationPropertiesFactory');
    });
  });

  it('should exist',function(){
    expect(presentationPropertiesFactory).to.be.truely;
    
    expect(presentationPropertiesFactory.getPresentationProperties).to.be.a('function');

    expect(presentationPropertiesFactory.setPresentationProperties).to.be.a('function');
  });
  
  describe('getPresentationProperties: ', function() {
    it('should get new presentation properties', function() {
      editorFactory.presentation = undefined;
      expect(presentationPropertiesFactory.getPresentationProperties()).to.deep.equal(newPresentationProperties);
    });

    it('should get existent presentation properties with color background', function() {
      expect(presentationPropertiesFactory.getPresentationProperties()).to.deep.equal(existentPresentationProperties);
    });

    it('should get existent presentation properties with image background and scale to fit true', function() {
      presentation.backgroundStyle = 'url(\'/images/bg.jpg\') no-repeat left top',
      presentation.backgroundScaleToFit = true;

      existentPresentationProperties.background = {'useImage':true,'image':{'url':'/images/bg.jpg','position':'top-left','scale':true, 'repeat': 'no-repeat'}};

      expect(presentationPropertiesFactory.getPresentationProperties()).to.deep.equal(existentPresentationProperties);
    });

    it('should get existent presentation properties with image background and without position', function() {
      presentation.backgroundStyle = 'url(\'/images/bg.jpg\') no-repeat',
        presentation.backgroundScaleToFit = true;

      existentPresentationProperties.background = {'useImage':true,'image':{'url':'/images/bg.jpg','scale':true, 'repeat': 'no-repeat'}};

      expect(presentationPropertiesFactory.getPresentationProperties()).to.deep.equal(existentPresentationProperties);
    });
  });

  describe('setPresentationProperties: ', function() {
    it('should set new presentation properties with color background', function() {
      presentationPropertiesFactory.setPresentationProperties(existentPresentationProperties);
      
      expect(editorFactory.presentation).to.deep.equal(presentation);
    });

    it('should set presentation properties with image background and scale to fit true', function() {

      existentPresentationProperties.background = {'useImage':true,'image':{'url':'/images/bg.jpg','position':'top-left','scale':true}};

      var backgroundStyle = 'url(\'/images/bg.jpg\') no-repeat left top';
      var backgroundScaleToFit = true;

      presentationPropertiesFactory.setPresentationProperties(existentPresentationProperties);

      expect(editorFactory.presentation.backgroundStyle).to.equal(backgroundStyle);
      expect(editorFactory.presentation.backgroundScaleToFit).to.equal(backgroundScaleToFit);

    });
  });

});
