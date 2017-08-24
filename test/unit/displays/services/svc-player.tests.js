'use strict';

describe('service: player: ', function() {
  beforeEach(module('risevision.displays.services'));

  describe('service: parsePlayerDate:', function() {
    var parsePlayerDate;

    beforeEach(function() {
      inject(function($injector) {
        parsePlayerDate = $injector.get('parsePlayerDate');
      });
    });
  
    it('should exist',function() {
      expect(parsePlayerDate).to.be.truely;
      expect(parsePlayerDate).to.be.a('function');
    });
    
    it('should parse a valid date',function() {
      var date = parsePlayerDate('2017.06.02.03.15');
      
      expect(date.getTime()).to.equal(new Date(2017, 5, 2, 3, 15, 0, 0).getTime());
    });
    
    it('should reject invalid dates',function() {
      expect(parsePlayerDate()).to.be.null;
      expect(parsePlayerDate('2017.06.02')).to.be.null;
      expect(parsePlayerDate('2017.06.02.')).to.be.null;
      expect(parsePlayerDate('2017/06/02 03:15')).to.be.null;
    });
  });
  
  describe('service: getLatestPlayerVersion:', function() {
    var $httpBackend, getLatestPlayerVersion, LATEST_PLAYER_URL;

    beforeEach(function() {
      inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.whenGET(/\.*translation\.*/).respond(function() {return ''});

        getLatestPlayerVersion = $injector.get('getLatestPlayerVersion');
        LATEST_PLAYER_URL = $injector.get('LATEST_PLAYER_URL');
      });
    });
  
    it('should exist',function() {
      expect(getLatestPlayerVersion).to.be.truely;
      expect(getLatestPlayerVersion).to.be.a('function');
    });
    
    it('should parse a valid date',function(done) {
      $httpBackend.whenGET(LATEST_PLAYER_URL).respond(200, 'RisePlayerElectron 2017.08.11.12.04');
      
      getLatestPlayerVersion()
      .then(function(date) {
        expect(date.getTime()).to.equal(new Date(2017, 7, 11, 12, 4, 0, 0).getTime());
        done();
      });

      setTimeout(function(){
        $httpBackend.flush();
      },10);
    });
    
    it('should reject missing fields',function(done) {
      $httpBackend.whenGET(LATEST_PLAYER_URL).respond(200, '2017.08.11.12.04');
      
      getLatestPlayerVersion()
      .catch(function(err) {
        expect(err).to.contain('Missing fields');
        done();
      });

      setTimeout(function(){
        $httpBackend.flush();
      },10);
    });
    
    it('should reject invalid format',function(done) {
      $httpBackend.whenGET(LATEST_PLAYER_URL).respond(200, 'RisePlayerElectron 2017/08/11');
      
      getLatestPlayerVersion()
      .catch(function(err) {
        expect(err).to.contain('Invalid date format');
        done();
      });

      setTimeout(function(){
        $httpBackend.flush();
      },10);
    });
    
    it('should reject server errors',function(done) {
      $httpBackend.whenGET(LATEST_PLAYER_URL).respond(500, 'Server error');
      
      getLatestPlayerVersion()
      .catch(function(err) {
        expect(err.data).to.contain('Server error');
        done();
      });

      setTimeout(function(){
        $httpBackend.flush();
      },10);
    });
  });
});
