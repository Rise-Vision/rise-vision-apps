'use strict';

describe('service: subscriptionFactory:', function() {
  var subscriptionFactory, billing, analyticsFactory;

  beforeEach(module('risevision.apps.billing.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('billing',function() {
      return {
        getSubscription: sinon.stub().returns(Q.resolve({item: 'subscription'}))
      };
    });
    $provide.service('processErrorCode',function() {
      return function(err) {
        return 'processed ' + err;
      };
    });
    $provide.service('analyticsFactory',function() {
      return {
        track: sinon.stub()
      };
    });

  }));

  beforeEach(function() {
    inject(function($injector){
      billing = $injector.get('billing');
      subscriptionFactory = $injector.get('subscriptionFactory');
      analyticsFactory = $injector.get('analyticsFactory');
    });
  });

  it('should exist',function() {
    expect(subscriptionFactory).to.be.ok;

    expect(subscriptionFactory.getSubscription).to.be.a('function');
  });

  describe('getSubscription:', function() {
    it('should get subscription, show spinner and reset errors', function() {
      subscriptionFactory.apiError = 'someError';
      subscriptionFactory.item = 'someSubscription';

      subscriptionFactory.getSubscription('subscriptionId');

      billing.getSubscription.should.have.been.calledWith('subscriptionId');

      expect(subscriptionFactory.apiError).to.not.be.ok;
      expect(subscriptionFactory.item).to.not.be.ok;
      expect(subscriptionFactory.loading).to.be.true;
    });

    it('should retrieve subscription', function(done) {
      subscriptionFactory.getSubscription();

      setTimeout(function() {
        expect(subscriptionFactory.loading).to.be.false;

        expect(subscriptionFactory.item).to.equal('subscription');

        done();
      }, 10);
    });

    it('should handle failure to get subscription correctly', function(done) {
      billing.getSubscription.returns(Q.reject('error'));

      subscriptionFactory.getSubscription()

      setTimeout(function() {
        expect(subscriptionFactory.loading).to.be.false;
        expect(subscriptionFactory.item).to.not.be.ok;

        expect(subscriptionFactory.apiError).to.equal('processed error');

        done();
      });
    });
  });

});
