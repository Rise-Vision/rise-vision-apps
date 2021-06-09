/*jshint expr:true */
"use strict";

describe("Services: purchase licenses factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.value("$state", {
      params: {
        displayCount: 'displayCount',
        subscriptionId: 'subscriptionId'
      }
    });
    $provide.service('processErrorCode',function() {
      return function(err) {
        return 'processed ' + err;
      };
    });
    $provide.service("userState", function() {
      return {
        reloadSelectedCompany: sinon.stub().returns(Q.resolve("success")),
        getUserEmail: sinon.stub().returns('userEmail')
      };
    });
    $provide.service("billing", function() {
      return {
        estimateSubscriptionUpdate: sinon.stub().returns(Q.resolve({item: 'estimateResponse'})),
        updateSubscription: sinon.spy(function() {
          if (validate) {
            return Q.resolve("success");
          } else {
            return Q.reject('error');
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

    $provide.service("plansService", function() {
      return {
        getUnlimitedPlan: sinon.stub().returns({
          productCode: 'unlimitedProductCode'
        })
      };
    });

    $provide.service("subscriptionFactory", function() {
      return {
        getSubscription: sinon.stub().resolves(),
        getItemSubscription: sinon.stub().returns({
          id: 'subscriptionId',
          customer_id: 'customerId',
          plan_quantity: 2,
          plan_id: 'somePlanId-1m',
          currency_code: 'CAD'
        })
      };
    });

  }));

  var $modal, $timeout, updateSubscriptionFactory,
    userState, billing, analyticsFactory, subscriptionFactory, validate;

  beforeEach(function() {
    inject(function($injector) {
      $timeout = $injector.get("$timeout");
      userState = $injector.get('userState');
      billing = $injector.get('billing');
      analyticsFactory = $injector.get('analyticsFactory');
      updateSubscriptionFactory = $injector.get("updateSubscriptionFactory");
      subscriptionFactory = $injector.get("subscriptionFactory");
    });
  });

  it("should exist", function() {
    expect(updateSubscriptionFactory).to.be.ok;
    expect(updateSubscriptionFactory.init).to.be.a("function");
    expect(updateSubscriptionFactory.getCurrentDisplayCount).to.be.a("function");
    expect(updateSubscriptionFactory.getEstimate).to.be.a("function");
    expect(updateSubscriptionFactory.completePayment).to.be.a("function");

    expect(updateSubscriptionFactory.userEmail).to.equal('userEmail');
  });

  describe("init: ", function() {
    beforeEach(function() {
      sinon.stub(updateSubscriptionFactory, 'getEstimate');
    });

    afterEach(function() {
      updateSubscriptionFactory.getEstimate.restore();
    });

    it("should initialize values on add and retrieve estimate", function() {
      updateSubscriptionFactory.init('add');

      expect(updateSubscriptionFactory.purchase).to.be.ok;
      expect(updateSubscriptionFactory.purchase.completed).to.be.false;
      expect(updateSubscriptionFactory.purchase.licensesToAdd).to.equal('displayCount');
      expect(updateSubscriptionFactory.purchase.licensesToRemove).to.equal(0);
      expect(updateSubscriptionFactory.purchase.couponCode).to.equal('');
      expect(updateSubscriptionFactory._purchaseAction).to.equal('add');

      subscriptionFactory.getSubscription.should.have.been.calledWith('subscriptionId');
    });

    it("should initialize values on remove and retrieve estimate", function() {
      updateSubscriptionFactory.init('remove');

      expect(updateSubscriptionFactory.purchase).to.be.ok;
      expect(updateSubscriptionFactory.purchase.completed).to.be.false;
      expect(updateSubscriptionFactory.purchase.licensesToAdd).to.equal(0);
      expect(updateSubscriptionFactory.purchase.licensesToRemove).to.equal('displayCount');
      expect(updateSubscriptionFactory.purchase.couponCode).to.equal('');
      expect(updateSubscriptionFactory._purchaseAction).to.equal('remove');

      subscriptionFactory.getSubscription.should.have.been.calledWith('subscriptionId');
    });

    it('should update the plan id and get an estimate', function(done) {
      updateSubscriptionFactory.init('remove');

      setTimeout(function() {
        expect(updateSubscriptionFactory.purchase.planId).to.equal('somePlanId-1m')

        updateSubscriptionFactory.getEstimate.should.have.been.called;

        done();
      }, 10);
    });

    it('should update the plan id to annual', function(done) {
      updateSubscriptionFactory.init('annual');

      setTimeout(function() {
        expect(updateSubscriptionFactory.purchase.planId).to.equal('somePlanId-1y')

        done();
      }, 10);
    });

    it('should update the plan id to unlimited', function(done) {
      updateSubscriptionFactory.init('unlimited');

      setTimeout(function() {
        expect(updateSubscriptionFactory.purchase.planId).to.equal('unlimitedProductCode-cad01y')

        done();
      }, 10);
    });
  });

  describe("getCurrentDisplayCount:", function() {
    it("should return the current display count from current plan", function() {
      var count = updateSubscriptionFactory.getCurrentDisplayCount();

      expect(count).to.equal(2);
    });

    it("should return current display count as zero if subscription item has no subscription", function() {
      subscriptionFactory.getItemSubscription.returns({});

      var count = updateSubscriptionFactory.getCurrentDisplayCount();

      expect(count).to.equal(0);
    });
  });

  describe('getTotalDisplayCount:', function() {
    it("should calculate if addig licenses", function() {
      updateSubscriptionFactory.purchase = {
        licensesToAdd: 5,
      };
      expect(updateSubscriptionFactory.getTotalDisplayCount()).to.equal(7);
    });

    it("should calculate if removing licenses", function() {
      updateSubscriptionFactory.purchase = {
        licensesToRemove: 1,
      };
      expect(updateSubscriptionFactory.getTotalDisplayCount()).to.equal(1);
    });

    it("should return null if plan is changing to unlimited", function() {
      updateSubscriptionFactory.init('unlimited');

      expect(updateSubscriptionFactory.getTotalDisplayCount()).to.equal(null);
    });
  });

  describe("getEstimate: add:", function() {
    beforeEach(function() {
      validate = true;

      updateSubscriptionFactory.purchase = {
        planId: 'planId-1y',
        licensesToAdd: 5,
        licensesToRemove: 0,
        couponCode: 'couponCode'
      };

    });

    it("should call estimateSubscriptionUpdate api and return a promise", function() {
      expect(updateSubscriptionFactory.getEstimate().then).to.be.a("function");

      billing.estimateSubscriptionUpdate.should.have.been.called;
      billing.estimateSubscriptionUpdate.should.have.been.calledWith(7, 'subscriptionId', 'planId-1y', 'customerId', 'couponCode');
    });

    it("should populate estimate object if call succeeds", function(done) {
      updateSubscriptionFactory.getEstimate()
      .then(function() {
        expect(updateSubscriptionFactory.estimate).to.equal('estimateResponse');

        expect(analyticsFactory.track).to.have.been.calledWith('Subscription Update Estimated', {
          subscriptionId: 'subscriptionId',
          paymentTerm: 'yearly',
          changeInLicenses: 5,
          totalLicenses: 7,
          companyId: 'customerId'
        });

        done();
      })
      .then(null,function(e) {
        console.error(e);
        done("error");
      });
    });

    describe('getTotalDisplayCount:', function() {
      it("should add for the total display count", function() {
        var count = updateSubscriptionFactory.getTotalDisplayCount();

        expect(count).to.equal(7);
      });

      it("should not consider change when input validation fails", function() {
        updateSubscriptionFactory.purchase.licensesToAdd = undefined;

        var count = updateSubscriptionFactory.getTotalDisplayCount();

        expect(count).to.equal(2);
      });
    });

    describe('_updatePerDisplayPrice:', function() {
      it('should not update prices if estimate does not contain correct fields', function(done) {
        updateSubscriptionFactory.purchase.currentPricePerDisplay = 'currentPrice';
        updateSubscriptionFactory.purchase.newPricePerDisplay = 'newPrice';

        updateSubscriptionFactory.getEstimate()
          .then(function() {
            expect(updateSubscriptionFactory.purchase.currentPricePerDisplay).to.equal('currentPrice');
            expect(updateSubscriptionFactory.purchase.newPricePerDisplay).to.equal('newPrice');

            done();
          });
      });

      it('should update prices for yearly subscriptions', function(done) {
        billing.estimateSubscriptionUpdate.returns(Q.resolve({
          item: {
            next_invoice_estimate: {
              line_items: [{
                entity_id: 'productCode-y'
              }],
              line_item_discounts: []
            }
          }
        }));

        updateSubscriptionFactory.getEstimate()
          .then(function() {
            expect(updateSubscriptionFactory.purchase.currentPricePerDisplay).to.equal('false2false');
            expect(updateSubscriptionFactory.purchase.newPricePerDisplay).to.equal('false7false');

            done();
          });
      });

      it('should update prices for monthly subscriptions', function(done) {
        billing.estimateSubscriptionUpdate.returns(Q.resolve({
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

        updateSubscriptionFactory.getEstimate()
          .then(function() {
            expect(updateSubscriptionFactory.purchase.currentPricePerDisplay).to.equal('true2false');
            expect(updateSubscriptionFactory.purchase.newPricePerDisplay).to.equal('true7false');

            done();
          });
      });

      it('should detect education discount', function(done) {
        billing.estimateSubscriptionUpdate.returns(Q.resolve({
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

        updateSubscriptionFactory.getEstimate()
          .then(function() {
            expect(updateSubscriptionFactory.purchase.currentPricePerDisplay).to.equal('false2true');
            expect(updateSubscriptionFactory.purchase.newPricePerDisplay).to.equal('false7true');

            done();
          });
      });

      it('should not calculate per display price if plan is unlimited', function(done) {
        billing.estimateSubscriptionUpdate.returns(Q.resolve({
          item: {
            next_invoice_estimate: {
              line_items: [{
                entity_id: 'productCode-y'
              }],
              line_item_discounts: []
            }
          }
        }));
        updateSubscriptionFactory._purchaseAction = 'unlimited';

        updateSubscriptionFactory.getEstimate()
          .then(function() {
            expect(updateSubscriptionFactory.purchase.currentPricePerDisplay).to.equal(undefined);
            expect(updateSubscriptionFactory.purchase.newPricePerDisplay).to.equal(undefined);

            done();
          });
      });

    });

    it("should show estimate error if call fails", function(done) {
      billing.estimateSubscriptionUpdate.returns(Q.reject('error'));

      updateSubscriptionFactory.getEstimate()
      .then(function() {
        expect(updateSubscriptionFactory.apiError).to.equal("processed error");

        done();
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should not clear previous estimate on error", function(done) {
      billing.estimateSubscriptionUpdate.returns(Q.reject());
      updateSubscriptionFactory.estimate = 'previousEstimate';

      updateSubscriptionFactory.getEstimate()
      .then(function() {
        expect(updateSubscriptionFactory.estimate).to.equal("previousEstimate");

        done();
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should start and stop spinner", function(done) {
      updateSubscriptionFactory.getEstimate();

      expect(updateSubscriptionFactory.loading).to.be.true;

      setTimeout(function() {
        expect(updateSubscriptionFactory.loading).to.be.false;

        done();
      }, 10);
    });

  });

  describe("getEstimate: remove:", function() {
    beforeEach(function() {
      validate = true;

      updateSubscriptionFactory.purchase = {
        planId: 'planId-1m',
        licensesToAdd: 0,
        licensesToRemove: 1,
        couponCode: ''
      };

    });

    it("should call estimateSubscriptionUpdate api and return a promise", function() {
      expect(updateSubscriptionFactory.getEstimate().then).to.be.a("function");

      billing.estimateSubscriptionUpdate.should.have.been.called;
      billing.estimateSubscriptionUpdate.should.have.been.calledWith(1, 'subscriptionId', 'planId-1m', 'customerId', '');
    });

    it("should populate estimate object if call succeeds", function(done) {
      updateSubscriptionFactory.getEstimate()
      .then(function() {
        expect(updateSubscriptionFactory.estimate).to.equal('estimateResponse');

        expect(analyticsFactory.track).to.have.been.calledWith('Subscription Update Estimated', {
          subscriptionId: 'subscriptionId',
          paymentTerm: 'monthly',
          changeInLicenses: -1,
          totalLicenses: 1,
          companyId: 'customerId'
        });

        done();
      })
      .then(null,function(e) {
        console.error(e);
        done("error");
      });
    });

    describe('getTotalDisplayCount:', function() {
      it("should subtract for the total display count", function() {
        var count = updateSubscriptionFactory.getTotalDisplayCount();

        expect(count).to.equal(1);
      });

      it("should not consider change when input validation fails", function() {
        updateSubscriptionFactory.purchase.licensesToRemove = undefined;

        var count = updateSubscriptionFactory.getTotalDisplayCount();

        expect(count).to.equal(2);
      });
    });
  });

  describe("completePayment: add:", function() {
    beforeEach(function() {
      validate = true;

      updateSubscriptionFactory.purchase = {
        planId: 'planId',
        licensesToAdd: 5,
        licensesToRemove: 0,
        couponCode: 'couponCode'
      };

    });

    it("should reset previous messages and start spinner", function() {
      updateSubscriptionFactory.loading = false;
      updateSubscriptionFactory.apiError = "apiError";
      updateSubscriptionFactory.errorMessage = "error";

      updateSubscriptionFactory.completePayment();

      expect(updateSubscriptionFactory.loading).to.be.true;
      expect(updateSubscriptionFactory.apiError).to.not.be.ok;
      expect(updateSubscriptionFactory.errorMessage).to.not.be.ok;
    });

    it("should call updateSubscription api and return a promise", function() {
      expect(updateSubscriptionFactory.completePayment().then).to.be.a("function");

      billing.updateSubscription.should.have.been.called;
      billing.updateSubscription.should.have.been.calledWith(7, 'subscriptionId', 'planId', 'customerId', 'couponCode');
    });

    it("should track purchase", function(done) {
      updateSubscriptionFactory.completePayment();

      setTimeout(function() {
        analyticsFactory.track.should.have.been.calledWith('Subscription Updated', {
          subscriptionId: 'subscriptionId',
          paymentTerm: 'yearly',
          changeInLicenses: 5,
          totalLicenses: 7,
          companyId: 'customerId'
        });

        done();
      }, 10);
    });

    it("should not reload company right away", function(done) {
      updateSubscriptionFactory.completePayment();

      setTimeout(function() {
        expect(updateSubscriptionFactory.purchase.completed).to.not.be.ok;
        userState.reloadSelectedCompany.should.not.have.been.called;

        done();
      }, 10);
    });

    it("should reloadSelectedCompany on purchase", function(done) {
      updateSubscriptionFactory.completePayment()
        .then(function() {
          userState.reloadSelectedCompany.should.have.been.called;
          expect(updateSubscriptionFactory.purchase.completed).to.be.true;

          expect(updateSubscriptionFactory.loading).to.be.false;

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
      updateSubscriptionFactory.completePayment()
        .then(function() {
          userState.reloadSelectedCompany.should.have.been.called;
          expect(updateSubscriptionFactory.purchase.completed).to.be.true;

          expect(updateSubscriptionFactory.loading).to.be.false;

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

      updateSubscriptionFactory.completePayment()
        .then(function() {
          expect(updateSubscriptionFactory.apiError).to.equal('processed error');
          expect(updateSubscriptionFactory.purchase.completed).to.not.be.ok;
          expect(updateSubscriptionFactory.loading).to.be.false;

          done();
        })
        .then(null,function() {
          done("error");
        });
    });

  });

  describe("completePayment: remove:", function() {
    beforeEach(function() {
      validate = true;

      updateSubscriptionFactory.purchase = {
        planId: 'planId',
        licensesToAdd: 0,
        licensesToRemove: 1,
        couponCode: ''
      };
    });

    it("should call updateSubscription api and return a promise", function() {
      expect(updateSubscriptionFactory.completePayment().then).to.be.a("function");

      billing.updateSubscription.should.have.been.called;
      billing.updateSubscription.should.have.been.calledWith(1, 'subscriptionId', 'planId', 'customerId', '');
    });

    it("should track purchase", function(done) {
      updateSubscriptionFactory.completePayment();
      setTimeout(function() {
        analyticsFactory.track.should.have.been.calledWith('Subscription Updated', {
          subscriptionId: 'subscriptionId',
          paymentTerm: 'yearly',
          changeInLicenses: -1,
          totalLicenses: 1,
          companyId: 'customerId'
        });

        done();
      }, 10);
    });

    describe("getCreditTotal:", function() {
      it("should get credit total 0 if there are no credit notes", function() {
        var total = updateSubscriptionFactory.getCreditTotal();

        expect(total).to.equal(0);
      });

      it("should get credit total for a single credit note", function() {
        updateSubscriptionFactory.estimate = {
          credit_note_estimates: [
            { total: 1000 }
          ]
        };

        var total = updateSubscriptionFactory.getCreditTotal();

        expect(total).to.equal(10);
      });

      it("should get credit total for multiple credit notes", function() {
        updateSubscriptionFactory.estimate = {
          credit_note_estimates: [
            { total: 1000 },
            { total: 2000 },
            { total: 3000 }
          ]
        };

        var total = updateSubscriptionFactory.getCreditTotal();

        expect(total).to.equal(60);
      });
    });
  });

});
