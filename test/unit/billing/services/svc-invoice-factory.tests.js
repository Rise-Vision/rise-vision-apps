'use strict';
describe('service: invoiceFactory:', function() {
  var invoiceFactory, $window, $stateParams, userState, billing, storeService, creditCardFactory, analyticsFactory;

  beforeEach(module('risevision.apps.billing.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function() {
      return {
        getSelectedCompanyId : function() {
          return 'testId1';
        },
        getUsername: sinon.stub().returns('user@test.com'),
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
    $provide.service('analyticsFactory',function() {
      return {
        track: sinon.stub()
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
      invoiceFactory = $injector.get('invoiceFactory');
      analyticsFactory = $injector.get('analyticsFactory');

      invoiceFactory.invoice = {
        id: 'invoiceId',
        currency_code: 'CAD',
        amount_due: 1100,
        customer_id: 'companyId'
      }
    });
  });

  it('should exist',function() {
    expect(invoiceFactory).to.be.ok;

    expect(invoiceFactory.init).to.be.a('function');
    expect(invoiceFactory.getToken).to.be.a('function');
    expect(invoiceFactory.getInvoice).to.be.a('function');
    expect(invoiceFactory.updateInvoice).to.be.a('function');
    expect(invoiceFactory.payInvoice).to.be.a('function');
    expect(invoiceFactory.downloadInvoice).to.be.a('function');
  });

  describe('init:', function() {
    it('should init payment methods and load credit cards', function() {
      invoiceFactory.loading = true;
      invoiceFactory.apiError = 'error';

      invoiceFactory.init(true);

      expect(invoiceFactory.loading).to.be.false;
      expect(invoiceFactory.apiError).to.not.be.ok;

      creditCardFactory.initPaymentMethods.should.have.been.called;
    });

    it('should not init payment methods and load credit cards', function() {
      invoiceFactory.loading = true;
      invoiceFactory.apiError = 'error';

      invoiceFactory.init(false);

      expect(invoiceFactory.loading).to.be.false;
      expect(invoiceFactory.apiError).to.not.be.ok;

      creditCardFactory.initPaymentMethods.should.not.have.been.called;
    });
  });

  describe('getToken:', function() {
    it('should return from $stateParams', function() {
      $stateParams.token = 'token';

      expect(invoiceFactory.getToken()).to.equal('token');
    });

    it('should return last 6 digits', function() {
      expect(invoiceFactory.getToken()).to.equal('uthKey');
    });

    it('should not fail if token is shorter', function() {
      userState.getCopyOfSelectedCompany.returns({
        authKey: 'key'
      });

      expect(invoiceFactory.getToken()).to.equal('key');
    });

    it('should not fail if token is missing', function() {
      userState.getCopyOfSelectedCompany.returns({});

      expect(invoiceFactory.getToken()).to.be.null;
    });

  });

  describe('getInvoice:', function() {
    it('should get invoice, show spinner and reset errors', function() {
      invoiceFactory.apiError = 'someError';
      invoiceFactory.invoice = 'someInvoice';

      invoiceFactory.getInvoice('invoiceId', 'companyId', 'token');

      billing.getInvoice.should.have.been.calledWith('invoiceId', 'companyId', 'token');

      expect(invoiceFactory.apiError).to.not.be.ok;
      expect(invoiceFactory.invoice).to.not.be.ok;
      expect(invoiceFactory.loading).to.be.true;
    });

    it('should retrieve invoice', function(done) {
      invoiceFactory.getInvoice();

      setTimeout(function() {
        expect(invoiceFactory.loading).to.be.false;

        expect(invoiceFactory.invoice).to.equal('invoice');

        done();
      }, 10);
    });

    it('should handle failure to get invoice correctly', function(done) {
      billing.getInvoice.returns(Q.reject('error'));

      invoiceFactory.getInvoice()

      setTimeout(function() {
        expect(invoiceFactory.loading).to.be.false;
        expect(invoiceFactory.invoice).to.not.be.ok;

        expect(invoiceFactory.apiError).to.equal('processed error');

        done();
      });
    });
  });

  describe('updateInvoice:', function() {
    it('should update invoice, show spinner and reset errors', function() {
      invoiceFactory.apiError = 'someError';
      invoiceFactory.invoice = 'someInvoice';

      invoiceFactory.updateInvoice();

      billing.updateInvoice.should.have.been.calledWith('someInvoice', 'testId1', 'uthKey');

      expect(invoiceFactory.apiError).to.not.be.ok;
      expect(invoiceFactory.loading).to.be.true;
    });

    it('should update invoice', function(done) {
      invoiceFactory.updateInvoice();

      setTimeout(function() {
        expect(invoiceFactory.loading).to.be.false;

        expect(invoiceFactory.invoice).to.equal('invoice');

        done();
      }, 10);
    });

    it('should handle failure to update invoice correctly', function(done) {
      billing.updateInvoice.returns(Q.reject('error'));
      invoiceFactory.invoice = 'someInvoice';

      invoiceFactory.updateInvoice();

      setTimeout(function() {
        expect(invoiceFactory.loading).to.be.false;
        expect(invoiceFactory.invoice).to.equal('someInvoice');

        expect(invoiceFactory.apiError).to.equal('processed error');

        done();
      });
    });
  });

  describe('payInvoice:', function() {
    it('should show spinner and reset errors', function() {
      invoiceFactory.apiError = 'someError';

      invoiceFactory.payInvoice();

      expect(invoiceFactory.apiError).to.not.be.ok;
      expect(invoiceFactory.loading).to.be.true;
    });

    it('should pay invoice', function(done) {
      invoiceFactory.payInvoice();

      creditCardFactory.validatePaymentMethod.should.have.been.called;

      setTimeout(function() {
        storeService.preparePayment.should.have.been.called;
        storeService.collectPayment.should.have.been.called;

        expect(invoiceFactory.loading).to.be.false;

        expect(invoiceFactory.invoice.status).to.equal('paid');

        analyticsFactory.track.should.have.been.calledWith('Invoice Paid', {
          invoiceId: 'invoiceId',
          currency: 'CAD',
          amount: 11,
          userId: 'user@test.com',
          companyId: 'companyId'
        });

        done();
      }, 10);
    });

    describe('validatePaymentMethod:', function() {
      it('should handle failure to get validate payment method', function(done) {
        creditCardFactory.validatePaymentMethod.returns(Q.reject('error'));

        invoiceFactory.payInvoice();

        setTimeout(function() {
          storeService.preparePayment.should.not.have.been.called;
          storeService.collectPayment.should.not.have.been.called;

          expect(invoiceFactory.apiError).to.equal('processed error');

          expect(invoiceFactory.invoice.status).to.not.be.ok;

          analyticsFactory.track.should.not.have.been.called;

          done();
        }, 10);
      });
    });

    describe('_preparePaymentIntent:', function() {
      it('should get payment intent', function(done) {
        invoiceFactory.payInvoice();

        setTimeout(function() {
          creditCardFactory.getPaymentMethodId.should.have.been.called;

          storeService.preparePayment.should.have.been.calledWith('paymentMethodId', 'invoiceId', 'testId1', 'uthKey');
          expect(creditCardFactory.paymentMethods.intentResponse).to.deep.equal({item: 'intentResponse'});

          done();
        }, 10);
      });

      it('should handle intent errors', function(done) {
        storeService.preparePayment.returns(Q.resolve({error: 'error'}));

        invoiceFactory.payInvoice();

        setTimeout(function() {
          expect(creditCardFactory.paymentMethods.intentResponse).to.not.be.ok;

          storeService.collectPayment.should.not.have.been.called;

          expect(invoiceFactory.apiError).to.equal('processed error');

          expect(invoiceFactory.invoice.status).to.not.be.ok;

          done();
        }, 10);
      });

      it('should handle failure to get intent', function(done) {
        storeService.preparePayment.returns(Q.reject('error'));

        invoiceFactory.payInvoice();

        setTimeout(function() {
          expect(creditCardFactory.paymentMethods.intentResponse).to.not.be.ok;

          storeService.collectPayment.should.not.have.been.called;

          expect(invoiceFactory.apiError).to.equal('processed error');

          expect(invoiceFactory.invoice.status).to.not.be.ok;

          done();
        }, 10);
      });

      describe('authenticate3ds:', function() {
        it('should not authenticate if its not needed', function(done) {
          invoiceFactory.payInvoice();

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

          invoiceFactory.payInvoice();

          setTimeout(function() {
            creditCardFactory.authenticate3ds.should.have.been.calledWith('intentSecret');

            expect(invoiceFactory.invoice.status).to.equal('paid');

            done();
          }, 10);
        });

        it('should handle failure authenticate', function(done) {
          storeService.preparePayment.returns(Q.resolve({
            authenticationRequired: true,
            intentSecret: 'intentSecret'
          }));
          creditCardFactory.authenticate3ds.returns(Q.reject('error'));

          invoiceFactory.payInvoice();

          setTimeout(function() {
            storeService.collectPayment.should.not.have.been.called;

            expect(invoiceFactory.apiError).to.equal('processed error');

            expect(invoiceFactory.invoice.status).to.not.be.ok;

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
        invoiceFactory.invoice.amount_paid = 0;
        invoiceFactory.invoice.total = 50;
        invoiceFactory.invoice.amount_due = 50;

        invoiceFactory.payInvoice();

        setTimeout(function() {
          storeService.collectPayment.should.have.been.calledWith('intentId', 'invoiceId', 'testId1', 'uthKey');

          expect(invoiceFactory.invoice.status).to.equal('paid');
          expect(invoiceFactory.invoice.amount_paid).to.equal(50);
          expect(invoiceFactory.invoice.amount_due).to.equal(0);

          done();
        }, 10);
      });

      it('should handle failure complete payment', function(done) {
        storeService.collectPayment.returns(Q.reject('error'));

        invoiceFactory.payInvoice();

        setTimeout(function() {
          expect(invoiceFactory.apiError).to.equal('processed error');

          expect(invoiceFactory.invoice.status).to.not.be.ok;

          done();
        }, 10);
      });
    });

  });

  describe('downloadInvoice:', function() {
    it('should download pdf, show spinner and reset errors', function() {
      invoiceFactory.apiError = 'someError';

      invoiceFactory.downloadInvoice('invoiceId');

      billing.getInvoicePdf.should.have.been.calledWith('invoiceId', 'testId1', 'uthKey');

      expect(invoiceFactory.apiError).to.not.be.ok;
      expect(invoiceFactory.loading).to.be.true;
    });

    it('should retrieve pdf and trigger download', function(done) {
      invoiceFactory.downloadInvoice();

      setTimeout(function() {
        expect(invoiceFactory.loading).to.be.false;

        expect($window.location.href).to.equal('invoicePdf');

        done();
      }, 10);
    });

    it('should not trigger download if result is not received', function(done) {
      billing.getInvoicePdf.returns(Q.resolve());

      invoiceFactory.downloadInvoice();

      setTimeout(function() {
        expect(invoiceFactory.loading).to.be.false;

        expect($window.location.href).to.not.be.ok;

        done();
      }, 10);
    });

    it('should handle failure to get url correctly', function(done) {
      billing.getInvoicePdf.returns(Q.reject('error'));

      invoiceFactory.downloadInvoice({})

      setTimeout(function() {
        expect(invoiceFactory.loading).to.be.false;
        expect($window.location.href).to.not.be.ok;

        expect(invoiceFactory.apiError).to.equal('processed error');

        done();
      });
    });
  });

});
