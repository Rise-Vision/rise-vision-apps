(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var HomePage = require('./../../common/pages/homepage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');
  var PurchaseFlowModalPage = require('./../pages/purchaseFlowModalPage.js');
  var PricingComponentModalPage = require('./../pages/pricingComponentModalPage.js');
  var PresentationListPage = require('./../../editor/pages/presentationListPage.js');

  var Checkout = function() {

    describe("Checkout", function() {
      var commonHeaderPage, 
        homepage, 
        signInPage,
        purchaseFlowModalPage,
        pricingComponentModalPage,
        presentationListPage;
                
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        signInPage = new SignInPage();
        purchaseFlowModalPage = new PurchaseFlowModalPage();
        pricingComponentModalPage = new PricingComponentModalPage();
        presentationListPage = new PresentationListPage();

        homepage.get();

        signInPage.customAuthSignIn(commonHeaderPage.getStageEmailAddress(), commonHeaderPage.getPassword());
      });

      describe("checkout: ", function() {
        before(function() {
          helper.waitDisappear(presentationListPage.getPresentationsLoader(), 'Home Page Loader');
        });

        it("should show Subscribe button", function() {
          expect(purchaseFlowModalPage.getPlanSubscribeLink().isDisplayed()).to.eventually.be.true;
        });

        it("should open plans modal", function() {

          helper.clickWhenClickable(purchaseFlowModalPage.getPlanSubscribeLink(), 'Subscribe Button');

          helper.wait(pricingComponentModalPage.getSubscribeButton(), 'Pricing Component Modal');

          expect(pricingComponentModalPage.getSubscribeButton().isDisplayed()).to.eventually.be.true;
        });

        it("should open checkout modal", function() {
          helper.clickWhenClickable(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button');
          
          helper.waitDisappear(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button Disappear');

          expect(purchaseFlowModalPage.getContinueButton().isDisplayed()).to.eventually.be.true;        
        });        
      });

      describe("billing address: ", function() {
        it("should show billing address form", function() {
          helper.waitForSpinner();
          helper.wait(purchaseFlowModalPage.getBillingAddressPage(), 'Purchase flow Billing');

          expect(purchaseFlowModalPage.getBillingAddressPage().isDisplayed()).to.eventually.be.true;
          expect(purchaseFlowModalPage.getEmailField().isDisplayed()).to.eventually.be.true;
        });

        it("should fill out billing address", function() {
          purchaseFlowModalPage.getStreet().clear();
          purchaseFlowModalPage.getCity().clear();
          purchaseFlowModalPage.getPC().clear();
          purchaseFlowModalPage.getStreet().sendKeys('2967 Dundas St. W #632');
          purchaseFlowModalPage.getCity().sendKeys('Toronto');
          purchaseFlowModalPage.getCountry().sendKeys('Can');
          purchaseFlowModalPage.getProv().sendKeys('O');
          purchaseFlowModalPage.getPC().sendKeys('M6P 1Z2');
        });

        it("should submit billing address", function() {
          browser.sleep(1000);
          helper.clickWhenClickable(purchaseFlowModalPage.getContinueButton(), 'Submit Billing Address');
          helper.waitForSpinner();
          helper.waitDisappear(purchaseFlowModalPage.getBillingAddressPage(), 'Purchase flow Billing');
        });
        
      });

      describe("payment form: ", function() {
        it("should show payment form and default to credit card", function() {
          helper.waitForSpinner();
          helper.wait(purchaseFlowModalPage.getPaymentMethodsPage(), 'Payment Methods Page');

          expect(purchaseFlowModalPage.getPaymentMethodsPage().isDisplayed()).to.eventually.be.true;
        });

        it("should show credit card form by default", function() {
          expect(purchaseFlowModalPage.getNewCreditCardForm().isDisplayed()).to.eventually.be.true;
          expect(purchaseFlowModalPage.getCardName().isDisplayed()).to.eventually.be.true;

          expect(purchaseFlowModalPage.getPaymentMethodSelected().getText()).to.eventually.equal('Credit Card');
        });

        it("should switch to invoice me form", function() {
          purchaseFlowModalPage.getPaymentMethodInvoiceMe().click();

          expect(purchaseFlowModalPage.getPaymentMethodSelected().getText()).to.eventually.equal('Invoice Me');

          expect(purchaseFlowModalPage.getGenerateInvoiceForm().isDisplayed()).to.eventually.be.true;

          console.log('Purchase using Invoice Me');
        });

        xit("should purchase using credit card", function() {
          purchaseFlowModalPage.getPaymentMethodCreditCard().click();

          expect(purchaseFlowModalPage.getPaymentMethodSelected().getText()).to.eventually.equal('Credit Card');

          expect(purchaseFlowModalPage.getNewCreditCardForm().isDisplayed()).to.eventually.be.true;

          console.log('Purchase using Credit Card');
          purchaseFlowModalPage.getCardName().sendKeys('AAA');
          purchaseFlowModalPage.getCardNumber().sendKeys('4242424242424242');
          purchaseFlowModalPage.getCardExpMon().sendKeys('0');
          purchaseFlowModalPage.getCardExpYr().sendKeys('222');
          purchaseFlowModalPage.getCardCVS().sendKeys('222');          
        });

        it("should submit payment form", function() {
          browser.sleep(1000);
          helper.clickWhenClickable(purchaseFlowModalPage.getContinueButton(), 'Purchase flow Payment');
          helper.waitForSpinner();
          helper.waitDisappear(purchaseFlowModalPage.getPaymentMethodsPage(), 'Payment Methods Page');
        });
      });

      describe("purchase: ", function() {
        it("should purchase",function() {
          helper.waitForSpinner();
          helper.wait(purchaseFlowModalPage.getReviewPurchasePage(), 'Review Purchase Page');

          expect(purchaseFlowModalPage.getReviewPurchasePage().isDisplayed()).to.eventually.be.true;

          // Wait for other responses to complete and update Chargebee address for the Company
          browser.sleep(10000);

          expect(purchaseFlowModalPage.getPayButton().isDisplayed()).to.eventually.be.true;

          helper.clickWhenClickable(purchaseFlowModalPage.getPayButton(), 'Purchase flow Pay Button');

          helper.waitForSpinner();
          helper.waitDisappear(purchaseFlowModalPage.getReviewPurchasePage(), 'Review Purchase Page');

        });

        it("should show checkout success page", function() {
          helper.waitForSpinner();
          helper.wait(purchaseFlowModalPage.getCheckoutSuccessPage(), 'Checkout Success Page');

          expect(purchaseFlowModalPage.getCheckoutSuccessPage().isDisplayed()).to.eventually.be.true;
          expect(purchaseFlowModalPage.getCheckoutDoneButton().isDisplayed()).to.eventually.be.true;

          helper.clickWhenClickable(purchaseFlowModalPage.getCheckoutDoneButton(), 'Checkout Done Button');
          
          helper.waitForSpinner();
          helper.waitDisappear(purchaseFlowModalPage.getCheckoutSuccessPage(), 'Checkout Success Page');

          console.log('Purchase complete');
        });

        it("should close purchase flow and hide plan bar", function() {
          purchaseFlowModalPage.waitForPlanUpdate();
        });

        it("should no longer show the subscribe link", function() {
          expect(purchaseFlowModalPage.getPlanSubscribeLink().isPresent()).to.eventually.be.false;
        });

      });

      after(function() {
        commonHeaderPage.signOut(true);
      });

    });
  };

  module.exports = Checkout;

})();
