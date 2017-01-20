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
    expect(timeParser.getTime).to.be.a('function');
    expect(timeParser.parseTime).to.be.a('function');
  });
  
  describe('getTime:',function(){
    it('should return 3:30',function(){
      var d = new Date();
      d.setHours(3);
      d.setMinutes(30);
      var time = timeParser.getTime(d);
      
      expect(time).to.equal("03:30");
    });
    it('should return 16:05',function(){
      var d = new Date();
      d.setHours(16);
      d.setMinutes(5);
      var time = timeParser.getTime(d);
      
      expect(time).to.equal("16:05");
    });
  });
  
  describe('parseTime:',function(){
    it('should parse 3:30',function(){
      var time = timeParser.parseTime("03:30");
      
      expect(time).to.be.truely;
      expect(time.getHours()).to.equal(3);
      expect(time.getMinutes()).to.equal(30);
    });
    it('should parse 16:05',function(){
      var time = timeParser.parseTime("16:05");
      
      expect(time).to.be.truely;
      expect(time.getHours()).to.equal(16);
      expect(time.getMinutes()).to.equal(5);
    });
    it('should parse a random string as 0:00',function(){
      var time = timeParser.parseTime("as:df");

      expect(time).to.be.truely;
      expect(time.getHours()).to.equal(0);
      expect(time.getMinutes()).to.equal(0);      
    });
    it('should parse a undefined as 0:00',function(){
      var time = timeParser.parseTime();
      
      expect(time).to.be.truely;
      expect(time.getHours()).to.equal(0);
      expect(time.getMinutes()).to.equal(0);      
    });    
  });

});
