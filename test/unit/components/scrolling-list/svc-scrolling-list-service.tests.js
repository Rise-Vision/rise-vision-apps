"use strict";
describe("service: ScrollingListService:", function() {
  beforeEach(module("risevision.common.components.scrolling-list"));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('BatchOperations', function() {
      return function() {
        return {
          batch: sinon.stub().returns(Q.resolve())
        };
      };
    });

    $provide.service("processErrorCode", function() {
      return sinon.stub().returns("error");
    });

  }));
  var scrollingListService, ScrollingListService, listService, result, BatchOperations, processErrorCode;
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
      BatchOperations = $injector.get("BatchOperations");
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
    
    expect(scrollingListService.getSelected).to.be.a("function");
    expect(scrollingListService.select).to.be.a("function");
    expect(scrollingListService.selectAll).to.be.a("function");
    expect(scrollingListService.deselectAll).to.be.a("function");

    expect(scrollingListService.operations).to.be.ok;
    expect(scrollingListService.getSelectedAction).to.be.a("function");
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

  it('getSelected:', function() {
    expect(scrollingListService.getSelected()).to.have.length(0);

    scrollingListService.select(scrollingListService.items.list[0]);
    scrollingListService.select(scrollingListService.items.list[5]);

    expect(scrollingListService.getSelected()).to.have.length(2);
    expect(scrollingListService.getSelected()[1]).to.equal(scrollingListService.items.list[5]);

    scrollingListService.select(scrollingListService.items.list[0]);

    expect(scrollingListService.getSelected()).to.have.length(1);
    expect(scrollingListService.getSelected()[0]).to.equal(scrollingListService.items.list[5]);
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

  describe('deselectAll:', function() {
    beforeEach(function() {
      sinon.spy(scrollingListService, 'selectAll');
    });

    it('should toggle the selectAll flag to false', function() {
      scrollingListService.search.selectAll = true;

      scrollingListService.deselectAll();

      expect(scrollingListService.search.selectAll).to.be.false;
    });

    it('should deselect items', function() {
      scrollingListService.select(scrollingListService.items.list[0]);
      scrollingListService.select(scrollingListService.items.list[5]);

      scrollingListService.deselectAll();

      expect(scrollingListService.getSelected()).to.have.length(0);
      expect(scrollingListService.items.list[0].selected).to.be.false;
      expect(scrollingListService.items.list[5].selected).to.be.false;
    });
  });

  it('should not do anything if list is empty', function() {
    scrollingListService.items.list = [];
    scrollingListService.search.selectAll = true;

    scrollingListService.deselectAll();

    expect(scrollingListService.search.selectAll).to.be.true;
  });

  describe('getSelectedAction:', function() {
    it('should return a function', function() {
      expect(scrollingListService.getSelectedAction()).to.be.a('function');
    });

    it('should return early if no items are selected', function() {
      var action = scrollingListService.getSelectedAction(sinon.stub().returns(Q.resolve()), 'actionName');

      action();

      scrollingListService.operations.batch.should.not.have.been.called;
    });

    it('should call batch if items are selected', function() {
      scrollingListService.select(scrollingListService.items.list[0]);
      scrollingListService.select(scrollingListService.items.list[5]);

      var actionCall = sinon.stub().returns(Q.resolve());
      var action = scrollingListService.getSelectedAction(actionCall, 'actionName');

      action();

      scrollingListService.operations.batch.should.have.been.calledWith([
        scrollingListService.items.list[0],
        scrollingListService.items.list[5]
      ], sinon.match.func, 'actionName');
    });

    it('should remove items if flag is set', function(done) {
      var deferred = Q.defer();
      scrollingListService.operations.batch.returns(deferred.promise);

      scrollingListService.select(scrollingListService.items.list[0]);
      scrollingListService.select(scrollingListService.items.list[5]);

      var actionCall = sinon.stub().returns(Q.resolve());
      var action = scrollingListService.getSelectedAction(actionCall, 'actionName', true);

      // call the action
      action();
      // Resolve the batch execute function for both items
      scrollingListService.operations.batch.getCall(0).args[1](scrollingListService.items.list[5]);
      scrollingListService.operations.batch.getCall(0).args[1](scrollingListService.items.list[0]);

      setTimeout(function() {
        expect(scrollingListService.items.list).to.have.length(38);

        done();
      }, 10);
    });

    describe('errors:', function() {
      it('should clear error messages', function() {
        scrollingListService.select(scrollingListService.items.list[0]);
        scrollingListService.select(scrollingListService.items.list[5]);

        scrollingListService.errorMessage = "errorMessage";
        scrollingListService.apiError = "apiError";

        var action = scrollingListService.getSelectedAction(sinon.stub().returns(Q.resolve()), 'actionName');

        action();
        
        expect(scrollingListService.errorMessage).to.not.be.ok;
        expect(scrollingListService.apiError).to.not.be.ok;
      });

      it('should not populate error fields if calls were successful', function(done) {
        var deferred = Q.defer();
        scrollingListService.operations.batch.returns(deferred.promise);

        scrollingListService.select(scrollingListService.items.list[0]);
        scrollingListService.select(scrollingListService.items.list[5]);

        var actionCall = sinon.stub().returns(Q.resolve());
        var action = scrollingListService.getSelectedAction(actionCall, 'actionName');

        // call the action
        action();
        // Resolve the batch execute function
        scrollingListService.operations.batch.getCall(0).args[1](scrollingListService.items.list[0]);

        setTimeout(function() {
          // resolve the batch promise
          deferred.resolve();

          setTimeout(function() {
            expect(scrollingListService.errorMessage).to.not.be.ok;
            expect(scrollingListService.apiError).to.not.be.ok;

            done();
          }, 10);

        }, 10);
      });

      it('should handle api errors', function(done) {
        var deferred = Q.defer();
        scrollingListService.operations.batch.returns(deferred.promise);

        scrollingListService.select(scrollingListService.items.list[0]);
        scrollingListService.select(scrollingListService.items.list[5]);

        var actionCall = sinon.stub().returns(Q.reject());
        var action = scrollingListService.getSelectedAction(actionCall, 'actionName');

        // call the action
        action();
        // Resolve the batch execute function
        scrollingListService.operations.batch.getCall(0).args[1](scrollingListService.items.list[0]);

        setTimeout(function() {
          // resolve the batch promise
          deferred.resolve();

          setTimeout(function() {
            expect(scrollingListService.errorMessage).to.be.ok;
            expect(scrollingListService.apiError).to.be.ok;

            done();
          }, 10);

        }, 10);
      });

      it('should not overwrite existing error messages', function(done) {
        var deferred = Q.defer();
        scrollingListService.operations.batch.returns(deferred.promise);

        scrollingListService.select(scrollingListService.items.list[0]);
        scrollingListService.select(scrollingListService.items.list[5]);

        var actionCall = sinon.stub().returns(Q.reject());
        var action = scrollingListService.getSelectedAction(actionCall, 'actionName');

        // call the action
        action();

        scrollingListService.errorMessage = 'existingMessage';
        scrollingListService.apiError = 'existingError';

        // Resolve the batch execute function
        scrollingListService.operations.batch.getCall(0).args[1](scrollingListService.items.list[0]);

        setTimeout(function() {
          // resolve the batch promise
          deferred.resolve();

          setTimeout(function() {
            expect(scrollingListService.errorMessage).to.equal('existingMessage');
            expect(scrollingListService.apiError).to.equal('existingError');

            done();
          }, 10);

        }, 10);
      });

    });

    describe('refresh:', function() {
      beforeEach(function() {
        sinon.spy(scrollingListService, 'doSearch');
      });

      it('should not refresh items for regular operations', function(done) {
        scrollingListService.operations.batch.returns(Q.resolve());

        scrollingListService.select(scrollingListService.items.list[0]);
        scrollingListService.select(scrollingListService.items.list[5]);

        var actionCall = sinon.stub().returns(Q.resolve());
        var action = scrollingListService.getSelectedAction(actionCall, 'actionName');

        // call the action
        action();

        setTimeout(function() {
          scrollingListService.doSearch.should.not.have.been.called;

          done();
        }, 10);
      });

      it('should refresh items if Delete flag is set', function(done) {
        scrollingListService.operations.batch.returns(Q.resolve());

        scrollingListService.select(scrollingListService.items.list[0]);
        scrollingListService.select(scrollingListService.items.list[5]);

        var actionCall = sinon.stub().returns(Q.resolve());
        var action = scrollingListService.getSelectedAction(actionCall, 'actionName', true);

        // call the action
        action();

        setTimeout(function() {
          scrollingListService.doSearch.should.have.been.called;

          done();
        }, 10);
      });

      it('should not refresh the list on error', function(done) {
        var deferred = Q.defer();
        scrollingListService.operations.batch.returns(deferred.promise);

        scrollingListService.select(scrollingListService.items.list[0]);
        scrollingListService.select(scrollingListService.items.list[5]);

        var actionCall = sinon.stub().returns(Q.reject());
        var action = scrollingListService.getSelectedAction(actionCall, 'actionName');

        // call the action
        action();
        // Resolve the batch execute function
        scrollingListService.operations.batch.getCall(0).args[1](scrollingListService.items.list[0]);

        setTimeout(function() {
          // resolve the batch promise
          deferred.resolve();

          setTimeout(function() {
            scrollingListService.doSearch.should.not.have.been.called;

            done();
          }, 10);

        }, 10);
      });
      
    });

  });

});
