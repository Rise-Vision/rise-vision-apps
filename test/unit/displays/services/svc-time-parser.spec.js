'use strict';
describe('service: timeParser:', function() {
  beforeEach(module('risevision.displays.services'));

  var timeParser;
  beforeEach(function(){
    inject(function($injector){
      timeParser = $injector.get('timeParser');
    });
  });

  it('should exist',function(){
    expect(timeParser).to.be.truely;
    expect(timeParser.parseAmpm).to.be.a('function');
    expect(timeParser.parseMilitary).to.be.a('function');
  });
  
  describe('parseAmpm:',function(){
    it('should return null for invalid time',function(){
      var time = timeParser.parseAmpm("30 AM");
      
      expect(time).to.be.null;
    });

    it('should return 3:30',function(){
      var time = timeParser.parseAmpm("3:30 AM");
      
      expect(time).to.equal("03:30");
    });

    it('should return 16:05',function(){
      var time = timeParser.parseAmpm("4:05 PM");
      
      expect(time).to.equal("16:05");
    });

    it('should return 00:05',function(){
      var time = timeParser.parseAmpm("12:05 AM");
      
      expect(time).to.equal("00:05");
    });
  });
  
  describe('parseMilitary:',function(){
    it('should return null for invalid time',function(){
      var time = timeParser.parseMilitary("30 AM");
      
      expect(time).to.be.null;
    });

    it('should parse 3:30',function(){
      var time = timeParser.parseMilitary("03:30");
      
      expect(time).to.equal("03:30 AM");
    });

    it('should parse 16:05',function(){
      var time = timeParser.parseMilitary("16:05");
      
      expect(time).to.equal("04:05 PM");
    });

    it('should parse 00:05',function(){
      var time = timeParser.parseMilitary("00:05");
      
      expect(time).to.equal("12:05 AM");
    });

    it('should parse a random string as 0:00',function(){
      var time = timeParser.parseMilitary("as:df");

      expect(time).to.be.null;
    });

  });

});
