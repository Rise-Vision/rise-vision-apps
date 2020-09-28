"use strict";
describe("service: ScrollingListService:", function() {
  beforeEach(module("risevision.common.components.scrolling-list"));
  beforeEach(module(function ($provide) {
    $provide.service("processErrorCode", function() {
      return sinon.stub().returns("error");
    });

  }));
  var scrollingListService, ScrollingListService, listService, result, processErrorCode;
  beforeEach(function(){
    result = {
      items: [],
      cursor: "asdf"
    };
    for (var i = 1; i <= 40; i++) {
      result.items.push({
        id: i
      });
    }

    listService = sinon.stub().callsFake(function() {
      return Q.resolve(result);
    });

    inject(function($injector){
      ScrollingListService = $injector.get("ScrollingListService");
      processErrorCode = $injector.get('processErrorCode');
      scrollingListService = new ScrollingListService(listService);
    });
  });
  
  beforeEach(function(done) {
    setTimeout(function(){
      expect(scrollingListService.loadingItems).to.be.false;
      listService.should.have.been.calledOnce;
      expect(scrollingListService.error).to.not.be.ok;

      done();
    },10);
  });

  it("should exist",function(){
    expect(scrollingListService).to.be.ok;
    
    expect(scrollingListService.sortBy).to.be.a("function");
    expect(scrollingListService.doSearch).to.be.a("function");
    expect(scrollingListService.load).to.be.a("function");
    
    expect(scrollingListService.select).to.be.a("function");
    expect(scrollingListService.selectAll).to.be.a("function");
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
    expect(scrollingListService.search).to.have.property("selectAll");
  });

  it('should init search', function() {
    expect(scrollingListService.search).to.deep.equal({
      sortBy: 'name',
      count: 40,
      reverse: false,
      name: 'Items',
      selectAll: false
    });
  });

  it('should update search with defaults', function() {
    scrollingListService = new ScrollingListService(listService, {
      sortBy: 'lastModified',
      reverse: true
    });

    expect(scrollingListService.search).to.deep.equal({
      sortBy: 'lastModified',
      count: 40,
      reverse: true,
      name: 'Items',
      selectAll: false
    });
  });

  it("should load the list",function(){
    expect(scrollingListService.loadingItems).to.be.false;
    expect(scrollingListService.items).to.be.ok;
    expect(scrollingListService.items.list).to.have.length(40);
    expect(scrollingListService.items.cursor).to.be.ok;
    expect(scrollingListService.items.endOfList).to.be.false;
  });

  describe("list functions: ",function(){
    describe("load: ",function(){
      it("should re-load if there are more items",function(done){
        scrollingListService.search.selectAll = true;

        result = {
          items: [21]
        };
        scrollingListService.load();

        expect(scrollingListService.loadingItems).to.be.true;
        setTimeout(function(){
          expect(scrollingListService.loadingItems).to.be.false;
          expect(scrollingListService.error).to.not.be.ok;
          listService.should.have.been.calledTwice;

          expect(scrollingListService.items.list).to.have.length(41);
          expect(scrollingListService.items.cursor).to.not.be.ok;
          expect(scrollingListService.items.endOfList).to.be.true;

          expect(scrollingListService.search.selectAll).to.be.false;

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
      it("should sort by name in descending order by default",function(){
        expect(scrollingListService.search.sortBy).to.equal("name");
        expect(scrollingListService.search.reverse).to.be.false;
      });

      it("should reset list and selectAll", function() {
        scrollingListService.search.selectAll = true;

        scrollingListService.sortBy("name");

        expect(scrollingListService.items.list).to.have.length(0);
        expect(scrollingListService.search.selectAll).to.be.false;
      });

      it("should toggle ascending order (reverse = true)",function(done){
        scrollingListService.sortBy("name");

        expect(scrollingListService.loadingItems).to.be.true;
        setTimeout(function(){
          expect(scrollingListService.loadingItems).to.be.false;
          expect(scrollingListService.error).to.not.be.ok;
          listService.should.have.been.calledTwice;

          expect(scrollingListService.items.list).to.have.length(40);

          expect(scrollingListService.search.sortBy).to.equal("name");
          expect(scrollingListService.search.reverse).to.be.true;

          done();
        },10);

      });

      it("should reset list and sort by changeDate in descending order",function(done){
        scrollingListService.sortBy("changeDate");

        expect(scrollingListService.loadingItems).to.be.true;
        setTimeout(function(){
          expect(scrollingListService.loadingItems).to.be.false;
          expect(scrollingListService.error).to.not.be.ok;
          listService.should.have.been.calledTwice;

          expect(scrollingListService.items.list).to.have.length(40);

          expect(scrollingListService.search.sortBy).to.equal("changeDate");
          expect(scrollingListService.search.reverse).to.be.false;

          done();
        },10);
      });
    });

  });

  describe("doSearch:", function() {
    it("should reset list and selectAll", function() {
      scrollingListService.search.selectAll = true;

      scrollingListService.doSearch();

      expect(scrollingListService.items.list).to.have.length(0);
      expect(scrollingListService.search.selectAll).to.be.false;
    });

    it("should reset list and doSearch",function(done){
      scrollingListService.doSearch();

      expect(scrollingListService.loadingItems).to.be.true;
      setTimeout(function(){
        expect(scrollingListService.loadingItems).to.be.false;
        expect(scrollingListService.error).to.not.be.ok;
        listService.should.have.been.calledTwice;

        expect(scrollingListService.items.list).to.have.length(40);

        expect(scrollingListService.search.sortBy).to.equal("name");
        expect(scrollingListService.search.reverse).to.be.false;

        done();
      },10);
    });

    it("should set error if list fails to load",function(done){
      listService.returns(Q.reject({result: {error: { message: "ERROR; could not load list"}}}));

      scrollingListService.doSearch();

      expect(scrollingListService.loadingItems).to.be.true;
      setTimeout(function(){
        expect(scrollingListService.loadingItems).to.be.false;
        expect(scrollingListService.errorMessage).to.be.ok;
        processErrorCode.should.have.been.calledWith("Items", "load", sinon.match.object);
        expect(scrollingListService.apiError).to.be.ok;

        listService.should.have.been.calledTwice;
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

  describe('select:', function() {
    it('should select item', function() {
      scrollingListService.select(scrollingListService.items.list[0]);

      expect(scrollingListService.items.list[0].selected).to.be.true;
    });

    it('should toggle selected item', function() {
      scrollingListService.select(scrollingListService.items.list[0]);

      expect(scrollingListService.items.list[0].selected).to.be.true;

      scrollingListService.select(scrollingListService.items.list[0]);

      expect(scrollingListService.items.list[0].selected).to.be.false;
    });

    it('should reset selectAll flag', function() {
      scrollingListService.search.selectAll = true;
      scrollingListService.select(scrollingListService.items.list[0]);

      expect(scrollingListService.search.selectAll).to.be.false;
    });

    it('should set selectAll if all items are selected', function() {
      scrollingListService.items.list = [
        {id: 0},
        {id: 1, selected: true},
        {id: 2, selected: true}
      ];

      scrollingListService.select(scrollingListService.items.list[0]);

      expect(scrollingListService.items.list[0].selected).to.be.true;
      expect(scrollingListService.search.selectAll).to.be.true;
    });

    it('should not do anything if item is invalid', function() {
      scrollingListService.items.list = [{id: 0}];
      scrollingListService.search.selectAll = true;

      scrollingListService.select();

      expect(scrollingListService.items.list[0].selected).to.not.be.ok;
      expect(scrollingListService.search.selectAll).to.be.true;
    });

  });

  describe('selectAll:', function() {
    it('should select all items', function() {
      scrollingListService.selectAll();

      expect(scrollingListService.search.selectAll).to.be.true;
      expect(scrollingListService.items.list[0].selected).to.be.true;
      expect(scrollingListService.items.list[2].selected).to.be.true;
    });

    it('should toggle select all items', function() {
      scrollingListService.items.list[2].selected = true;

      scrollingListService.selectAll();

      expect(scrollingListService.items.list[0].selected).to.be.true;
      expect(scrollingListService.items.list[2].selected).to.be.true;

      scrollingListService.selectAll();

      expect(scrollingListService.search.selectAll).to.be.false;
      expect(scrollingListService.items.list[0].selected).to.be.false;
      expect(scrollingListService.items.list[2].selected).to.be.false;
    });

    it('should not do anything if list is empty', function() {
      scrollingListService.items.list = [];
      scrollingListService.search.selectAll = true;

      scrollingListService.selectAll();

      expect(scrollingListService.search.selectAll).to.be.true;
    });

  });

});
