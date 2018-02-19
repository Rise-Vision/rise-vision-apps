'use strict';
describe('service: settingsUtils:', function() {
  beforeEach(module('risevision.widgets.services'));

  describe('settingsSaver', function() {
    var settingsSaver;

    beforeEach(function(){
      inject(function($injector){
        settingsSaver = $injector.get('settingsSaver');
      });
    });

    it('should exist',function(){
      expect(settingsSaver).to.be.ok;
      expect(settingsSaver.saveSettings).to.be.a('function');
    });
    
  });

  describe('settingsGetter', function() {
    var settingsGetter;

    beforeEach(function(){
      inject(function($injector){
        settingsGetter = $injector.get('settingsGetter');
      });
    });

    it('should exist',function(){
      expect(settingsGetter).to.be.ok;
      expect(settingsGetter.getParams).to.be.a('function');
      expect(settingsGetter.getAdditionalParams).to.be.a('function');
    });
    
  });
  
  describe('settingsParser', function() {
    var settingsParser;

    beforeEach(function(){
      inject(function($injector){
        settingsParser = $injector.get('settingsParser');
      });
    });

    it('should exist',function(){
      expect(settingsParser).to.be.ok;

      expect(settingsParser.parseAdditionalParams).to.be.a('function');
      expect(settingsParser.encodeAdditionalParams).to.be.a('function');
      expect(settingsParser.encodeParams).to.be.a('function');
      expect(settingsParser.parseParams).to.be.a('function');
    });
    
  });

});
