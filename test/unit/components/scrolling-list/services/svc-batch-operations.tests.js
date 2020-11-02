"use strict";
describe("service: BatchOperations:", function() {
  beforeEach(module("risevision.common.components.scrolling-list"));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service("batchOperationsTracker", function() {
      return sinon.stub();
    });

  }));

  var batchOperations, BatchOperations, method, items, $timeout, batchOperationsTracker;
  beforeEach(function(){
    items = [];
    for (var i = 1; i <= 8; i++) {
      items.push({
        id: i
      });
    }

    method = sinon.stub().returns(Q.defer().promise);

    inject(function($injector){
      BatchOperations = $injector.get("BatchOperations");
      $timeout = $injector.get('$timeout');
      batchOperationsTracker = $injector.get('batchOperationsTracker');
      batchOperations = new BatchOperations({});

      batchOperations.queueLimit = 3;
    });
  });

  it("should return blank object if nothing is passed",function(){
    batchOperations = new BatchOperations();
    
    expect(batchOperations).to.deep.equal({});
  });

  it("should exist",function(){
    expect(batchOperations).to.be.ok;
    
    expect(batchOperations.batch).to.be.a("function");
  });

  it("should init the service objects",function(){
    expect(batchOperations.activeOperation).to.not.be.ok;
    expect(batchOperations.queueLimit).to.be.greaterThan(0);
    expect(batchOperations.progress).to.equal(0);
    expect(batchOperations.totalItemCount).to.equal(0);
    expect(batchOperations.completedItemCount).to.equal(0);
  });

  describe('batch:', function() {
    it('should return a promise', function() {
      expect(batchOperations.batch().then).to.be.a('function');
    });

    it('should return early if no parameters are set', function() {
      batchOperations.batch();

      expect(batchOperations.activeOperation).to.not.be.ok;
      expect(batchOperations.progress).to.equal(0);
      expect(batchOperations.totalItemCount).to.equal(0);
      expect(batchOperations.completedItemCount).to.equal(0);
    });

    it('should return early if no items are sent', function() {
      batchOperations.batch([], method);

      expect(batchOperations.activeOperation).to.not.be.ok;
      expect(batchOperations.progress).to.equal(0);
      expect(batchOperations.totalItemCount).to.equal(0);
      expect(batchOperations.completedItemCount).to.equal(0);
    });

    it('should return early if no method is sent', function() {
      batchOperations.batch(items);

      expect(batchOperations.activeOperation).to.not.be.ok;
      expect(batchOperations.progress).to.equal(0);
      expect(batchOperations.totalItemCount).to.equal(0);
      expect(batchOperations.completedItemCount).to.equal(0);
    });

    it('should initialize variables if items are selected', function() {
      batchOperations.batch(items, method, 'operationName');

      expect(batchOperations.activeOperation).to.equal('operationName');
      expect(batchOperations.progress).to.equal(0);
      expect(batchOperations.totalItemCount).to.equal(8);
      expect(batchOperations.completedItemCount).to.equal(0);
      expect(batchOperationsTracker).to.have.been.calledWith('Batch Operation Started', 'operationName', items);
    });

    it('should call the action for the first batch of items', function() {
      var operationArgs  = 'args';
      batchOperations.batch(items, method, 'operationName', operationArgs);

      method.should.have.been.calledThrice;
      method.should.have.been.calledWith(items[0], operationArgs);
      method.should.have.been.calledWith(items[1], operationArgs);
      method.should.have.been.calledWith(items[2], operationArgs);
    });

    it('should update the variables once the actions are performed', function(done) {
      method.onCall(0).returns(Q.resolve());
      method.onCall(1).returns(Q.resolve());
      method.onCall(2).returns(Q.resolve());

      batchOperations.batch(items, method, 'operationName').then(function() {
        done('not finished');
      });

      setTimeout(function() {
        expect(batchOperations.activeOperation).to.equal('operationName');
        expect(batchOperations.progress).to.equal(38);
        expect(batchOperations.totalItemCount).to.equal(8);
        expect(batchOperations.completedItemCount).to.equal(3);
        expect(batchOperationsTracker).to.have.been.calledWith('Batch Operation Started', 'operationName', items);

        done();
      }, 10);
    });

    it('should queue additional calls', function(done) {
      method.onCall(0).returns(Q.resolve());
      method.onCall(1).returns(Q.resolve());
      method.onCall(2).returns(Q.resolve());

      batchOperations.batch(items, method, 'operationName').then(function() {
        done('not finished');
      });

      setTimeout(function() {
        expect(method.callCount).to.equal(6);

        done();
      }, 10);
    });

    it('should finish the batches and resolve', function(done) {
      method.returns(Q.resolve());

      batchOperations.batch(items, method, 'operationName').then(function() {
        expect(batchOperations.activeOperation).to.equal('operationName');
        expect(batchOperations.progress).to.equal(100);
        expect(batchOperations.totalItemCount).to.equal(8);
        expect(batchOperations.completedItemCount).to.equal(8);
        expect(batchOperations.hasErrors).to.be.false;

        expect(batchOperationsTracker).to.have.been.calledWith('Batch Operation Succeeded', 'operationName', items);

        done();
      });
    });

    it('should reset batch after 2 seconds of completion', function(done) {
      method.returns(Q.resolve());

      batchOperations.batch(items, method, 'operationName').then(function() {
        // flush one more time to bypass reset delay
        $timeout.flush(2000);

        $timeout.verifyNoPendingTasks();

        expect(batchOperations.activeOperation).to.not.be.ok;
        expect(batchOperations.progress).to.equal(0);
        expect(batchOperations.totalItemCount).to.equal(0);
        expect(batchOperations.completedItemCount).to.equal(0);

        done();
      });

    });

    it('should queue up only as many items as were completed', function(done) {
      method.onCall(0).returns(Q.resolve());
      method.onCall(1).returns(Q.resolve());

      batchOperations.batch(items, method, 'operationName');

      setTimeout(function() {
        expect(batchOperations.activeOperation).to.equal('operationName');
        expect(batchOperations.progress).to.equal(25);
        expect(batchOperations.totalItemCount).to.equal(8);
        expect(batchOperations.completedItemCount).to.equal(2);

        expect(method.callCount).to.equal(5);

        done();
      }, 10);
    });

    it('should reject if an operation fails', function(done) {
      method.returns(Q.resolve());
      method.onCall(1).returns(Q.reject());

      batchOperations.batch(items, method, 'operationName').catch(function() {
        expect(batchOperations.hasErrors).to.be.true;
        expect(batchOperations.progress).to.equal(100);
        expect(batchOperations.totalItemCount).to.equal(8);
        expect(batchOperations.completedItemCount).to.equal(8);

        expect(batchOperationsTracker).to.have.been.calledWith('Batch Operation Failed', 'operationName', items, {failureReason: ''});
        done();
      });
    });

  });

  describe('cancel:', function() {
    it('should not queue additional calls after cancel', function(done) {
      method.onCall(0).returns(Q.resolve());
      method.onCall(1).returns(Q.resolve());
      method.onCall(2).returns(Q.resolve());

      batchOperations.batch(items, method, 'operationName');
      
      expect(batchOperationsTracker).to.have.been.calledWith('Batch Operation Started', 'operationName', items);

      batchOperations.cancel();

      setTimeout(function() {
        expect(method.callCount).to.equal(3);
        expect(batchOperationsTracker).to.have.been.calledWith('Batch Operation Failed', 'operationName', items, {failureReason: 'cancelled'});

        done();
      }, 10);
    });

    it('should reject and reset activeOperation on cancel', function(done) {
      method.onCall(0).returns(Q.resolve());
      method.onCall(1).returns(Q.resolve());
      method.onCall(2).returns(Q.resolve());

      batchOperations.batch(items, method, 'operationName').catch(function(reason) {
        expect(reason).to.equal('cancelled');
        expect(method.callCount).to.equal(3);

        $timeout.verifyNoPendingTasks();

        expect(batchOperations.activeOperation).to.not.be.ok;
        expect(batchOperations.totalItemCount).to.equal(0);

        // batchOperations.progress & batchOperations.completedItemCount may not be 0
        // as active operations may still return results after cancel

        done();
      });
      batchOperations.cancel();

    });
  });

});
