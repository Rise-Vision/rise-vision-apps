(function() {

  "use strict";

  var MONETARY_VALUE_REGEX = /[$][\d,]+[.*]\d{2}/;
  var DISCOUNT_VALUE_REGEX = /-[$][\d,]+[.*]\d{2}/;

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var HomePage = require('./../../common/pages/homepage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');
  var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
  var AddDisplayLicensesPage = require('./../pages/addDisplayLicensesPage.js');
  var SubscriptionDetailsPage = require('./../pages/subscriptionDetailsPage.js');
  var AddPaymentMethodPage = require('./../pages/addPaymentMethodPage.js');
  var PurchaseLicensesSuccessPage = require('./../pages/purchaseLicensesSuccessPage.js');

  var SubscriptionEdit = function() {

    describe("SubscriptionEdit", function() {
      var commonHeaderPage,
        homepage,
        signInPage,
        presentationListPage,
        addDisplayLicensesPage,
        subscriptionDetailsPage,
        addPaymentMethodPage,
        purchaseLicensesSuccessPage,
        currentNextInvoice;

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        signInPage = new SignInPage();
        presentationListPage = new PresentationListPage();
        addDisplayLicensesPage = new AddDisplayLicensesPage();
        subscriptionDetailsPage = new SubscriptionDetailsPage();
        addPaymentMethodPage = new AddPaymentMethodPage();
        purchaseLicensesSuccessPage = new PurchaseLicensesSuccessPage();

        homepage.getDefaultSubscription();
        signInPage.customAuthSignIn(commonHeaderPage.getStageEmailAddress(), commonHeaderPage.getPassword());
      });

      describe("Subscription Details page", function() {
        it("should load subscription details", function() {
          helper.wait(subscriptionDetailsPage.getLoader(), "Subscription Details Page Loader", 5000)
            .catch(function (err) {
              console.log(err);
            });
          helper.waitDisappear(subscriptionDetailsPage.getLoader(), "Subscription Details Page Loader");

          expect(subscriptionDetailsPage.getDescriptionText().getText()).to.eventually.contain("5 x Display Licenses Yearly Plan");
        });

        it("should show subscription actions", function() {
          expect(subscriptionDetailsPage.getAddLicensesButton().isDisplayed()).to.eventually.be.true;
          expect(subscriptionDetailsPage.getRemoveLicensesButton().isDisplayed()).to.eventually.be.true;
          expect(subscriptionDetailsPage.getAddPaymentMethodButton().isDisplayed()).to.eventually.be.true;
        });

        it("should show Invoice Me as payment method", function() {
          expect(subscriptionDetailsPage.getInvoiceMeItem().isDisplayed()).to.eventually.be.true;  
          expect(subscriptionDetailsPage.getCreditCardItems().count()).to.eventually.equal(0);
        });
      });

      describe("Add Display Licenses:", function() {
        it("should navigate to Add Display Licenses page", function() {
          subscriptionDetailsPage.getAddLicensesButton().click();

          helper.wait(addDisplayLicensesPage.getLoader(), 'Display Licenses Page Loader', 5000)
            .catch(function (err) {
              console.log(err);
            });
          helper.waitDisappear(addDisplayLicensesPage.getLoader(), 'Display Licenses Page Loader');

          helper.wait(addDisplayLicensesPage.getPayButton(), 'Pay now button');

          expect(addDisplayLicensesPage.getPayButton().isDisplayed()).to.eventually.be.true;
        });
      });

      describe("estimate page: ", function() {

        it("should show display count input", function() {
          expect(addDisplayLicensesPage.getDisplayCountInput().isDisplayed()).to.eventually.be.true;
        });

        it("should show Add Display Licenses panel", function() {
          expect(addDisplayLicensesPage.getPurchaseLicensesPanel().isDisplayed()).to.eventually.be.true;
        });

        it("should show Back button", function() {
          expect(addDisplayLicensesPage.getBackButton().isDisplayed()).to.eventually.be.true;
        });

        it("should show Pay button", function() {
          expect(addDisplayLicensesPage.getPayButton().isDisplayed()).to.eventually.be.true;
        });

        it("should show Add Coupon Code link", function() {
          expect(addDisplayLicensesPage.getAddCouponCodeLink().isDisplayed()).to.eventually.be.true;
        });
      });

      describe("update display licenses: ", function() {
        it("should show prorated amount total output", function() {
          expect(addDisplayLicensesPage.getProratedAmountTotal().isDisplayed()).to.eventually.be.true;
        });

        it("should show next invoice total output", function() {
          expect(addDisplayLicensesPage.getNextInvoiceTotal().isDisplayed()).to.eventually.be.true;
        });

        it("should display a prorated amount", function() {
          expect(addDisplayLicensesPage.getProratedAmountTotal().getText()).to.eventually.match(MONETARY_VALUE_REGEX);
        });

        it("should display an invoice total amount", function(done) {
          expect(addDisplayLicensesPage.getNextInvoiceTotal().getText()).to.eventually.match(MONETARY_VALUE_REGEX);

          addDisplayLicensesPage.getNextInvoiceTotal().getText().then(function(value) {
            currentNextInvoice = value;
            done();
          });
        });

        it("should update estimation after display count update", function() {
          addDisplayLicensesPage.getDisplayCountInput().clear();
          addDisplayLicensesPage.getDisplayCountInput().sendKeys('2');

          helper.wait(addDisplayLicensesPage.getLoader(), 'Display Licenses Page Loader');
          helper.waitDisappear(addDisplayLicensesPage.getLoader(), 'Display Licenses Page Loader');
        });

        it("should calculate a different next invoice total", function(done) {
          expect(addDisplayLicensesPage.getProratedAmountTotal().getText()).to.eventually.match(MONETARY_VALUE_REGEX);
          expect(addDisplayLicensesPage.getNextInvoiceTotal().getText()).to.eventually.match(MONETARY_VALUE_REGEX);

          addDisplayLicensesPage.getNextInvoiceTotal().getText().then(function(value) {
            expect(value).to.not.equal(currentNextInvoice);

            done();
          });
        });
      });

      describe("coupon: ", function() {
        it("should not show the coupon rows", function() {
          expect(addDisplayLicensesPage.getCouponRows().count()).to.eventually.equal(0);
        });

        it("should display coupon code field", function() {
          addDisplayLicensesPage.getAddCouponCodeLink().click();

          expect(addDisplayLicensesPage.getCouponCodeInput().isDisplayed()).to.eventually.be.true;
        });

        it("should display apply coupon code button", function() {
          expect(addDisplayLicensesPage.getApplyCouponCodeButton().isDisplayed()).to.eventually.be.true;
        });

        it("should display cancel coupon code link", function() {
          expect(addDisplayLicensesPage.getCancelCouponCodeLink().isDisplayed()).to.eventually.be.true;
        });

        it("should cancel the coupon code edition", function() {
          addDisplayLicensesPage.getCancelCouponCodeLink().click();

          expect(addDisplayLicensesPage.getAddCouponCodeLink().isDisplayed()).to.eventually.be.true;
          expect(addDisplayLicensesPage.getCouponCodeInput().isDisplayed()).to.eventually.be.false;
        });

        it("should display coupon code field - again", function() {
          addDisplayLicensesPage.getAddCouponCodeLink().click();

          expect(addDisplayLicensesPage.getCouponCodeInput().isDisplayed()).to.eventually.be.true;
        });
      });

      describe("update subscription: ", function() {
        it("should show Pay button", function() {
          expect(addDisplayLicensesPage.getPayButton().isDisplayed()).to.eventually.be.true;
        });

        it("should go to purchase licenses success page after payment", function() {
          addDisplayLicensesPage.getPayButton().click();

          helper.wait(purchaseLicensesSuccessPage.getDoneButton(), 'Purchase Licenses Done');
        });

        it("should show Purchase done button", function() {
          expect(purchaseLicensesSuccessPage.getDoneButton().isDisplayed()).to.eventually.be.true;
        });

        it("should show Purchase success panel", function() {
          expect(purchaseLicensesSuccessPage.getPurchaseSuccessPanel().isDisplayed()).to.eventually.be.true;
        });

        it("should navigate back to subscription when done", function() {
          purchaseLicensesSuccessPage.getDoneButton().click();
          helper.wait(subscriptionDetailsPage.getLoader(), 'Subscription Details Page Loader', 5000)
            .catch(function (err) {
              console.log(err);
            });
          helper.waitDisappear(subscriptionDetailsPage.getLoader(), 'Subscription Details Page Loader');

          expect(subscriptionDetailsPage.getDescriptionText().getText()).to.eventually.contain('7 x Display Licenses Yearly Plan');
        });
      });

      describe("Add Payment Method:", function() {
        it("should load Add Payment Method page", function() {
          subscriptionDetailsPage.getAddPaymentMethodButton().click();

          helper.wait(addPaymentMethodPage.getLoader(), "Add Payment Method Page Loader", 5000).catch(function (err) {console.log(err);});
          helper.waitDisappear(addPaymentMethodPage.getLoader(), "Add Payment Method Page Loader");

          expect(addPaymentMethodPage.getAddButton().isDisplayed()).to.eventually.be.true;
        });

        it("should allow entering credit card details", function() {
          expect(addPaymentMethodPage.getCardName().isDisplayed()).to.eventually.be.true;

          addPaymentMethodPage.getCardName().sendKeys("Test");          
          addPaymentMethodPage.enterCardNumber("4242424242424242");
          addPaymentMethodPage.enterCardExpiration("12/34");
          addPaymentMethodPage.enterCardCvc("123");
        });

        it("should Save credit card and navigate to Subscription Details", function() {
          addPaymentMethodPage.getAddButton().click();

          helper.wait(subscriptionDetailsPage.getLoader(), "Subscription Details Page Loader", 5000)
            .catch(function (err) {
              console.log(err);
            });
          helper.waitDisappear(subscriptionDetailsPage.getLoader(), "Subscription Details Page Loader");

          expect(subscriptionDetailsPage.getAddPaymentMethodButton().isDisplayed()).to.eventually.be.true;
        });

        it("should list the newly added card", function() {
          expect(subscriptionDetailsPage.getCreditCardItems().count()).to.eventually.equal(1);
        });
      });

      after(function() {
        commonHeaderPage.signOut(true);
      });

    });
  };

  module.exports = SubscriptionEdit;

})();
