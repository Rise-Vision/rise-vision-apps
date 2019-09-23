"use strict";
describe("service: ScrollingListService:", function() {
  beforeEach(module("risevision.common.components.scrolling-list"));
  beforeEach(module(function ($provide) {
    $provide.service("listService",function(){
      return {};
    });
    $provide.service("processErrorCode", function() {
      return processErrorCode = sinon.spy(function() { return "error"; });
    });

  }));
  var scrollingListService, returnItems, apiCount, result, processErrorCode;
  beforeEach(function(){
    var listService = function() {
      apiCount++;
      var deferred = Q.defer();
      if(returnItems){
        deferred.resolve(result);
      }else{
        deferred.reject({result: {error: { message: "ERROR; could not load list"}}});
      }
      return deferred.promise;
    };
    
    result = {
      items: [],
      cursor: "asdf"
    };
    for (var i = 1; i <= 40; i++) {
      result.items.push(i);
    }
    apiCount = 0;
    returnItems = true;

    inject(function($injector){
      var ScrollingListService = $injector.get("ScrollingListService");
      scrollingListService = new ScrollingListService(listService);
    });
  });
  
  beforeEach(function(done) {
    setTimeout(function(){
      expect(scrollingListService.loadingItems).to.be.false;
      expect(apiCount).to.equal(1);
      expect(scrollingListService.error).to.not.be.ok;

      done();
    },10);
  });

  it("should exist",function(){
    expect(scrollingListService).to.be.ok;
    
    expect(scrollingListService.sortBy).to.be.a("function");
    expect(scrollingListService.doSearch).to.be.a("function");
    expect(scrollingListService.load).to.be.a("function");
  });

  it("should init the service objects",function(){
    expect(scrollingListService.items).to.be.ok;
    expect(scrollingListService.items).to.have.property("list");
    expect(scrollingListService.items).to.have.property("add");
    expect(scrollingListService.items).to.have.property("clear");
    expect(scrollingListService.items).to.have.property("endOfList");

    expect(scrollingListService.search).to.be.ok;
    expect(scrollingListService.search).to.have.property("sortBy");
    expect(scrollingListService.search).to.have.property("count");
    expect(scrollingListService.search).to.have.property("reverse");
  });


  it("should load the list",function(){
    expect(scrollingListService.loadingItems).to.be.false;
    expect(scrollingListService.items).to.be.ok;
    expect(scrollingListService.items.list).to.have.length(40);
    expect(scrollingListService.items.cursor).to.be.ok;
    expect(scrollingListService.items.endOfList).to.be.false;

  });
  
  
  describe("list functions: ",function(){
    returnItems = true;

    describe("load: ",function(){
      it("should re-load if there are more items",function(done){
        result = {
          items: [21]
        };
        scrollingListService.load();

        expect(scrollingListService.loadingItems).to.be.true;
        setTimeout(function(){
          expect(scrollingListService.loadingItems).to.be.false;
          expect(scrollingListService.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect(scrollingListService.items.list).to.have.length(41);
          expect(scrollingListService.items.cursor).to.not.be.ok;
          expect(scrollingListService.items.endOfList).to.be.true;

          done();
        },10);
      });

      it("should not re-load if there are no more items",function(done){
        result = {
          items: [41]
        };
        scrollingListService.load();

        expect(scrollingListService.loadingItems).to.be.true;
        setTimeout(function(){
          scrollingListService.load();

          expect(scrollingListService.loadingItems).to.be.false;

          done();
        },10);
      });
    });

    describe("sortBy: ",function(){
      it("should sort by changeDate in ascending order by default",function(){
        expect(scrollingListService.search.sortBy).to.equal("name");
        expect(scrollingListService.search.reverse).to.be.false;
      });
      
      it("should toggle descending order (reverse = false)",function(done){
        scrollingListService.sortBy("name");

        expect(scrollingListService.loadingItems).to.be.true;
        setTimeout(function(){
          expect(scrollingListService.loadingItems).to.be.false;
          expect(scrollingListService.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect(scrollingListService.items.list).to.have.length(40);

          expect(scrollingListService.search.sortBy).to.equal("name");
          expect(scrollingListService.search.reverse).to.be.true;

          done();
        },10);

      });

      it("should reset list and sort by name in descending order",function(done){
        scrollingListService.sortBy("changeDate");

        expect(scrollingListService.loadingItems).to.be.true;
        setTimeout(function(){
          expect(scrollingListService.loadingItems).to.be.false;
          expect(scrollingListService.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect(scrollingListService.items.list).to.have.length(40);

          expect(scrollingListService.search.sortBy).to.equal("changeDate");
          expect(scrollingListService.search.reverse).to.be.false;

          done();
        },10);
      });
    });

    it("should reset list and doSearch",function(done){
      scrollingListService.doSearch();

      expect(scrollingListService.loadingItems).to.be.true;
      setTimeout(function(){
        expect(scrollingListService.loadingItems).to.be.false;
        expect(scrollingListService.error).to.not.be.ok;
        expect(apiCount).to.equal(2);

        expect(scrollingListService.items.list).to.have.length(40);

        expect(scrollingListService.search.sortBy).to.equal("name");
        expect(scrollingListService.search.reverse).to.be.false;

        done();
      },10);
    });

    it("should set error if list fails to load",function(done){
      returnItems = false;
      scrollingListService.doSearch();

      expect(scrollingListService.loadingItems).to.be.true;
      setTimeout(function(){
        expect(scrollingListService.loadingItems).to.be.false;
        expect(scrollingListService.errorMessage).to.be.ok;
        processErrorCode.should.have.been.calledWith("Items", "load", sinon.match.object);
        expect(scrollingListService.apiError).to.be.ok;

        expect(apiCount).to.equal(2);
        expect(scrollingListService.items.list).to.have.length(0);

        done();
      },10);
    });
    
    it("should clear error messages",function(done){
      scrollingListService.errorMessage = "errorMessage";
      scrollingListService.apiError = "apiError";
      scrollingListService.doSearch();

      expect(scrollingListService.loadingItems).to.be.true;
      setTimeout(function(){
        expect(scrollingListService.errorMessage).to.not.be.ok;
        expect(scrollingListService.apiError).to.not.be.ok;

        done();
      },10);
    });
  });


});
