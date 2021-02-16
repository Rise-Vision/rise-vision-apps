'use strict';

describe('service: addPaymentSourceFactory:', function() {
  var addPaymentSourceFactory, billing, userState, creditCardFactory;

  beforeEach(module('risevision.apps.billing.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('billing',function() {
      return {
        changePaymentToInvoice: sinon.stub().returns(Q.resolve({item: 'subscription'})),
        preparePaymentSource: sinon.stub().returns(Q.resolve('intentResponse')),
        addPaymentSource: sinon.stub().returns(Q.resolve({item: {payment_source: {id: 'paymentSourceId'}}})),
        changePaymentSource: sinon.stub().returns(Q.resolve({}))
      }
    });
    $provide.factory('addressService', function() {
      return {
        copyAddress: sinon.stub().returns('copiedAddress')
      };
    });
    $provide.service("userState", function() {
      return {
        getCopyOfSelectedCompany: sinon.stub().returns({
          id: "id",
          street: "billingStreet",
        }),
      };
    });
    $provide.value("creditCardFactory", {
      initPaymentMethods: sinon.stub().returns(Q.resolve()),
      validatePaymentMethod: sinon.stub().returns(Q.resolve({})),
      confirmCardSetup: sinon.stub().returns(Q.resolve()),
      paymentMethods: {
        newCreditCard: {}
      },
      getPaymentMethodId: sinon.stub().returns('paymentMethodId'),
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
      addPaymentSourceFactory = $injector.get('addPaymentSourceFactory');
      userState = $injector.get('userState');
      creditCardFactory = $injector.get('creditCardFactory');
    });
  });

  it('should exist',function() {
    expect(addPaymentSourceFactory).to.be.ok;

    expect(addPaymentSourceFactory.init).to.be.a('function');
    expect(addPaymentSourceFactory.changePaymentToInvoice).to.be.a('function');
    expect(addPaymentSourceFactory.changePaymentSource).to.be.a('function');
  });

  describe("init: ", function() {
    it('should reset spinner and errors', function() {
      addPaymentSourceFactory.apiError = 'someError';
      addPaymentSourceFactory.invoice = 'someInvoice';

      addPaymentSourceFactory.init();

      expect(addPaymentSourceFactory.apiError).to.not.be.ok;
      expect(addPaymentSourceFactory.loading).to.be.false;
    });

    it("should initialize payment methods", function(done) {
      addPaymentSourceFactory.init();
      
      creditCardFactory.initPaymentMethods.should.have.been.calledWith(false);

      setTimeout(function() {
        expect(creditCardFactory.paymentMethods).to.be.ok;
        expect(creditCardFactory.paymentMethods.paymentMethod).to.equal("card");
        
        expect(creditCardFactory.paymentMethods.newCreditCard.billingAddress).to.equal('copiedAddress');

        done();
      }, 10);
    });
  });

  describe('changePaymentToInvoice:', function() {
    it('should call api, show spinner and reset errors', function() {
      addPaymentSourceFactory.apiError = 'someError';

      addPaymentSourceFactory.changePaymentToInvoice('subscriptionId', 'poNumber');

      billing.changePaymentToInvoice.should.have.been.calledWith('subscriptionId', 'poNumber');

      expect(addPaymentSourceFactory.apiError).to.not.be.ok;
      expect(addPaymentSourceFactory.loading).to.be.true;
    });

    it('should change payment to invoice, and resolve', function(done) {
      addPaymentSourceFactory.changePaymentToInvoice()
        .then(function() {
          expect(addPaymentSourceFactory.loading).to.be.false;

          done();
        });
    });

    it('should handle failure to change payment to invoice', function(done) {
      billing.changePaymentToInvoice.returns(Q.reject('error'));

      addPaymentSourceFactory.changePaymentToInvoice()
        .catch(function() {
          expect(addPaymentSourceFactory.loading).to.be.false;

          expect(addPaymentSourceFactory.apiError).to.equal('processed error');

          done();
        });
    });
  });

  describe('changePaymentSource:', function() {
    it('should call api, show spinner and reset errors', function() {
      addPaymentSourceFactory.apiError = 'someError';

      addPaymentSourceFactory.changePaymentSource('subscriptionId');

      creditCardFactory.validatePaymentMethod.should.have.been.called;

      expect(addPaymentSourceFactory.apiError).to.not.be.ok;
      expect(addPaymentSourceFactory.loading).to.be.true;
    });

    it('should change payment source, and resolve', function(done) {
      addPaymentSourceFactory.changePaymentSource()
        .then(function() {
          expect(addPaymentSourceFactory.loading).to.be.false;

          done();
        });
    });

    describe('validatePaymentMethod:', function() {
      it('should handle failure to validate payment method', function(done) {
        creditCardFactory.validatePaymentMethod.returns(Q.reject('error'));

        addPaymentSourceFactory.changePaymentSource()
          .catch(function() {
            expect(addPaymentSourceFactory.loading).to.be.false;
            expect(addPaymentSourceFactory.apiError).to.equal('processed error');

            billing.preparePaymentSource.should.not.have.been.called;

            done();
          });
      });
    });

    describe('_preparePaymentSource:', function() {
      it('should prepare payment source, and update intent response', function(done) {
        addPaymentSourceFactory.changePaymentSource()
          .then(function() {
            billing.preparePaymentSource.should.have.been.calledWith('paymentMethodId');
            creditCardFactory.confirmCardSetup.should.not.have.been.called;

            expect(creditCardFactory.paymentMethods.intentResponse).to.equal('intentResponse');

            done();
          });
      });

      it('should handle failure to prepare payment source', function(done) {
        billing.preparePaymentSource.returns(Q.reject('error'));

        addPaymentSourceFactory.changePaymentSource()
          .catch(function() {
            expect(addPaymentSourceFactory.loading).to.be.false;
            expect(addPaymentSourceFactory.apiError).to.equal('processed error');

            billing.addPaymentSource.should.not.have.been.called;

            done();
          });
      });

      describe('confirmCardSetup:', function() {
        it('should confirmCardSetup if authentication is required', function(done) {
          billing.preparePaymentSource.returns(Q.resolve({
            authenticationRequired: true,
            intentSecret: 'intentSecret'
          }));

          addPaymentSourceFactory.changePaymentSource()
            .then(function() {
              creditCardFactory.confirmCardSetup.should.have.been.calledWith('intentSecret');

              done();
            });
        });

        it('should handle failure to confirmCardSetup', function(done) {
          billing.preparePaymentSource.returns(Q.resolve({
            authenticationRequired: true,
            intentSecret: 'intentSecret'
          }));
          creditCardFactory.confirmCardSetup.returns(Q.reject('error'));

          addPaymentSourceFactory.changePaymentSource()
            .catch(function() {
              expect(addPaymentSourceFactory.loading).to.be.false;
              expect(addPaymentSourceFactory.apiError).to.equal('processed error');

              billing.addPaymentSource.should.not.have.been.called;

              done();
            });
        });
      });
    });

    describe('_addPaymentSource:', function() {
      it('should add payment source, and return the id', function(done) {
        billing.preparePaymentSource.returns(Q.resolve({
          intentId: 'intentId'
        }));

        addPaymentSourceFactory.changePaymentSource()
          .then(function() {
            billing.addPaymentSource.should.have.been.calledWith('intentId');

            done();
          });
      });

      it('should handle failure to add payment source', function(done) {
        billing.preparePaymentSource.returns(Q.reject('error'));

        addPaymentSourceFactory.changePaymentSource()
          .catch(function() {
            expect(addPaymentSourceFactory.loading).to.be.false;
            expect(addPaymentSourceFactory.apiError).to.equal('processed error');

            done();
          });
      });
    });

    describe('_changePaymentSource:', function() {
      it('should change the payment source, and resolve', function(done) {
        addPaymentSourceFactory.changePaymentSource('subscriptionId')
          .then(function() {
            billing.changePaymentSource.should.have.been.calledWith('subscriptionId', 'paymentSourceId');

            done();
          });
      });

      it('should handle failure to add payment source', function(done) {
        billing.changePaymentSource.returns(Q.reject('error'));

        addPaymentSourceFactory.changePaymentSource()
          .catch(function() {
            expect(addPaymentSourceFactory.loading).to.be.false;
            expect(addPaymentSourceFactory.apiError).to.equal('processed error');

            done();
          });
      });
    });

  });

});
