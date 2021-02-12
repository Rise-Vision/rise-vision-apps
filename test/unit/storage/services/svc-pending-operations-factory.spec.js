'use strict';
describe('service: pendingOperationsFactory', function() {
  var pendingOperationsFactory;
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.storage.services'));
  beforeEach(function(){
    inject(function($injector){
      pendingOperationsFactory = $injector.get('pendingOperationsFactory');
    });
  });

  afterEach(function(){
    sandbox.restore();
  });

  it('should exist',function(){
    expect(pendingOperationsFactory).to.be.truely;
    expect(pendingOperationsFactory.pendingOperations).to.be.ok;
    expect(pendingOperationsFactory.statusDetails).to.be.ok;
    expect(pendingOperationsFactory.isPOCollapsed).to.be.ok;
    expect(pendingOperationsFactory.addPendingOperation).to.be.a('function');
    expect(pendingOperationsFactory.addPendingOperations).to.be.a('function');
    expect(pendingOperationsFactory.removePendingOperation).to.be.a('function');
    expect(pendingOperationsFactory.removePendingOperations).to.be.a('function');
    expect(pendingOperationsFactory.getActivePendingOperations).to.be.a('function');
  });

  describe('addPendingOperations:',function(){
    it('should add a pending operation',function(){
      pendingOperationsFactory.addPendingOperation({ name: 'file1' }, 'error');
      expect(pendingOperationsFactory.pendingOperations.length).to.equal(1);
    });

    it('should add pending operations',function(){
      pendingOperationsFactory.addPendingOperations([{ name: 'file1' }, { name: 'file2' }], 'error');
      expect(pendingOperationsFactory.pendingOperations.length).to.equal(2);
    });
    
    it('should clear previously failed operations', function() {
      var file1 = { name: 'file1', actionFailed: true };
      pendingOperationsFactory.pendingOperations = [file1, { name: 'file2' }, { name: 'file3', actionFailed: true}];

      pendingOperationsFactory.addPendingOperation(file1);
      
      expect(pendingOperationsFactory.pendingOperations.length).to.equal(2);
      expect(pendingOperationsFactory.pendingOperations.indexOf(file1)).to.not.equal(-1);
      expect(file1.actionFailed).to.be.false;
    });
  });

  describe('removePendingOperation:',function(){
    it('should remove pending operation',function(){
      pendingOperationsFactory.pendingOperations = [{ name: 'file1' }, { name: 'file2' }];
      pendingOperationsFactory.removePendingOperation({ name: 'file2' });
      expect(pendingOperationsFactory.pendingOperations.length).to.equal(1);
      expect(pendingOperationsFactory.pendingOperations.indexOf({ name: 'file2' })).to.equal(-1);
    });

    it('should handle not found',function () {
      pendingOperationsFactory.removePendingOperation({ name: 'file3' });
    });
    
    it('should reset actionFailed flag', function() {
      var file1 = { name: 'file1', actionFailed: true };
      pendingOperationsFactory.pendingOperations = [file1, { name: 'file2' }];
      pendingOperationsFactory.removePendingOperation({ name: 'file1' });
      expect(pendingOperationsFactory.pendingOperations.length).to.equal(1);
      expect(file1.actionFailed).to.be.false;
    });
  });

  describe('getActivePendingOperations:',function(){
    it('should return pending operations',function(){
      pendingOperationsFactory.pendingOperations = [{name:'file1'}, {name:'file2'}];

      expect(pendingOperationsFactory.getActivePendingOperations())
        .to.deep.equal(pendingOperationsFactory.pendingOperations);
    });

    it('should not return failed operations',function(){
      pendingOperationsFactory.pendingOperations = [{name:'file1'}, {name:'file2', actionFailed: true}];

      expect(pendingOperationsFactory.getActivePendingOperations())
        .to.contain(pendingOperationsFactory.pendingOperations[0]);
      expect(pendingOperationsFactory.getActivePendingOperations())
        .to.not.contain(pendingOperationsFactory.pendingOperations[1]);
    });
  });
});
