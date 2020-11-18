'use strict';
describe('service: billing:', function() {
  var billing, failedResponse;

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
        return Q.resolve({
          subscription: {
            listUser: function() {
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
            }
          },
          integrations: {
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
              }
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
    expect(billing.getInvoices).to.be.a.function;
  });

  describe('getSubscriptions:', function() {
    it('should return a list of subscriptions', function(done) {
      failedResponse = false;

      billing.getSubscriptions({})
      .then(function(result) {
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

});
