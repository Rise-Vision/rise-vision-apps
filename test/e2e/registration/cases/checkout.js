(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var HomePage = require('./../../common/pages/homepage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');
  var PurchaseFlowPage = require('./../pages/purchaseFlowPage.js');
  var PricingPage = require('./../pages/pricingPage.js');
  var AccountBillingPage = require('./../../billing/pages/accountBillingPage.js');
  var InvoicePage = require('./../../billing/pages/invoicePage.js');
  var PresentationListPage = require('./../../editor/pages/presentationListPage.js');

  var Checkout = function() {

    describe("Checkout", function() {
      var commonHeaderPage,
        homepage,
        signInPage,
        purchaseFlowPage,
        pricingPage,
        accountBillingPage,
        invoicePage,
        presentationListPage;

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        signInPage = new SignInPage();
        purchaseFlowPage = new PurchaseFlowPage();
        pricingPage = new PricingPage();
        accountBillingPage = new AccountBillingPage();
        invoicePage = new InvoicePage();
        presentationListPage = new PresentationListPage();

        homepage.get();

        signInPage.customAuthSignIn(commonHeaderPage.getStageEmailAddress(), commonHeaderPage.getPassword());
      });

      describe("checkout: ", function() {
        before(function() {
          helper.waitDisappear(presentationListPage.getPresentationsLoader(), 'Home Page Loader');
        });

        it("should show Subscribe button", function() {
          expect(purchaseFlowPage.getPlanSubscribeLink().isDisplayed()).to.eventually.be.true;
        });

        it("should open plans page", function() {

          helper.clickWhenClickable(purchaseFlowPage.getPlanSubscribeLink(), 'Subscribe Button');

          helper.wait(pricingPage.getSubscribeButton(), 'Pricing Component Modal');

          expect(pricingPage.getSubscribeButton().isDisplayed()).to.eventually.be.true;
        });

        it("should open checkout page", function() {
          helper.clickWhenClickable(pricingPage.getSubscribeButton(), 'Subscribe Button');

          helper.waitDisappear(pricingPage.getSubscribeButton(), 'Subscribe Button Disappear');

          expect(purchaseFlowPage.getContinueButton().isDisplayed()).to.eventually.be.true;
        });
      });

      describe("billing address: ", function() {
        it("should show billing address form", function() {
          helper.waitForSpinner();
          helper.wait(purchaseFlowPage.getBillingAddressPage(), 'Purchase flow Billing');

          expect(purchaseFlowPage.getBillingAddressPage().isDisplayed()).to.eventually.be.true;
          expect(purchaseFlowPage.getEmailField().isDisplayed()).to.eventually.be.true;

          expect(purchaseFlowPage.getReviewEstimatePage().isDisplayed()).to.eventually.be.true;
        });

        it("should fill out billing address", function() {
          purchaseFlowPage.getStreet().clear();
          purchaseFlowPage.getCity().clear();
          purchaseFlowPage.getPC().clear();
          purchaseFlowPage.getStreet().sendKeys('2967 Dundas St. W #632');
          purchaseFlowPage.getCity().sendKeys('Toronto');
          purchaseFlowPage.getCountry().sendKeys('Can');
          purchaseFlowPage.getProv().sendKeys('O');
          purchaseFlowPage.getPC().sendKeys('M6P 1Z2');
        });

        it("should submit billing address", function() {
          browser.sleep(1000);
          helper.clickWhenClickable(purchaseFlowPage.getContinueButton(), 'Submit Billing Address');
          helper.waitForSpinner();
          helper.waitDisappear(purchaseFlowPage.getBillingAddressPage(), 'Purchase flow Billing');
        });

      });

      describe("payment form: ", function() {
        it("should show payment form and default to credit card", function() {
          helper.waitForSpinner();
          helper.wait(purchaseFlowPage.getPaymentMethodsPage(), 'Payment Methods Page');

          expect(purchaseFlowPage.getPaymentMethodsPage().isDisplayed()).to.eventually.be.true;
        });

        it("should show credit card form by default", function() {
          expect(purchaseFlowPage.getNewCreditCardForm().isDisplayed()).to.eventually.be.true;
          expect(purchaseFlowPage.getCardName().isDisplayed()).to.eventually.be.true;

          expect(purchaseFlowPage.getPaymentMethodSelected().getText()).to.eventually.contain('Credit Card');

          expect(purchaseFlowPage.getPayButton().isDisplayed()).to.eventually.be.true;
        });

        it("should switch to invoice me form", function() {
          purchaseFlowPage.getPaymentMethodInvoiceMe().click();

          expect(purchaseFlowPage.getPaymentMethodSelected().getText()).to.eventually.contain('Invoice Me');

          expect(purchaseFlowPage.getGenerateInvoiceForm().isDisplayed()).to.eventually.be.true;

          expect(purchaseFlowPage.getInvoiceButton().isDisplayed()).to.eventually.be.true;

          console.log('Purchase using Invoice Me');
        });

        xit("should purchase using credit card", function() {
          purchaseFlowPage.getPaymentMethodCreditCard().click();

          expect(purchaseFlowPage.getPaymentMethodSelected().getText()).to.eventually.equal('Credit Card');

          expect(purchaseFlowPage.getNewCreditCardForm().isDisplayed()).to.eventually.be.true;

          console.log('Purchase using Credit Card');
          purchaseFlowPage.getCardName().sendKeys('AAA');
          purchaseFlowPage.getCardNumber().sendKeys('4242424242424242');
          purchaseFlowPage.getCardExpMon().sendKeys('0');
          purchaseFlowPage.getCardExpYr().sendKeys('222');
          purchaseFlowPage.getCardCVS().sendKeys('222');
        });

      });

      describe("purchase: ", function() {
        it("should purchase",function() {
          expect(purchaseFlowPage.getReviewPurchasePage().isDisplayed()).to.eventually.be.true;

          browser.sleep(1000);

          helper.clickWhenClickable(purchaseFlowPage.getInvoiceButton(), 'Purchase flow Invoice Button');

          helper.waitForSpinner();
          helper.waitDisappear(purchaseFlowPage.getReviewPurchasePage(), 'Review Purchase Page');

        });

        it("should show checkout success page", function() {
          helper.waitForSpinner();
          helper.wait(purchaseFlowPage.getCheckoutSuccessPage(), 'Checkout Success Page');

          expect(purchaseFlowPage.getCheckoutSuccessPage().isDisplayed()).to.eventually.be.true;
          expect(purchaseFlowPage.getCheckoutDoneButton().isDisplayed()).to.eventually.be.true;

          helper.clickWhenClickable(purchaseFlowPage.getCheckoutDoneButton(), 'Checkout Done Button');

          helper.waitForSpinner();
          helper.waitDisappear(purchaseFlowPage.getCheckoutSuccessPage(), 'Checkout Success Page');

          console.log('Purchase complete');
        });

        it("should close purchase flow and hide plan bar", function() {
          purchaseFlowPage.waitForPlanUpdate();
        });

        it("should no longer show the subscribe link", function() {
          expect(purchaseFlowPage.getPlanSubscribeLink().isPresent()).to.eventually.be.false;
        });

      });

      describe("invoice details: ", function() {
        it("should allow selecting Account & Billing menu option", function() {
          commonHeaderPage.openProfileMenu();
          homepage.getAccountBillingButton().click();

          helper.waitDisappear(accountBillingPage.getLoader(), "Account & Billing Page");
        });

        it("shows invoices list table", function() {
          expect(accountBillingPage.getInvoicesListTable().isPresent()).to.eventually.be.true;
        });

        it("shows pay now button", function() {
          expect(accountBillingPage.getPayNowButton().isPresent()).to.eventually.be.true;
        });

        it("navigates to unauthenticated invoice page", function() {
          accountBillingPage.getPayNowButton().getAttribute('href').then(function(href) {
            return browser.get(href);
          });

          helper.waitDisappear(invoicePage.getLoader(), "Invoice Page");
        });

        it("shows unauthenticated invoice", function() {
          expect(invoicePage.getInvoiceContainer().isPresent()).to.eventually.be.true;
        })

        it("shows invoice title", function() {
          expect(invoicePage.getInvoiceTitle().isPresent()).to.eventually.be.true;
        })

        it("shows share button", function() {
          expect(invoicePage.getShareButton().isPresent()).to.eventually.be.true;
        })

        it("shows download button", function() {
          expect(invoicePage.getDownloadButton().isPresent()).to.eventually.be.true;
        })

        it("shows pay now button", function() {
          expect(invoicePage.getPayNowButton().isPresent()).to.eventually.be.true;
        })
      });

      after(function() {
        commonHeaderPage.signOut(true);
      });

    });
  };

  module.exports = Checkout;

})();
