"use strict";
describe("object: base list", function() {
  
  beforeEach(module("risevision.common.components.scrolling-list"));
  var listObject, getMoreItems;
  beforeEach(function(){
    getMoreItems = function(start, count){
        var result = [];
        for (var i = 1; i <= count; i++) {
          result.push(start + i);
        }
        return result;
    };
    
    inject(function($injector){
      var BaseList = $injector.get("BaseList");
      listObject = new BaseList();
    });
  });
  
  it("should exist",function(){
    expect(listObject).to.be.ok;

    expect(listObject.clear).to.be.a("function");
    expect(listObject.concat).to.be.a("function");
    expect(listObject.add).to.be.a("function");
  });
  
  it("should initialize",function(){
    expect(listObject.list).to.be.an.array;
    expect(listObject.list).to.have.length(0);

    expect(listObject.maxCount).to.equal(40);
  });

  describe("concat: ",function(){
    it("should concat results",function(){
      var results = getMoreItems(0, 5);
      listObject.concat(results);
      
      expect(listObject.list).to.have.length(5);
    });
  });
  
  describe("add: ",function(){
    it("should add results",function(){
      var results = getMoreItems(0, 5);
      listObject.add(results, "someCursor");
      
      expect(listObject.list).to.have.length(5);
      expect(listObject.endOfList).to.be.true;
      expect(listObject.cursor).to.equal("someCursor");
    });
    
    it("if enough results, should not be end of list",function(){
      var results = getMoreItems(0, listObject.maxCount);
      listObject.add(results, "someCursor");

      expect(listObject.list).to.have.length(40);
      expect(listObject.endOfList).to.be.false;
    });
  });
  
  describe("clear: ",function(){
    it("should remove results",function(){
      var results = getMoreItems(0, listObject.maxCount);
      listObject.add(results, "someCursor");
      
      listObject.clear();
      
      expect(listObject.list).to.have.length(0);
      expect(listObject.endOfList).to.be.false;
      expect(listObject.cursor).to.not.be.ok;      
    });
  });

});
