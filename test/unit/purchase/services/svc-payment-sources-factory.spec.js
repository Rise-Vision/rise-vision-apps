/*jshint expr:true */
"use strict";

describe("Services: payment sources factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    $provide.service('processErrorCode',function() {
      return function(err) {
        return 'processed ' + err;
      };
    });

    $provide.value('billing', {
      getCreditCards: sinon.stub().returns(Q.resolve({
        items: []
      })),
      deletePaymentSource: sinon.stub().returns(Q.resolve({}))
    });
    $provide.factory('confirmModal', function() {
      return sinon.stub().returns(Q.resolve());
    });
  }));

  var paymentSourcesFactory, confirmModal, billing;

  beforeEach(function() {
    inject(function($injector) {
      confirmModal = $injector.get('confirmModal');
      billing = $injector.get('billing');
      paymentSourcesFactory = $injector.get("paymentSourcesFactory");
    });
  });

  it("should exist", function() {
    expect(paymentSourcesFactory).to.be.ok;

    expect(paymentSourcesFactory.init).to.be.a("function");
    expect(paymentSourcesFactory.removePaymentMethod).to.be.a("function");
  });

  describe("init:", function() {
    it("should init factory object", function() {
      paymentSourcesFactory.existingCreditCards = 'existingCreditCards';
      paymentSourcesFactory.selectedCard = 'selectedCard'

      paymentSourcesFactory.init();
      
      expect(paymentSourcesFactory).to.be.ok;
      expect(paymentSourcesFactory.existingCreditCards).to.deep.equal([]);

      expect(paymentSourcesFactory.selectedCard).to.not.be.ok;
    });

    describe('_loadCreditCards:', function() {
      it('should retrieve cards and update list if successful', function(done) {
        paymentSourcesFactory.init()
          .then(function() {
            billing.getCreditCards.should.have.been.calledWith({
              count: 40
            });

            expect(paymentSourcesFactory.existingCreditCards).to.be.an('array');

            done();
          });
      });

      it('should set selected card to the first item if available', function(done) {
        billing.getCreditCards.returns(Q.resolve({items: ['card1']}))

        paymentSourcesFactory.init()
          .then(function() {
            expect(paymentSourcesFactory.selectedCard).to.equal('card1');

            done();
          });
      });
    });

  });

  describe('removePaymentMethod:', function() {
    it('should prompt for removal', function(done) {
      paymentSourcesFactory.removePaymentMethod({
        payment_source: {
          card: {}
        }
      });

      confirmModal.should.have.been.calledWith(
        'Remove Payment Method',
        'Are you sure you want to remove this payment method? The <strong>Credit Card ending in ****</strong> will be removed from your company.',
        'Yes, Remove', 'Cancel', 'madero-style centered-modal',
        'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
      );

      setTimeout(function() {
        billing.deletePaymentSource.should.have.been.called;

        done();
      }, 10);
    });

    it('should not delete if user does not confirm', function(done) {
      confirmModal.returns(Q.reject());

      paymentSourcesFactory.removePaymentMethod({
        payment_source: {}
      });

      setTimeout(function() {
        billing.deletePaymentSource.should.not.have.been.called;

        done();
      }, 10);
    });

    describe('_deletePaymentSource:', function() {
      beforeEach(function() {
        sinon.stub(paymentSourcesFactory, 'init');        
      });

      it('should start spinner and reload list on success', function(done) {
        paymentSourcesFactory.removePaymentMethod({
          payment_source: {
            id: 'paymentId'
          }
        });

        setTimeout(function() {
          expect(paymentSourcesFactory.loading).to.be.true;

          billing.deletePaymentSource.should.have.been.calledWith('paymentId');

          paymentSourcesFactory.init.should.have.been.called;

          done();
        }, 10);
      });

      it('should stop spinner and not reload list on failure', function(done) {
        billing.deletePaymentSource.returns(Q.reject('error'));

        paymentSourcesFactory.removePaymentMethod({
          payment_source: {}
        });

        setTimeout(function() {
          expect(paymentSourcesFactory.loading).to.be.false;
          expect(paymentSourcesFactory.apiError).to.equal('processed error');

          paymentSourcesFactory.init.should.not.have.been.called;

          done();
        }, 10);
      });
    });

  });


});
