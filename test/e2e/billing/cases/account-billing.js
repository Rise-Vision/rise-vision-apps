(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var HomePage = require('./../../common-header/pages/homepage.js');
  var AccountBillingPage = require('./../pages/accountBillingPage.js');
  var InvoicePage = require('./../pages/invoicePage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');

  var AccountBillingScenarios = function() {

    describe("AccountBilling", function() {
      var commonHeaderPage,
        homepage,
        accountBillingPage,
        invoicePage,
        signInPage,
        unauthenticatedParams;

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        accountBillingPage = new AccountBillingPage();
        invoicePage = new InvoicePage();
        signInPage = new SignInPage();

        homepage.getEditor();
        signInPage.signIn();
      });

      describe("Account & Billing", function () {

        it("lets click Account & Billing menu option", function() {
          commonHeaderPage.openProfileMenu();
          homepage.getAccountBillingButton().click();

          helper.waitDisappear(accountBillingPage.getLoader(), "Account & Billing Page");
        });

        it("shows Account & Billing page", function() {
          expect(accountBillingPage.getBillingAppContainer().isPresent()).to.eventually.be.true;
        });

        it("shows invoices list table", function() {
          expect(accountBillingPage.getInvoicesListTable().isPresent()).to.eventually.be.true;
        });

        it("shows at least one paid invoice", function() {
          expect(accountBillingPage.getPaidInvoiceIcon().isPresent()).to.eventually.be.true;
        });

        it("shows pay now button", function() {
          expect(accountBillingPage.getPayNowButton().isPresent()).to.eventually.be.true;
        });

        it("navigates to unauthenticated invoice page", function() {
          accountBillingPage.getPayNowButton().getAttribute('href').then(function(href) {
            unauthenticatedParams = href.split('?')[1];

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

    });
  };

  module.exports = AccountBillingScenarios;

})();
