/*jshint expr:true */
"use strict";

describe("Services: purchase licenses factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.value("$stateParams", {
      displayCount: 'displayCount'
    });
    $provide.service("userState", function() {
      return {
        reloadSelectedCompany: sinon.stub().returns(Q.resolve("success")),
        getUserEmail: sinon.stub().returns('userEmail')
      };
    });
    $provide.value("currentPlanFactory", {
      currentPlan: {
        playerProTotalLicenseCount: 2,
        subscriptionId: 'subscriptionId',
        billToId: 'billToId'
      }
    });
    $provide.service("storeService", function() {
      return {
        estimateSubscriptionUpdate: sinon.stub().returns(Q.resolve({item: 'estimateResponse'})),
        updateSubscription: sinon.spy(function() {
          if (validate) {
            return Q.resolve("success");
          } else {
            return Q.reject();
          }
        })
      };
    });
    $provide.service("pricingFactory", function() {
      return {
        getPricePerDisplay: function(isMonthly, currentDisplayCount, isEducation) {
          return '' + isMonthly + currentDisplayCount + isEducation;
        }
      };
    });

    $provide.service("analyticsFactory", function() {
      return {
        track: sinon.stub()
      };
    });

  }));

  var $modal, $state, $timeout, purchaseLicensesFactory, currentPlanFactory, userState, storeService, analyticsFactory, validate;

  beforeEach(function() {
    inject(function($injector) {
      $timeout = $injector.get("$timeout");
      userState = $injector.get('userState');
      currentPlanFactory = $injector.get('currentPlanFactory');
      storeService = $injector.get('storeService');
      analyticsFactory = $injector.get('analyticsFactory');
      purchaseLicensesFactory = $injector.get("purchaseLicensesFactory");
    });
  });

  it("should exist", function() {
    expect(purchaseLicensesFactory).to.be.ok;
    expect(purchaseLicensesFactory.init).to.be.a("function");
    expect(purchaseLicensesFactory.getEstimate).to.be.a("function");
    expect(purchaseLicensesFactory.completePayment).to.be.a("function");

    expect(purchaseLicensesFactory.userEmail).to.equal('userEmail');
  });

  describe("init: ", function() {
    beforeEach(function() {
      sinon.stub(purchaseLicensesFactory, 'getEstimate');
    });

    afterEach(function() {
      purchaseLicensesFactory.getEstimate.restore();
    });

    it("should initialize values and retrieve estimate", function() {
      purchaseLicensesFactory.init();

      expect(purchaseLicensesFactory.purchase).to.be.ok;
      expect(purchaseLicensesFactory.purchase.completed).to.be.false;
      expect(purchaseLicensesFactory.purchase.displayCount).to.equal('displayCount');
      expect(purchaseLicensesFactory.purchase.couponCode).to.equal('')

      purchaseLicensesFactory.getEstimate.should.have.been.called;
    });

  });

  describe("getEstimate: ", function() {
    beforeEach(function() {
      validate = true;

      purchaseLicensesFactory.purchase = {
        displayCount: 5,
        couponCode: 'couponCode'
      };

    });

    it("should call estimateSubscriptionUpdate api and return a promise", function() {
      expect(purchaseLicensesFactory.getEstimate().then).to.be.a("function");

      storeService.estimateSubscriptionUpdate.should.have.been.called;
      storeService.estimateSubscriptionUpdate.should.have.been.calledWith(7, 'subscriptionId', 'billToId', 'couponCode');
    });

    it("should populate estimate object if call succeeds", function(done) {
      purchaseLicensesFactory.getEstimate()
      .then(function() {
        expect(purchaseLicensesFactory.estimate).to.equal('estimateResponse');

        expect(analyticsFactory.track).to.have.been.calledWith('Subscription Update Estimated', {
          subscriptionId: 'subscriptionId',
          changeInLicenses: 5,
          totalLicenses: 7,
          companyId: 'billToId'
        });

        done();
      })
      .then(null,function(e) {
        console.error(e);
        done("error");
      });
    });

    describe('_updatePerDisplayPrice:', function() {
      it('should not update prices if estimate does not contain correct fields', function(done) {
        purchaseLicensesFactory.currentPricePerDisplay = 'currentPrice';
        purchaseLicensesFactory.newPricePerDisplay = 'newPrice';

        purchaseLicensesFactory.getEstimate()
          .then(function() {
            expect(purchaseLicensesFactory.currentPricePerDisplay).to.equal('currentPrice');
            expect(purchaseLicensesFactory.newPricePerDisplay).to.equal('newPrice');

            done();
          });
      });

      it('should update prices for yearly subscriptions', function(done) {
        storeService.estimateSubscriptionUpdate.returns(Q.resolve({
          item: {
            next_invoice_estimate: {
              line_items: [{
                entity_id: 'productCode-y'
              }],
              line_item_discounts: []
            }
          }
        }));

        purchaseLicensesFactory.getEstimate()
          .then(function() {
            expect(purchaseLicensesFactory.currentPricePerDisplay).to.equal('false2false');
            expect(purchaseLicensesFactory.newPricePerDisplay).to.equal('false7false');

            done();
          });
      });

      it('should update prices for monthly subscriptions', function(done) {
        storeService.estimateSubscriptionUpdate.returns(Q.resolve({
          item: {
            next_invoice_estimate: {
              line_items: [{
                entity_id: 'productCode-m'
              }],
              line_item_discounts: [{
                coupon_id: 'OTHER'
              }]
            }
          }
        }));

        purchaseLicensesFactory.getEstimate()
          .then(function() {
            expect(purchaseLicensesFactory.currentPricePerDisplay).to.equal('true2false');
            expect(purchaseLicensesFactory.newPricePerDisplay).to.equal('true7false');

            done();
          });
      });

      it('should detect education discount', function(done) {
        storeService.estimateSubscriptionUpdate.returns(Q.resolve({
          item: {
            next_invoice_estimate: {
              line_items: [{
                entity_id: 'productCode-y'
              }],
              line_item_discounts: [{
                coupon_id: 'EDUCATION'
              }]
            }
          }
        }));

        purchaseLicensesFactory.getEstimate()
          .then(function() {
            expect(purchaseLicensesFactory.currentPricePerDisplay).to.equal('false2true');
            expect(purchaseLicensesFactory.newPricePerDisplay).to.equal('false7true');

            done();
          });
      });

    });

    it("should show estimate error if call fails", function(done) {
      storeService.estimateSubscriptionUpdate.returns(Q.reject());

      purchaseLicensesFactory.getEstimate()
      .then(function() {
        expect(purchaseLicensesFactory.apiError).to.equal("An unexpected error has occurred. Please try again.");
      
        done();
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should not clear previous estimate on error", function(done) {
      storeService.estimateSubscriptionUpdate.returns(Q.reject());
      purchaseLicensesFactory.estimate = 'previousEstimate';

      purchaseLicensesFactory.getEstimate()
      .then(function() {
        expect(purchaseLicensesFactory.estimate).to.equal("previousEstimate");
      
        done();
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should start and stop spinner", function(done) {
      purchaseLicensesFactory.getEstimate();

      expect(purchaseLicensesFactory.loading).to.be.true;

      setTimeout(function() {
        expect(purchaseLicensesFactory.loading).to.be.false;

        done();
      }, 10);
    });

  });

  describe("completePayment: ", function() {
    beforeEach(function() {
      validate = true;

      purchaseLicensesFactory.purchase = {
        displayCount: 5,
        couponCode: 'couponCode'
      };

    });

    it("should reset previous messages and start spinner", function() {
      purchaseLicensesFactory.loading = false;
      purchaseLicensesFactory.apiError = "apiError";
      purchaseLicensesFactory.errorMessage = "error";

      purchaseLicensesFactory.completePayment();

      expect(purchaseLicensesFactory.loading).to.be.true;
      expect(purchaseLicensesFactory.apiError).to.not.be.ok;
      expect(purchaseLicensesFactory.errorMessage).to.not.be.ok;
    });

    it("should call updateSubscription api and return a promise", function() {
      expect(purchaseLicensesFactory.completePayment().then).to.be.a("function");

      storeService.updateSubscription.should.have.been.called;
      storeService.updateSubscription.should.have.been.calledWith(7, 'subscriptionId', 'billToId', 'couponCode');
    });

    it("should track purchase", function(done) {
      purchaseLicensesFactory.completePayment();
      
      setTimeout(function() {        
        analyticsFactory.track.should.have.been.calledWith('Subscription Updated', {
          subscriptionId: 'subscriptionId',
          changeInLicenses: 5,
          totalLicenses: 7,
          companyId: 'billToId'
        });

        done();
      }, 10);
    });

    it("should not reload company right away", function(done) {
      purchaseLicensesFactory.completePayment();
      
      setTimeout(function() {        
        expect(purchaseLicensesFactory.purchase.completed).to.not.be.ok;
        userState.reloadSelectedCompany.should.not.have.been.called;

        done();
      }, 10);
    });

    it("should reloadSelectedCompany on purchase", function(done) {
      purchaseLicensesFactory.completePayment()
        .then(function() {
          userState.reloadSelectedCompany.should.have.been.called;
          expect(purchaseLicensesFactory.purchase.completed).to.be.true;

          expect(purchaseLicensesFactory.loading).to.be.false;

          done();
        })
        .then(null,function() {
          done("error");
        });

      // Flush asynchronously
      setTimeout(function() {
        $timeout.flush(10000);        
      }, 10);
    });

    it("should handle failure to reloadSelectedCompany", function(done) {
      userState.reloadSelectedCompany.returns(Q.reject());
      purchaseLicensesFactory.completePayment()
        .then(function() {
          userState.reloadSelectedCompany.should.have.been.called;
          expect(purchaseLicensesFactory.purchase.completed).to.be.true;

          expect(purchaseLicensesFactory.loading).to.be.false;

          done();
        })
        .then(null,function() {
          done("error");
        });

        // Flush asynchronously
        setTimeout(function() {
          $timeout.flush(10000);        
        }, 10);
    });

    it("should show payment error if call fails", function(done) {
      validate = false;

      purchaseLicensesFactory.completePayment()
        .then(function() {
          expect(purchaseLicensesFactory.apiError).to.equal("There was an unknown error with the payment.");
          expect(purchaseLicensesFactory.loading).to.be.false;

          done();
        })
        .then(null,function() {
          done("error");
        });
    });

  });

});
