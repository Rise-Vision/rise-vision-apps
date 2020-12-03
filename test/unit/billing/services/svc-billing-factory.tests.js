'use strict';
describe('service: billingFactory:', function() {
  var billingFactory, $window, $stateParams, userState, billing, storeService, creditCardFactory;

  beforeEach(module('risevision.apps.billing.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function() {
      return {
        getSelectedCompanyId : function() {
          return 'testId1';
        },
        getCopyOfSelectedCompany: sinon.stub().returns({
          authKey: 'longAuthKey'
        })
      };
    });
    $provide.service('billing',function() {
      return {
        getInvoice: sinon.stub().returns(Q.resolve({item: 'invoice'})),
        updateInvoice: sinon.stub().returns(Q.resolve({item: 'invoice'})),
        getInvoicePdf: sinon.stub().returns(Q.resolve({result: 'invoicePdf'}))
      };
    });
    $provide.service('storeService',function() {
      return {
        preparePayment: sinon.stub().returns(Q.resolve({item: 'intentResponse'})),
        collectPayment: sinon.stub().returns(Q.resolve({result: 'invoicePdf'}))
      };
    });
    $provide.service('creditCardFactory',function() {
      return {
        initPaymentMethods: sinon.stub(),
        loadCreditCards: sinon.stub(),
        getPaymentMethodId: sinon.stub().returns('paymentMethodId'),
        validatePaymentMethod: sinon.stub().returns(Q.resolve()),
        authenticate3ds: sinon.stub().returns(Q.resolve({item: 'invoice'})),
        paymentMethods: {}
      };
    });
    $provide.service('processErrorCode',function() {
      return function(err) {
        return 'processed ' + err;
      };
    });
    $provide.value('$stateParams', {
      
    });
    $provide.service('$window',function() {
      return {
        location: {}
      };
    });

  }));

  beforeEach(function() {
    inject(function($injector){
      $window = $injector.get('$window');
      $stateParams = $injector.get('$stateParams');
      userState = $injector.get('userState');
      billing = $injector.get('billing');
      storeService = $injector.get('storeService');
      creditCardFactory = $injector.get('creditCardFactory');
      billingFactory = $injector.get('billingFactory');

      billingFactory.invoice = {
        id: 'invoiceId'
      }
    });
  });

  it('should exist',function() {
    expect(billingFactory).to.be.ok;

    expect(billingFactory.init).to.be.a('function');
    expect(billingFactory.getToken).to.be.a('function');
    expect(billingFactory.getInvoice).to.be.a('function');
    expect(billingFactory.updateInvoice).to.be.a('function');
    expect(billingFactory.payInvoice).to.be.a('function');
    expect(billingFactory.downloadInvoice).to.be.a('function');
  });

  it('init:', function() {
    billingFactory.loading = true;
    billingFactory.apiError = 'error';

    billingFactory.init();

    expect(billingFactory.loading).to.be.false;
    expect(billingFactory.apiError).to.not.be.ok;

    creditCardFactory.initPaymentMethods.should.have.been.called;
    creditCardFactory.loadCreditCards.should.have.been.called;
  });

  describe('getToken:', function() {
    it('should return from $stateParams', function() {
      $stateParams.token = 'token';

      expect(billingFactory.getToken()).to.equal('token');
    });

    it('should return last 6 digits', function() {
      expect(billingFactory.getToken()).to.equal('uthKey');
    });

    it('should not fail if token is shorter', function() {
      userState.getCopyOfSelectedCompany.returns({
        authKey: 'key'
      });

      expect(billingFactory.getToken()).to.equal('key');
    });

    it('should not fail if token is missing', function() {
      userState.getCopyOfSelectedCompany.returns({});

      expect(billingFactory.getToken()).to.be.null;
    });

  });

  describe('getInvoice:', function() {
    it('should get invoice, show spinner and reset errors', function() {
      billingFactory.apiError = 'someError';
      billingFactory.invoice = 'someInvoice';

      billingFactory.getInvoice('invoiceId', 'companyId', 'token');

      billing.getInvoice.should.have.been.calledWith('invoiceId', 'companyId', 'token');

      expect(billingFactory.apiError).to.not.be.ok;
      expect(billingFactory.invoice).to.not.be.ok;
      expect(billingFactory.loading).to.be.true;
    });

    it('should retrieve invoice', function(done) {
      billingFactory.getInvoice();

      setTimeout(function() {
        expect(billingFactory.loading).to.be.false;

        expect(billingFactory.invoice).to.equal('invoice');

        done();
      }, 10);
    });

    it('should handle failure to get invoice correctly', function(done) {
      billing.getInvoice.returns(Q.reject('error'));

      billingFactory.getInvoice()

      setTimeout(function() {
        expect(billingFactory.loading).to.be.false;
        expect(billingFactory.invoice).to.not.be.ok;

        expect(billingFactory.apiError).to.equal('processed error');

        done();
      });
    });
  });

  describe('updateInvoice:', function() {
    it('should update invoice, show spinner and reset errors', function() {
      billingFactory.apiError = 'someError';
      billingFactory.invoice = 'someInvoice';

      billingFactory.updateInvoice();

      billing.updateInvoice.should.have.been.calledWith('someInvoice', 'testId1', 'uthKey');

      expect(billingFactory.apiError).to.not.be.ok;
      expect(billingFactory.loading).to.be.true;
    });

    it('should update invoice', function(done) {
      billingFactory.updateInvoice();

      setTimeout(function() {
        expect(billingFactory.loading).to.be.false;

        expect(billingFactory.invoice).to.equal('invoice');

        done();
      }, 10);
    });

    it('should handle failure to update invoice correctly', function(done) {
      billing.updateInvoice.returns(Q.reject('error'));
      billingFactory.invoice = 'someInvoice';

      billingFactory.updateInvoice();

      setTimeout(function() {
        expect(billingFactory.loading).to.be.false;
        expect(billingFactory.invoice).to.equal('someInvoice');

        expect(billingFactory.apiError).to.equal('processed error');

        done();
      });
    });
  });

  describe('payInvoice:', function() {
    it('should show spinner and reset errors', function() {
      billingFactory.apiError = 'someError';

      billingFactory.payInvoice();

      expect(billingFactory.apiError).to.not.be.ok;
      expect(billingFactory.loading).to.be.true;
    });

    it('should pay invoice', function(done) {
      billingFactory.payInvoice();

      creditCardFactory.validatePaymentMethod.should.have.been.called;

      setTimeout(function() {
        storeService.preparePayment.should.have.been.called;
        storeService.collectPayment.should.have.been.called;

        expect(billingFactory.loading).to.be.false;

        expect(billingFactory.invoice.status).to.equal('paid');

        done();
      }, 10);
    });
    
    describe('validatePaymentMethod:', function() {
      it('should handle failure to get validate payment method', function(done) {
        creditCardFactory.validatePaymentMethod.returns(Q.reject('error'));

        billingFactory.payInvoice();

        setTimeout(function() {
          storeService.preparePayment.should.not.have.been.called;
          storeService.collectPayment.should.not.have.been.called;

          expect(billingFactory.apiError).to.equal('processed error');

          expect(billingFactory.invoice.status).to.not.be.ok;

          done();
        }, 10);
      });
    });

    describe('_preparePaymentIntent:', function() {
      it('should get payment intent', function(done) {
        billingFactory.payInvoice();

        setTimeout(function() {
          creditCardFactory.getPaymentMethodId.should.have.been.called;

          storeService.preparePayment.should.have.been.calledWith('paymentMethodId', 'invoiceId', 'testId1', 'uthKey');
          expect(creditCardFactory.paymentMethods.intentResponse).to.deep.equal({item: 'intentResponse'});

          done();
        }, 10);
      });

      it('should handle intent errors', function(done) {
        storeService.preparePayment.returns(Q.resolve({error: 'error'}));

        billingFactory.payInvoice();

        setTimeout(function() {
          expect(creditCardFactory.paymentMethods.intentResponse).to.not.be.ok;

          storeService.collectPayment.should.not.have.been.called;

          expect(billingFactory.apiError).to.equal('processed error');

          expect(billingFactory.invoice.status).to.not.be.ok;

          done();
        }, 10);
      });

      it('should handle failure to get intent', function(done) {
        storeService.preparePayment.returns(Q.reject('error'));

        billingFactory.payInvoice();

        setTimeout(function() {
          expect(creditCardFactory.paymentMethods.intentResponse).to.not.be.ok;

          storeService.collectPayment.should.not.have.been.called;

          expect(billingFactory.apiError).to.equal('processed error');

          expect(billingFactory.invoice.status).to.not.be.ok;

          done();
        }, 10);
      });

      describe('authenticate3ds:', function() {
        it('should not authenticate if its not needed', function(done) {
          billingFactory.payInvoice();

          setTimeout(function() {
            creditCardFactory.authenticate3ds.should.not.have.been.called;

            done();
          }, 10);
        });

        it('should authenticate if its required', function(done) {
          storeService.preparePayment.returns(Q.resolve({
            authenticationRequired: true,
            intentSecret: 'intentSecret'
          }));

          billingFactory.payInvoice();

          setTimeout(function() {
            creditCardFactory.authenticate3ds.should.have.been.calledWith('intentSecret');

            expect(billingFactory.invoice.status).to.equal('paid');

            done();
          }, 10);
        });

        it('should handle failure authenticate', function(done) {
          storeService.preparePayment.returns(Q.resolve({
            authenticationRequired: true,
            intentSecret: 'intentSecret'
          }));
          creditCardFactory.authenticate3ds.returns(Q.reject('error'));

          billingFactory.payInvoice();

          setTimeout(function() {
            storeService.collectPayment.should.not.have.been.called;

            expect(billingFactory.apiError).to.equal('processed error');

            expect(billingFactory.invoice.status).to.not.be.ok;

            done();
          }, 10);
        });
      });

    });
    
    describe('_completePayment:', function() {
      it('should complete payment and update totals', function(done) {
        storeService.preparePayment.returns(Q.resolve({
          intentId: 'intentId'
        }));
        billingFactory.invoice.amount_paid = 0;
        billingFactory.invoice.total = 50;
        billingFactory.invoice.amount_due = 50;

        billingFactory.payInvoice();

        setTimeout(function() {
          storeService.collectPayment.should.have.been.calledWith('intentId', 'invoiceId', 'testId1', 'uthKey');

          expect(billingFactory.invoice.status).to.equal('paid');
          expect(billingFactory.invoice.amount_paid).to.equal(50);
          expect(billingFactory.invoice.amount_due).to.equal(0);

          done();
        }, 10);
      });

      it('should handle failure complete payment', function(done) {
        storeService.collectPayment.returns(Q.reject('error'));

        billingFactory.payInvoice();

        setTimeout(function() {
          expect(billingFactory.apiError).to.equal('processed error');

          expect(billingFactory.invoice.status).to.not.be.ok;

          done();
        }, 10);
      });
    });

  });

  describe('downloadInvoice:', function() {
    it('should download pdf, show spinner and reset errors', function() {
      billingFactory.apiError = 'someError';

      billingFactory.downloadInvoice('invoiceId');

      billing.getInvoicePdf.should.have.been.calledWith('invoiceId', 'testId1', 'uthKey');

      expect(billingFactory.apiError).to.not.be.ok;
      expect(billingFactory.loading).to.be.true;
    });

    it('should retrieve pdf and trigger download', function(done) {
      billingFactory.downloadInvoice();

      setTimeout(function() {
        expect(billingFactory.loading).to.be.false;

        expect($window.location.href).to.equal('invoicePdf');

        done();
      }, 10);
    });

    it('should not trigger download if result is not received', function(done) {
      billing.getInvoicePdf.returns(Q.resolve());

      billingFactory.downloadInvoice();

      setTimeout(function() {
        expect(billingFactory.loading).to.be.false;

        expect($window.location.href).to.not.be.ok;

        done();
      }, 10);
    });

    it('should handle failure to get url correctly', function(done) {
      billing.getInvoicePdf.returns(Q.reject('error'));

      billingFactory.downloadInvoice({})

      setTimeout(function() {
        expect(billingFactory.loading).to.be.false;
        expect($window.location.href).to.not.be.ok;

        expect(billingFactory.apiError).to.equal('processed error');

        done();
      });
    });
  });

});
