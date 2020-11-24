'use strict';
describe('service: billingFactory:', function() {
  var billingFactory, $window, billing;

  beforeEach(module('risevision.apps.billing.services'));
  beforeEach(module(function ($provide) {
    $provide.service('billing',function() {
      return {
        getInvoice: sinon.stub().returns(Q.resolve({item: 'invoice'})),
        getInvoicePdf: sinon.stub().returns(Q.resolve({result: 'invoicePdf'}))
      };
    });
    $provide.service('processErrorCode',function() {
      return function(err) {
        return 'processed ' + err;
      };
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
      billing = $injector.get('billing');
      billingFactory = $injector.get('billingFactory');

    });
  });

  it('should exist',function() {
    expect(billingFactory).to.be.ok;
    expect(billingFactory.getInvoice).to.be.a.function;
    expect(billingFactory.downloadInvoice).to.be.a.function;
  });

  describe('getInvoice:', function() {
    it('should get invoice, show spinner and reset errors', function() {
      billingFactory.apiError = 'someError';
      billingFactory.invoice = 'someInvoice';

      billingFactory.getInvoice('invoiceId');

      billing.getInvoice.should.have.been.calledWith('invoiceId');

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

  describe('downloadInvoice:', function() {
    it('should download pdf, show spinner and reset errors', function() {
      billingFactory.apiError = 'someError';

      billingFactory.downloadInvoice('invoiceId');

      billing.getInvoicePdf.should.have.been.calledWith('invoiceId');

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
