'use strict';

describe('service: purchase flow tracker:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.common.components.logging'));
  beforeEach(module(function ($provide) {
    $provide.factory('analyticsFactory', [function () {
      return {
        track: sandbox.stub()
      };
    }]);    
  }));

  afterEach(function() {
    sandbox.restore();
  });
  
  var purchaseFlowTracker, analyticsFactory;
  beforeEach(function(){
    inject(function($rootScope, $injector){
      purchaseFlowTracker = $injector.get('purchaseFlowTracker');
      analyticsFactory = $injector.get('analyticsFactory');
    });
  });
  
  it('should exist, also methods', function() {
    expect(purchaseFlowTracker.trackProductAdded).to.be.a('function');
    expect(purchaseFlowTracker.trackPlaceOrderClicked).to.be.a('function');
    expect(purchaseFlowTracker.trackOrderPayNowClicked).to.be.a('function');
  });

  describe('trackProductAdded:', function() {
    it('should call analyticsFactory', function() {
      var plan = {
        productCode: '123',
        name: 'plan123',
        isMonthly: true,
        monthly: { billAmount: 10 }
      };
      purchaseFlowTracker.trackProductAdded(plan);
      expect(analyticsFactory.track).to.have.been.calledWith('Product Added', {
        id: '123',
        name: 'plan123',
        price: 10,
        quantity: 1,
        category: 'Plans',
        inApp: false
      });
    });
  });

  describe('trackPlaceOrderClicked:', function() {
    it('should call analyticsFactory', function() {
      var properties = {total:123};
      purchaseFlowTracker.trackPlaceOrderClicked(properties);
      expect(analyticsFactory.track).to.have.been.calledWith('Place Order Clicked', properties);
    });
  });

  describe('trackOrderPayNowClicked:', function() {
    it('should call analyticsFactory', function() {
      var properties = {total:123};
      purchaseFlowTracker.trackOrderPayNowClicked(properties);
      expect(analyticsFactory.track).to.have.been.calledWith('Order Pay Now Clicked', properties);
    });
  }); 
});
