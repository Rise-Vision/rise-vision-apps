/*jshint expr:true */
"use strict";

describe("Services: purchase factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.value("PLANS_LIST", [{
      type: 'volume',
      productId: 'productId',
      productCode: 'productCode',
      yearly: {
        billAmount: 'yearlyBillAmount'
      },
      monthly: {
        billAmount: 'monthlyBillAmount'
      }
    }]);
    $provide.service("$q", function() {return Q;});
    $provide.service("$modal", function() {
      return {
        open: sinon.stub().returns({
          result: Q.resolve("result")
        })
      };
    });
    $provide.service("$state", function() {
      return {
        go: sinon.spy()
      };
    });
    $provide.service("userState", function() {
      return userState = {
        getCopyOfSelectedCompany: sinon.stub().returns({
          id: "id",
          street: "billingStreet",
        }),
        getCopyOfProfile: sinon.stub().returns({
          username: "username",
          uselessProperty: "value"
        }),
        reloadSelectedCompany: sinon.spy(function() {
          if (validate) {
            return Q.resolve("success");
          } else {
            return Q.reject();
          }
        })
      };
    });
    $provide.service("storeService", function() {
      return storeService = {
        calculateTaxes: sinon.spy(function() {
          if (validate) {
            return Q.resolve({
              result: true,
              taxes: [],
              total: "total",
              totalTax: "totalTax",
              couponAmount: "couponAmount",
              subTotal: "subTotal",
              shippingTotal: "shippingTotal"
            });
          } else {
            return Q.reject();
          }
        }),
        purchase: sinon.spy(function() {
          if (validate) {
            return Q.resolve("success");
          } else {
            return Q.reject();
          }
        })
      };
    });

    $provide.service("stripeService", function() {
      var failMode = false;
      return stripeService = {
        shouldFail: function(mode) {failMode = mode;},
        createPaymentMethod: sinon.spy(function() {
          console.log("Stripe Service: createPaymentMethod mock will " + (failMode ? "fail" : "pass"));
          return Q.resolve(failMode ? {error: {}} : {});
        }),
        authenticate3ds: sinon.spy(function() {
          return Q.resolve();
        })
      };
    });
    $provide.service("purchaseFlowTracker", function() {
      return purchaseFlowTracker = {
        trackProductAdded: sinon.stub(),
        trackPlaceOrderClicked: sinon.stub(),
        trackOrderPayNowClicked: sinon.stub()
      };
    });

  }));

  var $rootScope, $modal, $state, $timeout, clock, purchaseFactory, userState, stripeService, storeService, purchaseFlowTracker, validate, RPP_ADDON_ID;

  beforeEach(function() {
    inject(function($injector) {
      RPP_ADDON_ID = $injector.get("RPP_ADDON_ID");
      $rootScope = $injector.get("$rootScope");
      $modal = $injector.get("$modal");
      $state = $injector.get("$state");
      $timeout = $injector.get("$timeout");
      purchaseFactory = $injector.get("purchaseFactory");
    });
  });

  it("should exist", function() {
    expect(purchaseFactory).to.be.ok;
    expect(purchaseFactory.init).to.be.a("function");
    expect(purchaseFactory.updatePlan).to.be.a("function");
    expect(purchaseFactory.showTaxExemptionModal).to.be.a("function");
    expect(purchaseFactory.validatePaymentMethod).to.be.a("function");
    expect(purchaseFactory.getEstimate).to.be.a("function");
    expect(purchaseFactory.completePayment).to.be.a("function");
  });

  it("should stop spinner on load", function() {
    expect(purchaseFactory.loading).to.be.false;
  });

  describe("init: ", function() {
    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function () {
      clock.restore();
    });

    it("should initialize default volume plan, attach addresses and clean contact info", function() {
      purchaseFactory.init();
      
      expect(purchaseFactory.purchase).to.be.ok;

      expect(purchaseFactory.purchase.plan).to.be.ok;
      expect(purchaseFactory.purchase.plan.name).to.equal("5 Display Licenses (Yearly)");
      expect(purchaseFactory.purchase.plan.displays).to.equal(5)
      expect(purchaseFactory.purchase.plan.isMonthly).to.be.false;

      expect(purchaseFactory.purchase.billingAddress).to.deep.equal({
        id: "id",
        name: undefined,
        street: "billingStreet",
        unit: undefined,
        city: undefined,
        country: undefined,
        postalCode: undefined,
        province: undefined
      });
      expect(purchaseFactory.purchase.contact).to.be.an("object");
      expect(purchaseFactory.purchase.contact).to.have.property("username");
      expect(purchaseFactory.purchase.contact).to.not.have.property("uselessProperty");
    });

    it("should initialize payment methods", function() {
      purchaseFactory.init();
      
      expect(purchaseFactory.purchase).to.be.ok;
      expect(purchaseFactory.purchase.paymentMethods).to.be.ok;
      expect(purchaseFactory.purchase.paymentMethods.paymentMethod).to.equal("card");
      expect(purchaseFactory.purchase.paymentMethods.existingCreditCards).to.deep.equal([]);

      expect(purchaseFactory.purchase.paymentMethods.newCreditCard).to.deep.equal({
        isNew: true,
        address: {},
        useBillingAddress: true,
        billingAddress: purchaseFactory.purchase.billingAddress
      });

      expect(purchaseFactory.purchase.paymentMethods.selectedCard).to.equal(purchaseFactory.purchase.paymentMethods.newCreditCard);

      expect(purchaseFactory.purchase.estimate).to.deep.equal({});
    });

    it("should initialize invoice due date 30 days from now", function() {
      var newDate = new Date();

      purchaseFactory.init();

      expect(purchaseFactory.purchase.paymentMethods.invoiceDate).to.be.ok;
      expect(purchaseFactory.purchase.paymentMethods.invoiceDate).to.be.a("date");
      expect(purchaseFactory.purchase.paymentMethods.invoiceDate - newDate).to.equal(30 * 24 * 60 * 60 * 1000);
    });
  });

  describe("updatePlan:", function() {
    it("should update plan with new details", function() {
      purchaseFactory.init();

      purchaseFactory.updatePlan(2,false,242);

      expect(purchaseFactory.purchase.plan).to.be.ok;
      expect(purchaseFactory.purchase.plan.name).to.equal("2 Display Licenses (Yearly)");
      expect(purchaseFactory.purchase.plan.displays).to.equal(2)
      expect(purchaseFactory.purchase.plan.isMonthly).to.be.false;
      expect(purchaseFactory.purchase.plan.yearly.billAmount).to.equal(242);

      purchaseFlowTracker.trackProductAdded.should.have.been.calledWith(purchaseFactory.purchase.plan);
    });

    it("should update monthly plan with new details", function() {
      purchaseFactory.init();

      purchaseFactory.updatePlan(1,true,11);

      expect(purchaseFactory.purchase.plan).to.be.ok;
      expect(purchaseFactory.purchase.plan.name).to.equal("1 Display License (Monthly)");
      expect(purchaseFactory.purchase.plan.displays).to.equal(1)
      expect(purchaseFactory.purchase.plan.isMonthly).to.be.true;
      expect(purchaseFactory.purchase.plan.monthly.billAmount).to.equal(11);

      purchaseFlowTracker.trackProductAdded.should.have.been.calledWith(purchaseFactory.purchase.plan);
    });
  });

  describe("showTaxExemptionModal: ", function() {
    it("should return a promise", function() {
      expect(purchaseFactory.showTaxExemptionModal().then).to.be.a("function");
    });

    it("should show Tax Exemption modal", function() {
      purchaseFactory.showTaxExemptionModal();

      expect($modal.open).to.have.been.called;
      expect($modal.open).to.have.been.calledWith({
        template: sinon.match.any,
        controller: "TaxExemptionModalCtrl",
        windowClass: 'madero-style',
        size: "md",
        backdrop: "static"
      });
    });

    it("should return modal result", function(done) {
      purchaseFactory.purchase = {};
      purchaseFactory.showTaxExemptionModal();

      setTimeout(function() {
        expect(purchaseFactory.purchase.taxExemptionSent).to.equal("result");

        done();
      }, 10);
    });

  });

  describe("validatePaymentMethod: ", function() {
    it("should validate and resolve", function(done) {
      purchaseFactory.purchase = {
        paymentMethods: {
          paymentMethod: "invoice"
        }
      };

      purchaseFactory.validatePaymentMethod()
      .then(function() {
        done();
      })
      .then(null, function() {
        done("error");
      });
    });

    describe("existing card: ", function() {
      var card;
      beforeEach(function() {
        purchaseFactory.purchase = {
          paymentMethods: {
            paymentMethod: "card",
            selectedCard: card = {
              isNew: true,
              number: "123"
            }
          }
        };
      });

      it("should validate card and proceed to next step", function(done) {
        purchaseFactory.validatePaymentMethod()
        .then(function() {
          stripeService.shouldFail(false);
          stripeService.createPaymentMethod.should.have.been.called;

          done();
        })
        .then(null,function(error) {
          done(error);
        });
      });

      it("should validate and not proceed if there are errors", function(done) {
        stripeService.shouldFail(true);

        purchaseFactory.validatePaymentMethod()
        .then(function () {
          console.log("Should not be here");
        }, function() {
          stripeService.createPaymentMethod.should.have.been.called;
          done();
        });
      });
      
    });

    describe("new card: ", function() {
      var card;

      beforeEach(function() {
        validate = true;

        purchaseFactory.purchase = {
          paymentMethods: {
            paymentMethod: "card",
            existingCreditCards: [],
            newCreditCard: card = {
              isNew: true,
              number: "123",
              address: {},
              billingAddress: {}
            }
          }
        };
        purchaseFactory.purchase.paymentMethods.selectedCard = purchaseFactory.purchase.paymentMethods.newCreditCard;
      });

      it("should validate card", function() {
        purchaseFactory.validatePaymentMethod();

        stripeService.createPaymentMethod.should.have.been.called;
      });

      it("should validate and not proceed if there are errors", function(done) {
        stripeService.shouldFail(true);

        purchaseFactory.validatePaymentMethod()
        .then(null, function() {
          stripeService.createPaymentMethod.should.have.been.called;

          done();
        })
        .then(null,function() {
          done("should not be here");
        });
      });

      it("should use billing address if selected", function() {
        card.useBillingAddress = true;
        card.billingAddress = {city: "test-billing-city"};

        purchaseFactory.validatePaymentMethod();

        assert.equal(stripeService.createPaymentMethod.getCall(0).args[2].billing_details.address.city, "test-billing-city");
      });

      it("should start and stop spinner", function(done) {
        purchaseFactory.validatePaymentMethod();

        expect(purchaseFactory.loading).to.be.true;

        setTimeout(function() {
          expect(purchaseFactory.loading).to.be.false;

          done();
        }, 10);
      });

    });

  });
  
  describe("getEstimate: ", function() {
    beforeEach(function() {
      validate = true;

      purchaseFactory.purchase = {
        billingAddress: {
          id: "id"
        },
        plan: {
          displays: 5,
          isMonthly: true,
          productCode: "productCode",
          monthly: {
            billAmount: 27
          },
          yearly: {
            priceDisplayYear: 99
          },
          additionalDisplayLicenses: 3
        }
      };
    });

    it("should call calculateTaxes api and return a promise", function() {
      expect(purchaseFactory.getEstimate().then).to.be.a("function");

      storeService.calculateTaxes.should.have.been.called;
      storeService.calculateTaxes.should.have.been.calledWith("id", sinon.match.string, sinon.match.number, sinon.match.string, 3, purchaseFactory.purchase.billingAddress);
    });

    it("should call set correct currency & billing period values", function() {
      purchaseFactory.getEstimate();

      storeService.calculateTaxes.should.have.been.calledWith("id", "productCode-" + "usd" + "01m", 5, RPP_ADDON_ID + "-" + "usd" + "01m" + "pro", 3, purchaseFactory.purchase.billingAddress);

      purchaseFactory.purchase.billingAddress.country = "CA";
      purchaseFactory.purchase.plan.isMonthly = false;

      purchaseFactory.getEstimate();

      storeService.calculateTaxes.should.have.been.calledWith("id", "productCode-" + "cad" + "01y", 5, RPP_ADDON_ID + "-" + "cad" + "01y" + "pro", 3, purchaseFactory.purchase.billingAddress);
    });

    it("should populate estimate object if call succeeds", function(done) {
      purchaseFactory.purchase.plan.name = "myPlan";
      purchaseFactory.purchase.plan.displays = 3;
      purchaseFactory.purchase.paymentMethods = {paymentMethod: "card"};

      purchaseFactory.getEstimate()
      .then(function() {
        expect(purchaseFactory.purchase.estimate).to.deep.equal({
          currency: "usd",
          taxesCalculated: true,
          taxes: [],
          total: "total",
          subTotal: "subTotal",
          couponAmount: "couponAmount",
          totalTax: "totalTax",
          shippingTotal: "shippingTotal",
        }, "not deep equal");

        expect(purchaseFlowTracker.trackPlaceOrderClicked).to.have.been.calledWith({
          currency: "usd",
          discount: "couponAmount",
          displaysCount: 3,
          paymentMethod: "card",
          paymentTerm: "monthly",
          revenueTotal: "total",
          subscriptionPlan: "myPlan"
        });

        done();
      })
      .then(null,function(e) {
        console.error(e);
        done("error");
      });
    });

    it("should set estimate currency to CAD", function(done) {
      purchaseFactory.purchase.billingAddress.country = "CA";

      purchaseFactory.purchase.plan.name = "myPlan";
      purchaseFactory.purchase.plan.displays = 3;
      purchaseFactory.purchase.paymentMethods = {paymentMethod: "card"};

      purchaseFactory.getEstimate()
      .then(function() {
        expect(purchaseFactory.purchase.estimate.currency).to.equal("cad");

        done();
      })
      .then(null,function(e) {
        console.error(e);
        done("error");
      });
    });

    it("should show estimate error if call fails", function(done) {
      purchaseFactory.purchase.estimate = {};
      validate = false;

      purchaseFactory.getEstimate()
      .then(function() {
        expect(purchaseFactory.purchase.estimate.estimateError).to.equal("An unexpected error has occurred. Please try again.");
      
        done();
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should clear previous estimate on success", function(done) {
      purchaseFactory.purchase.estimate = {
        price: 'previousEstimate'
      };

      purchaseFactory.getEstimate()
      .then(function() {
        expect(purchaseFactory.purchase.estimate.price).to.not.be.ok;
      
        done();
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should not clear previous estimate on error", function(done) {
      purchaseFactory.purchase.estimate = {
        price: 'previousEstimate'
      };
      validate = false;

      purchaseFactory.getEstimate()
      .then(function() {
        expect(purchaseFactory.purchase.estimate.price).to.equal("previousEstimate");
      
        done();
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should start and stop spinner", function(done) {
      purchaseFactory.getEstimate();

      expect(purchaseFactory.loading).to.be.true;

      setTimeout(function() {
        expect(purchaseFactory.loading).to.be.false;

        done();
      }, 10);
    });

  });

  describe("completePayment: ", function() {
    beforeEach(function() {
      validate = true;

      purchaseFactory.purchase = {
        billingAddress: {
          id: "id",
          street: "billingStreet",
          country: "CA"
        },
        plan: {
          name: "myPlan",
          isMonthly: true,
          productCode: "productCode",
          monthly: {
            billAmount: 27
          },
          yearly: {
            priceDisplayYear: 99
          },
          additionalDisplayLicenses: 3,
          displays: 3
        },
        paymentMethods: {
          paymentMethod: "card",
          selectedCard: {
            id: "cardId",
            isDefault: true,
            junkProperty: "junkValue"
          },
          purchaseOrderNumber: "purchaseOrderNumber"
        },
        estimate: {
          currency: "usd",
          total: "total",
          couponAmount: "couponAmount"
        }
      };

      sinon.spy($rootScope, "$emit");

    });

    it("should clear checkout errors", function() {
      purchaseFactory.purchase.checkoutError = "error";
      purchaseFactory.completePayment();

      expect(purchaseFactory.purchase.checkoutError).to.not.be.ok;
    });

    it("should call purchase api and return a promise", function() {
      expect(purchaseFactory.completePayment().then).to.be.a("function");

      storeService.purchase.should.have.been.called;
      storeService.purchase.should.have.been.calledWith(sinon.match.string);
    });

    it("should call purchase with a JSON string", function() {
      purchaseFactory.purchase.paymentMethods.intentResponse = {intentId: "test"};
      purchaseFactory.purchase.paymentMethodResponse = {paymentMethod: {id: "test"}};
      purchaseFactory.completePayment();

      storeService.purchase.should.have.been.called;
      storeService.purchase.should.have.been.calledWith(JSON.stringify({
        billTo: {
          id: "id",
          street: "billingStreet",
          country: "CA"
        },
        shipTo: {
          id: "id",
          street: "billingStreet",
          country: "CA"
        },
        items: [{
          id: "productCode-cad01m",
          qty: 3
        } , {
          id: "c4b368be86245bf9501baaa6e0b00df9719869fd-cad01mpro",
          qty: 3
        }],
        purchaseOrderNumber: "purchaseOrderNumber",
        card: {
          cardId: "cardId",
          intentId: "test",
          isDefault: true
        },
        paymentMethodId: null
      }));

    });

    it("should populate card isDefault value if missing", function() {
      delete purchaseFactory.purchase.paymentMethods.selectedCard.isDefault;
      purchaseFactory.completePayment();

      expect(storeService.purchase.getCall(0).args[0]).to.contain("\"isDefault\":false");
    });

    it("should not add card for onAccount", function() {
      purchaseFactory.purchase.paymentMethods.paymentMethod = "invoice";
      purchaseFactory.completePayment();

      expect(storeService.purchase.getCall(0).args[0]).to.contain("\"card\":null");
    });

    it("should populate checkout success object if call succeeds", function(done) {
      purchaseFactory.completePayment()
      .then(function() {
        expect(purchaseFactory.purchase.checkoutError).to.not.be.ok;
        expect(purchaseFlowTracker.trackOrderPayNowClicked).to.have.been.calledWith({
          currency: "usd",
          discount: "couponAmount",
          displaysCount: 3,
          paymentMethod: "card",
          paymentTerm: "monthly",
          revenueTotal: "total",
          subscriptionPlan: "myPlan"
        });

        done();
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should reloadSelectedCompany on purchase", function(done) {
      purchaseFactory.completePayment()
      .then(function() {
        expect(purchaseFactory.purchase.reloadingCompany).to.be.true;
        userState.reloadSelectedCompany.should.not.have.been.called;

        $timeout.flush(10000);
        setTimeout(function() {
          userState.reloadSelectedCompany.should.have.been.called;

          setTimeout(function() {
            $rootScope.$emit.should.have.been.calledWith("risevision.company.planStarted");
            expect(purchaseFactory.purchase.reloadingCompany).to.be.false;

            done();
          }, 10);
        }, 10);
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should handle failure to reloadSelectedCompany", function(done) {
      purchaseFactory.completePayment()
      .then(function() {
        expect(purchaseFactory.purchase.reloadingCompany).to.be.true;
        userState.reloadSelectedCompany.should.not.have.been.called;

        validate = false;
        $timeout.flush(10000);
        setTimeout(function() {
          userState.reloadSelectedCompany.should.have.been.called;

          setTimeout(function() {
            $rootScope.$emit.should.not.have.been.called;
            expect(purchaseFactory.purchase.reloadingCompany).to.be.false;

            done();
          }, 10);
        }, 10);
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should show payment error if call fails", function(done) {
      validate = false;

      purchaseFactory.completePayment()
      .then(function() {
        expect(purchaseFactory.purchase.checkoutError).to.equal("There was an unknown error with the payment.");

        done();
      })
      .then(null,function() {
        done("error");
      });
    });

    it("should start and stop spinner", function(done) {
      purchaseFactory.completePayment();

      expect(purchaseFactory.loading).to.be.true;

      setTimeout(function() {
        expect(purchaseFactory.loading).to.be.false;

        done();
      }, 10);
    });

  });

});
