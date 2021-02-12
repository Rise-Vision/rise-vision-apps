'use strict';

describe('Twitter app:', function() {
  beforeEach(function () {
    module('risevision.widgets.twitter');

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

    it('should initialize twitter widget settings',function(){
      expect(defaultSettings.twitterWidget).to.be.ok;
      expect(defaultSettings.twitterWidget).to.be.an('object');
      expect(defaultSettings.twitterWidget).to.deep.equal({
        'params': {},
        'additionalParams': {
          'screenName': '',
          'componentId': ''
        }
      });
    });
  });

});
