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

        it("shows Account & Billing page", function() {
          expect(accountBillingPage.getBillingAppContainer().isPresent()).to.eventually.be.true;
        });

        it("shows subscriptions list table", function() {
          expect(accountBillingPage.getSubscriptionsListTable().isPresent()).to.eventually.be.true;
        });

        it('should show subscriptions list header Subscription', function () {
          expect(accountBillingPage.getSubscriptionsTableHeaderSubscription().isPresent()).to.eventually.be.true;
          expect(accountBillingPage.getSubscriptionsTableHeaderSubscription().getText()).to.eventually.equal('Subscription');
        });

        it('should show subscriptions list header Status', function () {
          expect(accountBillingPage.getSubscriptionsTableHeaderStatus().isPresent()).to.eventually.be.true;
          expect(accountBillingPage.getSubscriptionsTableHeaderStatus().getText()).to.eventually.equal('Status');
        });

        it('should show subscriptions list header Renewal Date', function () {
          expect(accountBillingPage.getSubscriptionsTableHeaderRenewalDate().isPresent()).to.eventually.be.true;
          expect(accountBillingPage.getSubscriptionsTableHeaderRenewalDate().getText()).to.eventually.equal('Renewal Date');
        });

        it('should show subscriptions list header Renewal Amount', function () {
          expect(accountBillingPage.getSubscriptionsTableHeaderRenewalAmount().isPresent()).to.eventually.be.true;
          expect(accountBillingPage.getSubscriptionsTableHeaderRenewalAmount().getText()).to.eventually.equal('Renewal Amount');
        });

        it('should show at least one subscription with its link', function () {
          expect(accountBillingPage.getFirstSubscriptionLink().isPresent()).to.eventually.be.true;
          expect(accountBillingPage.getFirstSubscriptionLink().getText()).to.eventually.equal('5 x Display Licenses Yearly Plan');
        });

        it("shows invoices list table", function() {
          expect(accountBillingPage.getInvoicesListTable().isPresent()).to.eventually.be.true;
        });

        it("shows at least one paid invoice", function() {
          expect(accountBillingPage.getPaidInvoiceIcon().isPresent()).to.eventually.be.true;
        });

      });

    });
  };

  module.exports = AccountBillingScenarios;

})();
