/*jshint expr:true */
"use strict";

describe("Services: util", function() {

  beforeEach(module("risevision.common.components.util"));
  beforeEach(module("risevision.common.components.scrolling-list"));

  describe("humanReadableError: ",function(){
    it("original",function(done){
      var message1 = {"message": "error 1"};
      var message2 = {"error": {"message": "error 2"}};
      var message3 = {"error": "error 3"};
      var message4 = {"random": "error 4"};
      
      inject(function(humanReadableError) {
        expect(humanReadableError).to.be.ok;
        expect(humanReadableError).to.be.a("function");

        expect(humanReadableError()).to.equal("Unknown Error");
        expect(humanReadableError("string")).to.equal("string");
        expect(humanReadableError(message1)).to.equal(message1.message);
        expect(humanReadableError(message2)).to.equal(message2.error.message);
        expect(humanReadableError(message3)).to.equal(message3.error);
        expect(humanReadableError(message4)).to.equal(JSON.stringify(message4));
        
        done();
      });
    });

  });
  
  it("dateIsInRange: ",function(done){
    var dateStr1 = "2014-05-14T00:00:00.000";
    var dateStr2 = "2014-05-15T00:00:00.000";
    var dateStr3 = "2014-05-16T00:00:00.000";
    
    var date1 = new Date(2014, 4, 14, 0, 0, 0, 0);
    var date2 = new Date(2014, 4, 15, 0, 0, 0, 0);
    
    inject(function(dateIsInRange) {
      expect(dateIsInRange).to.be.ok;
      expect(dateIsInRange).to.be.a("function");

      expect(dateIsInRange(date1)).to.be.true;
      expect(dateIsInRange(date1, dateStr1)).to.be.true;
      expect(dateIsInRange(date1, dateStr2)).to.be.false;
      expect(dateIsInRange(date2, dateStr1)).to.be.true;
      
      expect(dateIsInRange(date1, null, dateStr1)).to.be.true;
      expect(dateIsInRange(date1, null, dateStr2)).to.be.true;
      expect(dateIsInRange(date2, null, dateStr1)).to.be.false;
      
      expect(dateIsInRange(date1, dateStr2, dateStr3)).to.be.false;
      expect(dateIsInRange(date2, dateStr1, dateStr3)).to.be.true;
      
      expect(dateIsInRange(date1, "somestring")).to.be.false;
      expect(dateIsInRange(date2, dateStr1, "somestring")).to.be.false;
      
      done();
    });
  });

  it("objectHelper: ",function(done){
    inject(function(objectHelper){
      var obj1 = {
        "property": "value",
        "property2": {
          "subproperty": "subvalue"
        }
      };
      var obj2 = angular.copy(obj1);
      var obj3 = {"property3": "value3"};

      expect(objectHelper).to.be.ok;

      ["follow", "clearObj", "clearAndCopy"].forEach(
      function (method) {
        expect(objectHelper).to.have.property(method);
        expect(objectHelper[method]).to.be.a("function");
      });
      
      var newObj = objectHelper.follow(obj1);
      expect(newObj).to.deep.equal(obj1);
      
      objectHelper.clearObj(obj2);
      expect(obj2).to.deep.equal({});
      
      objectHelper.clearAndCopy(obj1, obj3);
      expect(obj1).to.deep.equal(obj3);

      done();
    });
  });  

  describe("getBaseDomain: ",function(){
    var host;
    
    beforeEach(module(function ($provide) {
      $provide.value("$location", {
        host: function () {
          return host;
        }
      });
    }));

    it("should get base domain", function(done) {
      inject(function(getBaseDomain){
        expect(getBaseDomain).to.be.ok;
        expect(getBaseDomain).to.be.a("function");
        
        host = "localhost";
        expect(getBaseDomain()).to.equal("localhost");

        host = "store.risevision.com";
        expect(getBaseDomain()).to.equal("risevision.com");

        host = "rvauser2.appspot.com";
        expect(getBaseDomain()).to.equal("rvauser2.appspot.com");

        host = "1-01-001.rvauser2.appspot.com";
        expect(getBaseDomain()).to.equal("rvauser2.appspot.com");

        host = "0.0.0.1";
        expect(getBaseDomain()).to.equal("0.0.0.1");
        
        done();
      });
    });
  });

});
