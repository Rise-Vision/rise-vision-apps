import {expect} from 'chai';
import { TestBed } from '@angular/core/testing';

import { PurchaseService } from './purchase.service';
import { assert } from 'sinon';
import { UserState, StoreService, AddressService, ContactService, PurchaseFlowTracker, PlansService } from 'src/app/ajs-upgraded-providers';
import { CreditCardService } from './credit-card.service';

describe('PurchaseService', () => {
  let purchaseFactory: PurchaseService;
  let $rootScope, creditCardFactory, userState, storeService, addressService, contactService, plansService, purchaseFlowTracker, validate;

  beforeEach(() => {

    $rootScope = {
      $emit: sinon.stub()
    };

    plansService = {
      getVolumePlan: sinon.stub().returns({
        type: 'volume',
        productId: 'productId',
        productCode: 'productCode',
        yearly: {
          billAmount: 'yearlyBillAmount'
        },
        monthly: {
          billAmount: 'monthlyBillAmount'
        }
      }),
      getUnlimitedPlan: sinon.stub().returns({
        name: 'Unlimited License',
        type: 'unlimited',
        productId: 'unlimitedProductId',
        productCode: 'unlimitedProductCode',
        yearly: {
          billAmount: 'unlimitedYearlyBillAmount'
        }
      })
    };
    
    userState = {
      getCopyOfSelectedCompany: sinon.stub().returns({
        id: "id",
        street: "billingStreet",
      }),
      getCopyOfProfile: sinon.stub().returns({
        username: "username",
        uselessProperty: "value"
      }),
      reloadSelectedCompany: sinon.stub().resolves("success"),
      getSelectedCompanyId: sinon.stub().returns('selectedCompany')
    };

    storeService = {
      calculateTaxes: sinon.spy(function() {
        if (validate) {``
          return Promise.resolve({
            result: true,
            taxes: [],
            total: "total",
            totalTax: "totalTax",
            couponAmount: "couponAmount",
            subTotal: "subTotal",
            shippingTotal: "shippingTotal"
          });
        } else {
          return Promise.reject();
        }
      }),
      preparePurchase: sinon.stub().returns(Promise.resolve('intentResponse')),
      purchase: sinon.spy(function() {
        if (validate) {
          return Promise.resolve("success");
        } else {
          return Promise.reject();
        }
      })
    };

    creditCardFactory = {
      initPaymentMethods: sinon.stub().returns(Promise.resolve()),
      validatePaymentMethod: sinon.stub().returns(Promise.resolve({})),
      handleCardAction: sinon.stub().returns(Promise.resolve()),
      paymentMethods: {
        newCreditCard: {}
      },
      getPaymentMethodId: sinon.stub().returns('paymentMethodId')
    };

    purchaseFlowTracker = {
      trackProductAdded: sinon.stub(),
      trackPlaceOrderClicked: sinon.stub(),
      trackOrderPayNowClicked: sinon.stub()
    };
    
    addressService = {
      copyAddress: function (src, dest) {
        if (!dest) {
          dest = {};
        }
        dest.id = src.id;
        dest.name = src.name;
        dest.street = src.street;
        dest.unit = src.unit;
        dest.city = src.city;
        dest.country = src.country;
        dest.postalCode = src.postalCode;
        dest.province = src.province;
        return dest;
      }
    };

    contactService = {
      copyContactObj: function (src, dest) {
        if (!dest) {
          dest = {};
        }

        dest.username = src.username;
        dest.firstName = src.firstName;
        dest.lastName = src.lastName;
        dest.email = src.email;
        dest.telephone = src.telephone;

        return dest;
      }
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: '$rootScope', useValue: $rootScope},
        {provide: UserState, useValue: userState},
        {provide: StoreService, useValue: storeService},
        {provide: AddressService, useValue: addressService},
        {provide: ContactService, useValue: contactService},
        {provide: CreditCardService, useValue: creditCardFactory},
        {provide: PurchaseFlowTracker, useValue: purchaseFlowTracker},
        {provide: PlansService, useValue: plansService}
      ]
    });
    purchaseFactory = TestBed.inject(PurchaseService);
  });


  it("should exist", function() {
    expect(purchaseFactory).to.be.ok;
    expect(purchaseFactory.init).to.be.a("function");
    expect(purchaseFactory.pickUnlimitedPlan).to.be.a("function");
    expect(purchaseFactory.pickVolumePlan).to.be.a("function");
    expect(purchaseFactory.validatePaymentMethod).to.be.a("function");
    expect(purchaseFactory.getEstimate).to.be.a("function");
    expect(purchaseFactory.completePayment).to.be.a("function");
  });

  it("should stop spinner on load", function() {
    expect(purchaseFactory.loading).to.be.false;
  });

  describe("init: ", function() {

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

      expect(purchaseFactory.purchase.estimate).to.deep.equal({});
    });

    it("should initialize payment methods", function(done) {
      purchaseFactory.init();
      
      creditCardFactory.initPaymentMethods.should.have.been.calledWith(false);

      setTimeout(function() {
        expect(purchaseFactory.purchase).to.be.ok;
        expect(creditCardFactory.paymentMethods).to.be.ok;
        expect(creditCardFactory.paymentMethods.paymentMethod).to.equal("card");
        
        expect(creditCardFactory.paymentMethods.newCreditCard.billingAddress).to.equal(purchaseFactory.purchase.billingAddress);

        done();
      }, 10);
    });

    describe('invoiceDate:', function() {
      var clock;
      var currentDate;

      beforeEach(function() {
        currentDate = new Date('Jan 1, 2021');
        clock = sinon.useFakeTimers(currentDate);
      });

      afterEach(function() {
        clock.restore();
      });

      it("should initialize invoice due date 30 days from now", function(done) {
        purchaseFactory.init()
          .then(function() {
            expect(creditCardFactory.paymentMethods.invoiceDate).to.be.ok;
            expect(creditCardFactory.paymentMethods.invoiceDate).to.be.a("date");
            expect(creditCardFactory.paymentMethods.invoiceDate - currentDate).to.equal(30 * 24 * 60 * 60 * 1000);
            done();            
          });
      });

    });
  });

  describe("pickUnlimitedPlan:", function() {
    it("should update plan with new details", function() {
      purchaseFactory.init();

      purchaseFactory.pickUnlimitedPlan();

      expect(purchaseFactory.purchase.plan).to.be.ok;
      expect(purchaseFactory.purchase.plan.name).to.equal("Unlimited License");
      expect(purchaseFactory.purchase.plan.productId).to.equal("unlimitedProductId");
      expect(purchaseFactory.purchase.plan.productCode).to.equal("unlimitedProductCode");
      expect(purchaseFactory.purchase.plan.isMonthly).to.be.false;
      expect(purchaseFactory.purchase.plan.yearly.billAmount).to.equal("unlimitedYearlyBillAmount");
      expect(purchaseFactory.purchase.plan.displays).to.not.exist;

      purchaseFlowTracker.trackProductAdded.should.have.been.calledWith(purchaseFactory.purchase.plan);
    });
  });

  describe("pickVolumePlan:", function() {
    it("should update plan with new details", function() {
      purchaseFactory.init();

      purchaseFactory.pickVolumePlan(2,false,242);

      expect(purchaseFactory.purchase.plan).to.be.ok;
      expect(purchaseFactory.purchase.plan.name).to.equal("2 Display Licenses (Yearly)");
      expect(purchaseFactory.purchase.plan.displays).to.equal(2)
      expect(purchaseFactory.purchase.plan.isMonthly).to.be.false;
      expect(purchaseFactory.purchase.plan.yearly.billAmount).to.equal(242);

      purchaseFlowTracker.trackProductAdded.should.have.been.calledWith(purchaseFactory.purchase.plan);
    });

    it("should update monthly plan with new details", function() {
      purchaseFactory.init();

      purchaseFactory.pickVolumePlan(1,true,11);

      expect(purchaseFactory.purchase.plan).to.be.ok;
      expect(purchaseFactory.purchase.plan.name).to.equal("1 Display License (Monthly)");
      expect(purchaseFactory.purchase.plan.displays).to.equal(1)
      expect(purchaseFactory.purchase.plan.isMonthly).to.be.true;
      expect(purchaseFactory.purchase.plan.monthly.billAmount).to.equal(11);

      purchaseFlowTracker.trackProductAdded.should.have.been.calledWith(purchaseFactory.purchase.plan);
    });
  });

  describe("validatePaymentMethod: ", function() {
    beforeEach(function() {
      purchaseFactory.purchase = {};
    });

    it("should validate and resolve", function(done) {
      creditCardFactory.paymentMethods.paymentMethod = "invoice";

      purchaseFactory.validatePaymentMethod()
        .then(function() {
          done();
        })
        .then(null, function() {
          assert.fail("error");
        });
    });

    it("should clear errors", function() {
      purchaseFactory.purchase.checkoutError = "checkoutError";

      purchaseFactory.validatePaymentMethod();

      expect(purchaseFactory.purchase.checkoutError).to.not.be.ok;
    });

    describe("card:", function() {

      beforeEach(function() {
        creditCardFactory.paymentMethods.paymentMethod = "card";
      });

      it("should start and stop spinner", function(done) {
        purchaseFactory.validatePaymentMethod();

        expect(purchaseFactory.loading).to.be.true;

        setTimeout(function() {
          expect(purchaseFactory.loading).to.be.false;

          done();
        }, 10);
      });

      it("should validate card and proceed to next step", function() {
        purchaseFactory.validatePaymentMethod();

        creditCardFactory.validatePaymentMethod.should.have.been.called;
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

      storeService.calculateTaxes.should.have.been.calledWith("id", "productCode-" + "usd" + "01m", 5, PurchaseService.RPP_ADDON_ID + "-" + "usd" + "01m" + "pro", 3, purchaseFactory.purchase.billingAddress);

      purchaseFactory.purchase.billingAddress.country = "CA";
      purchaseFactory.purchase.plan.isMonthly = false;

      purchaseFactory.getEstimate();

      storeService.calculateTaxes.should.have.been.calledWith("id", "productCode-" + "cad" + "01y", 5, PurchaseService.RPP_ADDON_ID + "-" + "cad" + "01y" + "pro", 3, purchaseFactory.purchase.billingAddress);
    });

    it("should populate estimate object if call succeeds", function(done) {
      purchaseFactory.purchase.plan.name = "myPlan";
      purchaseFactory.purchase.plan.displays = 3;
      creditCardFactory.paymentMethods.paymentMethod = "card";

      purchaseFactory.getEstimate()
      .then(function() {
        expect(purchaseFactory.purchase.estimate).to.deep.equal({
          currency: "usd",
          taxesCalculated: true,
          taxes: [],
          total: "total",
          subTotal: "subTotal",
          coupons: [],
          couponAmount: "couponAmount",
          totalTax: "totalTax",
          shippingTotal: "shippingTotal",
        }, "not deep equal");

        purchaseFlowTracker.trackPlaceOrderClicked.should.have.been.calledWith({
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
        assert.fail("error");
      });
    });

    it("should set estimate currency to CAD", function(done) {
      purchaseFactory.purchase.billingAddress.country = "CA";

      purchaseFactory.purchase.plan.name = "myPlan";
      purchaseFactory.purchase.plan.displays = 3;
      creditCardFactory.paymentMethods.paymentMethod = "card";

      purchaseFactory.getEstimate()
      .then(function() {
        expect(purchaseFactory.purchase.estimate.currency).to.equal("cad");

        done();
      })
      .then(null,function(e) {
        console.error(e);
        assert.fail("error");
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
        assert.fail("error");
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
        assert.fail("error");
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
        assert.fail("error");
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

  describe('preparePaymentIntent:', function() {
    beforeEach(function() {
      purchaseFactory.purchase = {
        billingAddress: {},
        plan: {
          productCode: "productCode",
        },
        estimate: {}
      };

      creditCardFactory.paymentMethods = {
        paymentMethod: "card",
        selectedCard: {
          id: "cardId",
        },
      };

    });

    it('should resolve right away for invoice', function(done) {
      creditCardFactory.paymentMethods.paymentMethod = "invoice";

      purchaseFactory.preparePaymentIntent()
        .then(function() {
          storeService.preparePurchase.should.not.have.been.calledWith(sinon.match.string);

          done();
        });
    });

    it('should call api, show spinner and reset errors', function() {
      purchaseFactory.preparePaymentIntent();

      storeService.preparePurchase.should.have.been.called;

      expect(purchaseFactory.loading).to.be.true;
    });

    it('should prepare payment intent, and resolve', function(done) {
      purchaseFactory.preparePaymentIntent()
        .then(function() {
          expect(purchaseFactory.loading).to.be.false;

          creditCardFactory.handleCardAction.should.not.have.been.called;

          expect(creditCardFactory.paymentMethods.intentResponse).to.equal('intentResponse');

          done();
        });
    });

    it('should handle failure to prepare payment intent', function(done) {
      storeService.preparePurchase.returns(Promise.resolve({error: {message: 'errorMessage'}}));

      purchaseFactory.preparePaymentIntent()
        .catch(function() {
          expect(purchaseFactory.loading).to.be.false;
          expect(purchaseFactory.purchase.checkoutError).to.equal('errorMessage');

          done();
        });
    });

    it('should handle rejection to prepare payment intent', function(done) {
      storeService.preparePurchase.returns(Promise.reject('error'));

      purchaseFactory.preparePaymentIntent()
        .catch(function() {
          expect(purchaseFactory.loading).to.be.false;
          expect(purchaseFactory.purchase.checkoutError).to.contain('please retry');

          done();
        });
    });

    describe('handleCardAction:', function() {
      it('should handleCardAction if authentication is required', function(done) {
        storeService.preparePurchase.returns(Promise.resolve({
          authenticationRequired: true,
          intentSecret: 'intentSecret'
        }));

        purchaseFactory.preparePaymentIntent()
          .then(function() {
            creditCardFactory.handleCardAction.should.have.been.calledWith('intentSecret');

            done();
          });
      });

      it('should handle failure to handleCardAction', function(done) {
        storeService.preparePurchase.returns(Promise.resolve({
          authenticationRequired: true,
          intentSecret: 'intentSecret'
        }));
        creditCardFactory.handleCardAction.returns(Promise.reject({message: 'error'}));

        purchaseFactory.preparePaymentIntent()
          .catch(function() {
            expect(purchaseFactory.loading).to.be.false;
            expect(purchaseFactory.purchase.checkoutError).to.equal('error');

            done();
          });
      });
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
        estimate: {
          currency: "usd",
          total: "total",
          couponAmount: "couponAmount"
        }
      };

      creditCardFactory.paymentMethods = {
        paymentMethod: "card",
        selectedCard: {
          id: "cardId",
          isDefault: true,
          junkProperty: "junkValue"
        },
        purchaseOrderNumber: "purchaseOrderNumber"
      };

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
      creditCardFactory.paymentMethods.intentResponse = {intentId: "test"};
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
        paymentMethodId: "paymentMethodId"
      }));

    });

    it("should populate card isDefault value if missing", function() {
      delete creditCardFactory.paymentMethods.selectedCard.isDefault;
      purchaseFactory.completePayment();

      expect(storeService.purchase.getCall(0).args[0]).to.contain("\"isDefault\":false");
    });

    it("should not add card for onAccount", function() {
      creditCardFactory.paymentMethods.paymentMethod = "invoice";
      purchaseFactory.completePayment();

      expect(storeService.purchase.getCall(0).args[0]).to.contain("\"card\":null");
    });

    it("should populate checkout success object if call succeeds", function(done) {
      purchaseFactory.completePayment()
      .then(function() {
        expect(purchaseFactory.purchase.checkoutError).to.not.be.ok;
        purchaseFlowTracker.trackOrderPayNowClicked.should.have.been.calledWith({
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
        assert.fail("error");
      });
    });

    it("should reloadSelectedCompany on purchase", function(done) {
      sinon.stub(purchaseFactory,'_wait').resolves();

      purchaseFactory.completePayment()
      .then(function() {
        expect(purchaseFactory.purchase.reloadingCompany).to.be.true;

        setTimeout(function() {
          userState.reloadSelectedCompany.should.have.been.called;

          setTimeout(function() {
            $rootScope.$emit.should.have.been.calledWith("risevision.company.planStarted");
            expect(purchaseFactory.purchase.reloadingCompany).to.be.false;

            done();
          }, 10);
        }, 10);
      })
      .then(null,function(e) {
        assert.fail("error");
      });
    });

    it("should handle failure to reloadSelectedCompany", function(done) {
      sinon.stub(purchaseFactory,'_wait').resolves();
      userState.reloadSelectedCompany.rejects();

      purchaseFactory.completePayment()
      .then(function() {
        expect(purchaseFactory.purchase.reloadingCompany).to.be.true;

        validate = false;
        setTimeout(function() {
          userState.reloadSelectedCompany.should.have.been.called;

          setTimeout(function() {
            $rootScope.$emit.should.not.have.been.called;
            expect(purchaseFactory.purchase.reloadingCompany).to.be.false;

            done();
          }, 10);
        }, 10);
      })
      .then(null,function(e) {
        assert.fail(e);
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
        assert.fail("error");
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
