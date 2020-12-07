(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var HomePage = require('./../../common-header/pages/homepage.js');
  var AccountBillingPage = require('./../pages/accountBillingPage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');

  var AccountBillingScenarios = function() {

    describe("AccountBilling", function() {
      var commonHeaderPage,
        homepage,
        accountBillingPage,
        signInPage;

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        accountBillingPage = new AccountBillingPage();
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

        it("Shows Account & Billing page", function() {
          expect(accountBillingPage.getBillingAppContainer().isPresent()).to.eventually.be.true;
        });

        it("Shows invoices list table", function() {
          expect(accountBillingPage.getInvoicesListTable().isPresent()).to.eventually.be.true;
          browser.sleep(60000);
        });
      });

    });
  };

  module.exports = AccountBillingScenarios;

})();
