'use strict';
describe('service: billing:', function() {
  var billing, storeApi, failedResponse;

  beforeEach(module('risevision.apps.billing.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function() {
      return {
        getSelectedCompanyId : function() {
          return 'testId1';
        }
      };
    });
    $provide.service('storeAPILoader',function () {
      return function() {
        return Q.resolve(storeApi = {
          integrations: {
            subscription: {
              list: sinon.spy(function() {
                if (!failedResponse) {
                  return Q.resolve({
                    result: {
                      nextPageToken: 1,
                      items: [{ subscriptionId: 'subs1', productName: 'productName1' }]
                    }
                  });
                }
                else {
                  return Q.reject('API Failed');
                }
              }),
              get: sinon.spy(function() {
                if (!failedResponse) {
                  return Q.resolve({
                    result: 'subscription'
                  });
                }
                else {
                  return Q.reject('API Failed');
                }
              }),
            },
            invoice: {
              list: function() {
                if (!failedResponse) {
                  return Q.resolve({
                    result: {
                      nextPageToken: 1,
                      items: [{ invoiceId: 'inv1' }]
                    }
                  });
                }
                else {
                  return Q.reject('API Failed');
                }
              },
              listUnpaid: sinon.spy(function() {
                if (!failedResponse) {
                  return Q.resolve({
                    result: {
                      nextPageToken: 1,
                      items: [{ invoiceId: 'inv1' }]
                    }
                  });
                }
                else {
                  return Q.reject('API Failed');
                }
              }),
              get: sinon.spy(function() {
                if (!failedResponse) {
                  return Q.resolve({
                    result: 'invoice'
                  });
                }
                else {
                  return Q.reject('API Failed');
                }
              }),
              put: sinon.spy(function() {
                if (!failedResponse) {
                  return Q.resolve({
                    result: 'invoice'
                  });
                }
                else {
                  return Q.reject('API Failed');
                }
              }),
              getPdf: sinon.spy(function() {
                if (!failedResponse) {
                  return Q.resolve({
                    result: 'invoicePdf'
                  });
                }
                else {
                  return Q.reject('API Failed');
                }
              })
            },
            card: {
              list: sinon.spy(function() {
                if (!failedResponse) {
                  return Q.resolve({
                    result: {
                      nextPageToken: 1,
                      items: [{ card: 'card1' }]
                    }
                  });
                }
                else {
                  return Q.reject('API Failed');
                }
              })
            },
            paymentSource: {
              delete: sinon.spy(function() {
                if (!failedResponse) {
                  return Q.resolve({
                    result: 'deleted'
                  });
                }
                else {
                  return Q.reject('API Failed');
                }
              })              
            }
          }
        });
      };
    });
  }));

  beforeEach(function() {
    inject(function($injector){
      billing = $injector.get('billing');
    });
  });

  it('should exist',function() {
    expect(billing).to.be.ok;
    expect(billing.getSubscriptions).to.be.a.function;
    expect(billing.getSubscription).to.be.a.function;
    expect(billing.getInvoices).to.be.a.function;
    expect(billing.getUnpaidInvoices).to.be.a.function;
    expect(billing.getInvoice).to.be.a.function;
    expect(billing.updateInvoice).to.be.a.function;
    expect(billing.getInvoicePdf).to.be.a.function;
    expect(billing.getCreditCards).to.be.a.function;
    expect(billing.deletePaymentSource).to.be.a.function;
  });

  describe('getSubscriptions:', function() {
    it('should return a list of subscriptions', function(done) {
      failedResponse = false;

      billing.getSubscriptions({
        count: 'count'
      }, 'cursor')
      .then(function(result) {
        storeApi.integrations.subscription.list.should.have.been.called;
        storeApi.integrations.subscription.list.should.have.been.calledWith({
          companyId: 'testId1',
          count: 'count',
          cursor: 'cursor'
        });

        expect(result).to.be.ok;
        expect(result.items).to.be.ok;
        expect(result.items.length).to.equal(1);
        done();
      });
    });

    it('should handle failure to get list correctly', function(done) {
      failedResponse = true;

      billing.getSubscriptions({})
      .then(function(subscriptions) {
        done(subscriptions);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      });
    });
  });

  describe('getSubscription:', function() {
    it('should return an subscription', function(done) {
      failedResponse = false;

      billing.getSubscription('subscriptionId')
      .then(function(result) {
        storeApi.integrations.subscription.get.should.have.been.called;
        storeApi.integrations.subscription.get.should.have.been.calledWith({
          subscriptionId: 'subscriptionId',
          companyId: 'testId1'
        });

        expect(result).to.be.ok;
        expect(result).to.equal('subscription');
        done();
      });
    });

    it('should handle failure to get subscription correctly', function(done) {
      failedResponse = true;

      billing.getSubscription('subscriptionId')
      .then(function(subscription) {
        done(subscription);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      });
    });
  });

  describe('getInvoices:', function() {
    it('should return a list of invoices', function(done) {
      failedResponse = false;

      billing.getInvoices({})
      .then(function(result) {
        expect(result).to.be.ok;
        expect(result.items).to.be.ok;
        expect(result.items.length).to.equal(1);
        done();
      });
    });

    it('should handle failure to get list correctly', function(done) {
      failedResponse = true;

      billing.getInvoices({})
      .then(function(invoices) {
        done(invoices);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      });
    });
  });

  describe('getUnpaidInvoices:', function() {
    it('should return a list of invoices', function(done) {
      failedResponse = false;

      billing.getUnpaidInvoices({
        companyId: 'companyId',
        token: 'token',
        count: 'count'
      }, 'cursor')
      .then(function(result) {
        storeApi.integrations.invoice.listUnpaid.should.have.been.called;
        storeApi.integrations.invoice.listUnpaid.should.have.been.calledWith({
          companyId: 'companyId',
          token: 'token',
          count: 'count',
          cursor: 'cursor'
        });

        expect(result).to.be.ok;
        expect(result.items).to.be.ok;
        expect(result.items.length).to.equal(1);
        done();
      });
    });

    it('should handle failure to get list correctly', function(done) {
      failedResponse = true;

      billing.getUnpaidInvoices({})
      .then(function(invoices) {
        done(invoices);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      });
    });
  });

  describe('getInvoice:', function() {
    it('should return an invoice', function(done) {
      failedResponse = false;

      billing.getInvoice('invoiceId', 'companyId', 'token')
      .then(function(result) {
        storeApi.integrations.invoice.get.should.have.been.called;
        storeApi.integrations.invoice.get.should.have.been.calledWith({
          invoiceId: 'invoiceId',
          companyId: 'companyId',
          token: 'token'
        });

        expect(result).to.be.ok;
        expect(result).to.equal('invoice');
        done();
      });
    });

    it('should handle failure to get invoice correctly', function(done) {
      failedResponse = true;

      billing.getInvoice('invoiceId')
      .then(function(invoices) {
        done(invoices);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      });
    });
  });
  
  describe('updateInvoice:', function() {
    it('should update the invoice return the response', function(done) {
      failedResponse = false;

      billing.updateInvoice({
        id: 'invoiceId',
        poNumber: 'poNumber',
        invalidField: 'invalidValue'
      }, 'companyId', 'token')
      .then(function(result) {
        storeApi.integrations.invoice.put.should.have.been.calledWith({
          invoiceId: 'invoiceId',
          companyId: 'companyId',
          token: 'token',
          data: {
            poNumber: 'poNumber'
          }
        });

        expect(result).to.be.ok;
        expect(result).to.equal('invoice');
        done();
      });
    });

    it('should handle failure to update invoice correctly', function(done) {
      failedResponse = true;

      billing.updateInvoice('invoiceId')
      .then(function(invoices) {
        done(invoices);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      });
    });
  });

  describe('getInvoicePdf:', function() {
    it('should return the invoice pdf', function(done) {
      failedResponse = false;

      billing.getInvoicePdf('invoiceId', 'companyId', 'token')
      .then(function(result) {
        storeApi.integrations.invoice.getPdf.should.have.been.called;
        storeApi.integrations.invoice.getPdf.should.have.been.calledWith({
          invoiceId: 'invoiceId',
          companyId: 'companyId',
          token: 'token'
        });

        expect(result).to.be.ok;
        expect(result).to.equal('invoicePdf');
        done();
      });
    });

    it('should handle failure to get pdf correctly', function(done) {
      failedResponse = true;

      billing.getInvoicePdf('invoiceId')
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      });
    });
  });

  describe('getCreditCards:', function() {
    it('should return a list of credit cards', function(done) {
      failedResponse = false;

      billing.getCreditCards({
        count: 'count'
      }, 'cursor')
      .then(function(result) {
        storeApi.integrations.card.list.should.have.been.called;
        storeApi.integrations.card.list.should.have.been.calledWith({
          companyId: 'testId1',
          count: 'count',
          cursor: 'cursor'
        });

        expect(result).to.be.ok;
        expect(result.items).to.be.ok;
        expect(result.items.length).to.equal(1);
        done();
      });
    });

    it('should handle failure to get list correctly', function(done) {
      failedResponse = true;

      billing.getCreditCards({})
      .then(function(invoices) {
        done(invoices);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      });
    });
  });

  describe('deletePaymentSource:', function() {
    it('should delete the payment source', function(done) {
      failedResponse = false;

      billing.deletePaymentSource('paymentSourceId')
      .then(function(result) {
        storeApi.integrations.paymentSource.delete.should.have.been.called;
        storeApi.integrations.paymentSource.delete.should.have.been.calledWith({
          paymentSourceId: 'paymentSourceId',
          companyId: 'testId1'
        });

        expect(result).to.be.ok;
        expect(result).to.equal('deleted');
        done();
      });
    });

    it('should handle failure to get subscription correctly', function(done) {
      failedResponse = true;

      billing.deletePaymentSource('paymentSourceId')
      .then(function(subscription) {
        done(subscription);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      });
    });
  });

});
