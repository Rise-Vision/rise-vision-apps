'use strict';

describe('service: subscriptionFactory:', function() {
  var subscriptionFactory, billing, confirmModal;

  beforeEach(module('risevision.apps.billing.services'));
  beforeEach(module("risevision.apps.purchase"));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('billing',function() {
      return {
        getSubscription: sinon.stub().returns(Q.resolve({item: 'subscription'})),
        changePaymentSource: sinon.stub().returns(Q.resolve({item: {payment_source: 'paymentSource'}}))
      }
    });
    $provide.factory('confirmModal', function() {
      return sinon.stub().returns(Q.resolve());
    });
    $provide.service('processErrorCode',function() {
      return function(err) {
        return 'processed ' + err;
      };
    });

  }));

  beforeEach(function() {
    inject(function($injector){
      billing = $injector.get('billing');
      subscriptionFactory = $injector.get('subscriptionFactory');
      confirmModal = $injector.get('confirmModal');
    });
  });

  it('should exist',function() {
    expect(subscriptionFactory).to.be.ok;

    expect(subscriptionFactory.getItemSubscription).to.be.a('function');
    expect(subscriptionFactory.getItemCustomer).to.be.a('function');
    expect(subscriptionFactory.getPaymentSourceId).to.be.a('function');
    expect(subscriptionFactory.isInvoiced).to.be.a('function');

    expect(subscriptionFactory.getSubscription).to.be.a('function');
    expect(subscriptionFactory.changePaymentMethod).to.be.a('function');
  });

  describe('getItemSubscription:', function() {
    it('should handle null values', function() {
      expect(subscriptionFactory.getItemSubscription()).to.deep.equal({});

      subscriptionFactory.item = {};
      expect(subscriptionFactory.getItemSubscription()).to.deep.equal({});
    });

    it('should return subscription', function() {
      subscriptionFactory.item = {
        subscription: 'subscription'
      };

      expect(subscriptionFactory.getItemSubscription()).to.equal('subscription');
    });

  });

  describe('getItemCustomer:', function() {
    it('should handle null values', function() {
      expect(subscriptionFactory.getItemCustomer()).to.deep.equal({});

      subscriptionFactory.item = {};
      expect(subscriptionFactory.getItemCustomer()).to.deep.equal({});
    });

    it('should return customer', function() {
      subscriptionFactory.item = {
        customer: 'customer'
      };

      expect(subscriptionFactory.getItemCustomer()).to.equal('customer');
    });

  });

  describe('getPaymentSourceId:', function() {
    it('should handle null values', function() {
      expect(subscriptionFactory.getPaymentSourceId()).to.be.null;

      subscriptionFactory.item = {};
      expect(subscriptionFactory.getPaymentSourceId()).to.be.null;
    });

    describe('subscription check:', function() {
      it('should check payment_source_id', function() {
        subscriptionFactory.item = {
          subscription: {
            payment_source_id: '123'
          }
        };

        expect(subscriptionFactory.getPaymentSourceId()).to.equal('123');
      });

      it('should check payment_source_id undefined', function() {
        subscriptionFactory.item = {
          subscription: {}
        };

        expect(subscriptionFactory.getPaymentSourceId()).to.be.null;
      });
    });

    describe('customer check:', function() {
      it('should check primary_payment_source_id', function() {
        subscriptionFactory.item = {
          customer: {
            primary_payment_source_id: '234'
          }
        };

        expect(subscriptionFactory.getPaymentSourceId()).to.equal('234');
      });

      it('should check primary_payment_source_id undefined', function() {
        subscriptionFactory.item = {
          customer: {}
        };

        expect(subscriptionFactory.getPaymentSourceId()).to.be.null;
      });
    });

    it('should use subscription value', function() {
      subscriptionFactory.item = {
        subscription: {
          payment_source_id: '123'
        },
        customer: {
          primary_payment_source_id: '234'
        }
      };

      expect(subscriptionFactory.getPaymentSourceId()).to.equal('123');
    });

  });

  describe('isInvoiced:', function() {
    it('should handle null values', function() {
      expect(subscriptionFactory.isInvoiced()).to.be.false;

      subscriptionFactory.item = {};
      expect(subscriptionFactory.isInvoiced()).to.be.false;
    });

    describe('subscription check:', function() {
      it('should check auto_collection on', function() {
        subscriptionFactory.item = {
          subscription: {
            auto_collection: 'on'
          }
        };

        expect(subscriptionFactory.isInvoiced()).to.be.false;
      });

      it('should check auto_collection off', function() {
        subscriptionFactory.item = {
          subscription: {
            auto_collection: 'off'
          }
        };

        expect(subscriptionFactory.isInvoiced()).to.be.true;
      });

      it('should check auto_collection undefined', function() {
        subscriptionFactory.item = {
          subscription: {}
        };

        expect(subscriptionFactory.isInvoiced()).to.be.false;
      });
    });

    describe('customer check:', function() {
      it('should check auto_collection on', function() {
        subscriptionFactory.item = {
          customer: {
            auto_collection: 'on'
          }
        };

        expect(subscriptionFactory.isInvoiced()).to.be.false;
      });

      it('should check auto_collection off', function() {
        subscriptionFactory.item = {
          customer: {
            auto_collection: 'off'
          }
        };

        expect(subscriptionFactory.isInvoiced()).to.be.true;
      });

      it('should check auto_collection undefined', function() {
        subscriptionFactory.item = {
          customer: {}
        };

        expect(subscriptionFactory.isInvoiced()).to.be.false;
      });
    });

    it('should use subscription value', function() {
      subscriptionFactory.item = {
        subscription: {
          auto_collection: 'off'
        },
        customer: {
          auto_collection: 'on'
        }
      };

      expect(subscriptionFactory.isInvoiced()).to.be.true;
    });

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

    describe('_updatePaymentSourceId:', function() {
      it('should update for invoice', function(done) {
        billing.getSubscription.returns(Q.resolve({
          item: {
            subscription: {
              auto_collection: 'off'
            }
          }
        }));

        subscriptionFactory.getSubscription();

        setTimeout(function() {
          expect(subscriptionFactory.item.paymentSourceId).to.equal('invoice');

          done();
        }, 10);
      });

      it('should update for credit card', function(done) {
        billing.getSubscription.returns(Q.resolve({
          item: {
            subscription: {
              payment_source_id: 'paymentSource'
            }
          }
        }));

        subscriptionFactory.getSubscription();

        setTimeout(function() {
          expect(subscriptionFactory.item.paymentSourceId).to.equal('paymentSource');

          done();
        }, 10);
      });

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

  describe('changePaymentMethod:', function() {
    var $event;

    beforeEach(function() {
      $event = {
        preventDefault: sinon.stub()
      };
    });

    it('should stop event propagation', function() {
      subscriptionFactory.changePaymentMethod($event, {
        payment_source: {
          id: 'paymentId'
        }
      });

      $event.preventDefault.should.have.been.called;
    });

    it('should not update if the same payment method is selected', function() {
      subscriptionFactory.item = {
        subscription: {
          id: 'subscriptionId',
          payment_source_id: 'paymentId'
        }
      };

      subscriptionFactory.changePaymentMethod($event, {
        payment_source: {
          id: 'paymentId'
        }
      });

      confirmModal.should.not.have.been.called;
    });

    it('should prompt for change', function(done) {
      subscriptionFactory.changePaymentMethod($event, {
        payment_source: {
          id: 'paymentId',
          card: {}
        }
      });

      confirmModal.should.have.been.calledWith(
        'Change Payment Method',
        'Are you sure you want to change the payment method? The <strong>Credit Card ending in ****</strong> will be used for this subscription.',
        'Yes, Change', 'Cancel', 'madero-style centered-modal',
        'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
      );

      setTimeout(function() {
        billing.changePaymentSource.should.have.been.called;

        done();
      }, 10);
    });

    it('should not change if user does not confirm', function(done) {
      confirmModal.returns(Q.reject());

      subscriptionFactory.changePaymentMethod($event, {
        payment_source: {}
      });

      setTimeout(function() {
        billing.changePaymentSource.should.not.have.been.called;

        done();
      }, 10);
    });

    describe('_changePaymentSource:', function() {
      beforeEach(function() {
        sinon.stub(subscriptionFactory, 'init');
      });

      it('should merge result into item on success', function(done) {
        subscriptionFactory.item = {
          subscription: {
            id: 'subscriptionId'
          }
        }
        subscriptionFactory.changePaymentMethod($event, {
          payment_source: {
            id: 'paymentId'
          }
        });

        setTimeout(function() {
          expect(subscriptionFactory.loading).to.be.false;

          billing.changePaymentSource.should.have.been.calledWith('subscriptionId', 'paymentId');

          expect(subscriptionFactory.item).to.deep.equal({
            subscription: {
              id: 'subscriptionId'
            },
            payment_source: 'paymentSource',
            paymentSourceId: null
          });

          done();
        }, 10);
      });

      it('should stop spinner on failure', function(done) {
        billing.changePaymentSource.returns(Q.reject('error'));

        subscriptionFactory.changePaymentMethod($event, {
          payment_source: {
            id: 'paymentId'
          }
        });

        setTimeout(function() {
          expect(subscriptionFactory.loading).to.be.false;
          expect(subscriptionFactory.apiError).to.equal('processed error');

          done();
        }, 10);
      });
    });

  });

});
