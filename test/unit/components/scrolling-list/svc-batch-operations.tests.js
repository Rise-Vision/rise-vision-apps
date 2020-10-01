"use strict";
describe("service: BatchOperations:", function() {
  beforeEach(module("risevision.common.components.scrolling-list"));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

  }));

  var batchOperations, BatchOperations, method, items, $timeout;
  beforeEach(function(){
    items = [];
    for (var i = 1; i <= 8; i++) {
      items.push({
        id: i
      });
    }

    method = sinon.stub().returns(Q.resolve());

    inject(function($injector){
      BatchOperations = $injector.get("BatchOperations");
      $timeout = $injector.get('$timeout');
      batchOperations = new BatchOperations();

      batchOperations.queueLimit = 3;
    });
  });

  it("should exist",function(){
    expect(batchOperations).to.be.ok;
    
    expect(batchOperations.batch).to.be.a("function");
  });

  it("should init the service objects",function(){
    expect(batchOperations.isActive).to.be.false;
    expect(batchOperations.queueLimit).to.be.greaterThan(0);
    expect(batchOperations.totalItemCount).to.equal(0);
    expect(batchOperations.completedItemCount).to.equal(0);
  });

  describe('batch:', function() {
    it('should return a promise', function() {
      expect(batchOperations.batch().then).to.be.a('function');
    });

    it('should return early if no parameters are set', function() {
      batchOperations.batch();

      expect(batchOperations.isActive).to.be.false;
      expect(batchOperations.totalItemCount).to.equal(0);
      expect(batchOperations.completedItemCount).to.equal(0);
    });

    it('should return early if no items are sent', function() {
      batchOperations.batch([], method);

      expect(batchOperations.isActive).to.be.false;
      expect(batchOperations.totalItemCount).to.equal(0);
      expect(batchOperations.completedItemCount).to.equal(0);
    });

    it('should return early if no method is sent', function() {
      batchOperations.batch(items);

      expect(batchOperations.isActive).to.be.false;
      expect(batchOperations.totalItemCount).to.equal(0);
      expect(batchOperations.completedItemCount).to.equal(0);
    });

    it('should initialize variables if items are selected', function() {
      batchOperations.batch(items, method);

      expect(batchOperations.isActive).to.be.true;
      expect(batchOperations.totalItemCount).to.equal(8);
      expect(batchOperations.completedItemCount).to.equal(0);
    });

    it('should call the action for the first batch of items', function() {
      batchOperations.batch(items, method);

      method.should.have.been.calledThrice;
      method.should.have.been.calledWith(items[0]);
      method.should.have.been.calledWith(items[1]);
      method.should.have.been.calledWith(items[2]);
    });

    it('should update the variables once the actions are performed', function(done) {
      batchOperations.batch(items, method).then(function() {
        done('not finished');
      });

      setTimeout(function() {
        expect(batchOperations.isActive).to.be.true;
        expect(batchOperations.totalItemCount).to.equal(8);
        expect(batchOperations.completedItemCount).to.equal(3);

        done();
      }, 10);
    });

    it('should set the next batch and complete the actions after timeout', function(done) {
      batchOperations.batch(items, method).then(function() {
        done('not finished');
      });

      setTimeout(function() {
        $timeout.flush(500);

        expect(method.callCount).to.equal(6);

        setTimeout(function() {
          expect(batchOperations.isActive).to.be.true;
          expect(batchOperations.totalItemCount).to.equal(8);
          expect(batchOperations.completedItemCount).to.equal(6);

          done();
        }, 10);

      }, 10);
    });

    it('should finish the batches and resolve', function(done) {
      batchOperations.batch(items, method).then(function() {
        expect(batchOperations.isActive).to.be.false;
        expect(batchOperations.totalItemCount).to.equal(0);
        expect(batchOperations.completedItemCount).to.equal(0);

        done();
      });

      setTimeout(function() {
        $timeout.flush(500);

        expect(method.callCount).to.equal(6);

        setTimeout(function() {
          $timeout.flush(500);

          expect(method.callCount).to.equal(8);

          // flush one more time to validate queue limit
          $timeout.flush(500);

          $timeout.verifyNoPendingTasks();

          expect(batchOperations.isActive).to.be.true;
          expect(batchOperations.totalItemCount).to.equal(8);
          expect(batchOperations.completedItemCount).to.equal(6);
        }, 10);

      }, 10);
    });

    it('should queue up only as many items as were completed', function(done) {
      method.onCall(2).returns(Q.defer().promise);

      batchOperations.batch(items, method);

      setTimeout(function() {
        expect(batchOperations.isActive).to.be.true;
        expect(batchOperations.totalItemCount).to.equal(8);
        expect(batchOperations.completedItemCount).to.equal(2);

        $timeout.flush(500);

        expect(method.callCount).to.equal(5);

        setTimeout(function() {
          expect(batchOperations.isActive).to.be.true;
          expect(batchOperations.totalItemCount).to.equal(8);
          expect(batchOperations.completedItemCount).to.equal(4);

          done();
        }, 10);

      }, 10);
    });


  });

});
