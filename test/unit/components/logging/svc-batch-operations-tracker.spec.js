'use strict';

describe('service: batch operations tracker:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.common.components.logging'));
  beforeEach(module(function ($provide) {
    $provide.factory('analyticsFactory', [function () {
      return {
        track: sandbox.stub()
      };
    }]);

    $provide.factory('userState', [function () {
      return {
        getSelectedCompanyId: sandbox.stub().returns('companyId')
      };
    }]);    
  }));

  afterEach(function() {
    sandbox.restore();
  });
  
  var batchOperationsTracker, analyticsFactory, operation, items;
  beforeEach(function(){
    inject(function($rootScope, $injector){
      operation = {
        name: 'operationName'
      };
      items = ['item1','item2'];

      batchOperationsTracker = $injector.get('batchOperationsTracker');
      analyticsFactory = $injector.get('analyticsFactory');
    });
  });
  
  it('should exist',function(){
    expect(batchOperationsTracker).to.be.truely;
    expect(batchOperationsTracker).to.be.a('function');
  });
  
  it('should call analytics service',function(){
    batchOperationsTracker('Batch Operation Started', operation, items);

    analyticsFactory.track.should.have.been.calledWith('Batch Operation Started', {
      operationName: 'operationName',
      itemsCount: 2,
      companyId: 'companyId'
    });
  });

  it('should call analytics service with extra properties',function(){
    batchOperationsTracker('Batch Operation Started', operation, items, {extra: 'property'});

    analyticsFactory.track.should.have.been.calledWith('Batch Operation Started', {
      extra: 'property',
      operationName: 'operationName',
      itemsCount: 2,
      companyId: 'companyId'
    });
  });
  
  it('should not call w/ blank event',function(){
    batchOperationsTracker();

    analyticsFactory.track.should.not.have.been.called;
  });
  
});
