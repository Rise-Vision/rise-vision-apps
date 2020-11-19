'use strict';
describe('service: billingFactory:', function() {
  var billingFactory, $window, billing;

  beforeEach(module('risevision.apps.billing.services'));
  beforeEach(module(function ($provide) {
    $provide.service('billing',function() {
      return {
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
      var BillingFactory = $injector.get('BillingFactory');

      billingFactory = new BillingFactory();
    });
  });

  it('should exist',function() {
    expect(billingFactory).to.be.ok;
    expect(billingFactory.downloadInvoice).to.be.a.function;
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

    it('should handle failure to get list correctly', function(done) {
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
