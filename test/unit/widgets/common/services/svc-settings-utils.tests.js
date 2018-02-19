'use strict';
describe('service: settingsUtils:', function() {
  beforeEach(module('risevision.widgets.services'));

  describe('settingsSaver', function() {
    var settingsSaver;

    beforeEach(module(function ($provide) {
      $provide.service('$q', function() {return Q;});
    }));

    beforeEach(function(){
      inject(function($injector){
        settingsSaver = $injector.get('settingsSaver');
      });
    });

    it('should exist and return a promise',function(){
      expect(settingsSaver).to.be.ok;
      expect(settingsSaver.saveSettings).to.be.a('function');
      expect(settingsSaver.saveSettings({ params: {} }).then).to.be.a('function');
    });

    it('should resolve', function(done) {
      settingsSaver.saveSettings({
        params: {
          param1: 'value1',
          param2: 'value2'
        },
        additionalParams: {
          additionalParam1: 'value1',
          object1: {
            param1: 'value1',
            param2: 'value2'
          }
        }
      })
        .then(function(response){
          expect(response).to.be.ok;
          expect(response.params).to.equal('up_param1=value1&up_param2=value2');
          expect(response.additionalParams).to.equal('{"additionalParam1":"value1","object1":{"param1":"value1","param2":"value2"}}');

          done();
        })
        .then(null,done);
    });

    it('should fail on validation errors', function(done) {
      settingsSaver.saveSettings({ params: {} }, function() { return [ 'error1' ]; })
        .then(function() {
          done('fail');
        })
        .then(null, function(error) {
          expect(error).to.deep.equal({ alerts: [ 'error1' ] });
          done();
        });
    });

    it('should stip out extra params', function(done) {
      settingsSaver.saveSettings({ params: {
        id: 'id',
        companyId: 'cid',
        rsW: 'rsW',
        rsH: 'rsH',
        param: 'value'
      } })
        .then(function(response){
          expect(response).to.be.ok;
          expect(response.params).to.equal('up_param=value');

          done();
        })
        .then(null,done);
    });

    it('should stip layoutURL and set it as params URL', function(done) {
      settingsSaver.saveSettings({ params: {
        param: 'value',
        param2: 'value2',
        layoutURL: 'http://risevision.com/somelayout.html'
      } })
        .then(function(response){
          expect(response).to.be.ok;
          expect(response.params).to.equal('http://risevision.com/somelayout.html?up_param=value&up_param2=value2');

          done();
        })
        .then(null,done);
    });
  });

  describe('settingsGetter', function() {
    var settingsGetter;

    beforeEach(module(function ($provide) {
      $provide.value('defaultSettings', {
        widget1: {
          params: {
            param1: 'value1'
          },
          additionalParams: {
            additionalParam1: 'value1',
            object1: {
              param1: 'value1',
              param2: 'value2'
            }
          }
        }
      });
    }));

    beforeEach(function(){
      inject(function($injector){
        settingsGetter = $injector.get('settingsGetter');

        settingsGetter.setCurrentWidget('widget1');
      });
    });

    it('should exist',function(){
      expect(settingsGetter).to.be.ok;
      expect(settingsGetter.setCurrentWidget).to.be.a('function');
      expect(settingsGetter.getParams).to.be.a('function');
      expect(settingsGetter.getAdditionalParams).to.be.a('function');
    });

    describe('getParams: ', function() {
      it('should return default params', function() {
        expect(settingsGetter.getParams('')).to.deep.equal({
          param1: 'value1'
        });
      });

      it('should extend default params', function() {
        expect(settingsGetter.getParams('up_height=800&up_param1=updatedValue')).to.deep.equal({
          height: 800,
          param1: 'updatedValue'
        });
      });

      it('should return even if default params are missing', function() {
        settingsGetter.setCurrentWidget('widget2');

        expect(settingsGetter.getParams('up_height=800')).to.deep.equal({
          height: 800
        });
      });

    });

    describe('getAdditionalParams: ', function() {
      it('should return default params', function() {
        expect(settingsGetter.getAdditionalParams('')).to.deep.equal({
          additionalParam1: 'value1',
          object1: {
            param1: 'value1',
            param2: 'value2'
          }
        });
      });

      it('should deep extend default params', function() {
        var additionalParams = {
          height: 800,
          additionalParam1: 'updatedValue',
          object1: {
            param1: 'newvalue1',
            param3: 'value3'
          }
        };
        expect(settingsGetter.getAdditionalParams(JSON.stringify(additionalParams))).to.deep.equal({
          height: 800,
          additionalParam1: 'updatedValue',
          object1: {
            param1: 'newvalue1',
            param2: 'value2',
            param3: 'value3'
          }
        });
      });

      it('should return even if default params are missing', function() {
        settingsGetter.setCurrentWidget('widget2');

        expect(settingsGetter.getAdditionalParams('{"height":800}')).to.deep.equal({
          height: 800
        });
      });

    });

  });
  
  describe('settingsParser', function() {
    var settingsParser;

    beforeEach(function(){
      inject(function($injector){
        settingsParser = $injector.get('settingsParser');
      });
    });

    it('should exist', function() {
      expect(settingsParser).to.be.ok;

      expect(settingsParser.parseAdditionalParams).to.be.a('function');
      expect(settingsParser.encodeAdditionalParams).to.be.a('function');
      expect(settingsParser.encodeParams).to.be.a('function');
      expect(settingsParser.parseParams).to.be.a('function');
    });

    it('parseAdditionalParams: ', function() {
      expect(settingsParser.parseAdditionalParams()).to.deep.equal({});
      expect(settingsParser.parseAdditionalParams('{"height":800}')).to.deep.equal({
        height: 800
      });
    });

    it('encodeAdditionalParams: ', function() {
      expect(settingsParser.encodeAdditionalParams({})).to.equal('{}');
      expect(settingsParser.encodeAdditionalParams({
        height: 800
      })).to.equal('{"height":800}');
    });

    it('encodeParams: ', function() {
      expect(settingsParser.encodeParams({
        height: 800,
        param1: 'param1',
        object1: {
          param1: 'newvalue1',
          param3: 'value3'
        }
      })).to.equal('up_height=800&up_param1=param1&up_object1=%7B%22param1%22%3A%22newvalue1%22%2C%22param3%22%3A%22value3%22%7D');

      expect(settingsParser.encodeParams({
        height: 800,
        'param1&2': 'value1 2'
      })).to.equal('up_height=800&up_param1%262=value1%202');

    });
    
    describe('parseParams: ', function() {
      it('should parse params', function() {
        expect(settingsParser.parseParams('up_height=800&up_param1=param1&up_object1=%7B%22param1%22%3A%22newvalue1%22%2C%22param3%22%3A%22value3%22%7D')).to.deep.equal({
          height: 800,
          param1: 'param1',
          object1: {
            param1: 'newvalue1',
            param3: 'value3'
          }
        });
      });

      it('should strip leading ?', function() {
        expect(settingsParser.parseParams('?up_height=800&up_param1=param1')).to.deep.equal({
          height: 800,
          param1: 'param1'
        });
      });

      it('should ignore params without the prefix', function() {
        expect(settingsParser.parseParams('?up_height=800&up_param1=param1&param2=param2')).to.deep.equal({
          height: 800,
          param1: 'param1'
        });
      });

    });
  });

});
