(function() {

  "use strict";

  var MONETARY_VALUE_REGEX = /[$][\d,]+[.*]\d{2}/;

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var HomePage = require('./../../common-header/pages/homepage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');
  var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
  var AddDisplayLicensesPage = require('./../pages/addDisplayLicensesPage.js');

  var SubscriptionEdit = function() {

    describe("SubscriptionEdit", function() {
      var commonHeaderPage,
        homepage,
        signInPage,
        presentationListPage,
        addDisplayLicensesPage,
        currentNextInvoice;

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        signInPage = new SignInPage();
        presentationListPage = new PresentationListPage();
        addDisplayLicensesPage = new AddDisplayLicensesPage();

        homepage.getEditor();
        signInPage.signIn();
      });

      describe("estimate page: ", function() {
        before(function() {
          addDisplayLicensesPage.get();
          helper.waitDisappear(addDisplayLicensesPage.getLoader(), 'Display Licenses Page Loader');
          browser.sleep(1500);
        });

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
        before(function() {
          browser.sleep(2000);
        });

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

      after(function() {
        commonHeaderPage.signOut(true);
      });

    });
  };

  module.exports = SubscriptionEdit;

})();
