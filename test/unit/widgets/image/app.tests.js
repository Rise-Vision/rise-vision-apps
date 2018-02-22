'use strict';

describe('Image app:', function() {
  beforeEach(function () {
    module('risevision.widgets.image');

    inject(function ($injector) {
      defaultSettings = $injector.get('defaultSettings');
    });
  });


  var defaultSettings;

  describe('defaultSettings: ',function(){

    it('should initialize',function(){
      expect(defaultSettings).to.be.ok;
      expect(defaultSettings).to.be.an('object');
    });

    it('should initialize image widget settings',function(){
      expect(defaultSettings.imageWidget).to.be.ok;
      expect(defaultSettings.imageWidget).to.be.an('object');
      expect(defaultSettings.imageWidget).to.deep.equal({
        'params': {},
        'additionalParams': {
          'selector': {},
          'storage': {},
          'resume': true,
          'scaleToFit': true,
          'position': 'middle-center',
          'duration': 10,
          'pause': 10,
          'autoHide': false,
          'url': '',
          'background': {}
        }
      });
    });
  });
  
});
