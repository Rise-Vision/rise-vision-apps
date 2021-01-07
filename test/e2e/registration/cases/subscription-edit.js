(function() {

  "use strict";

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
        addDisplayLicensesPage;

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        signInPage = new SignInPage();
        presentationListPage = new PresentationListPage();
        addDisplayLicensesPage = new AddDisplayLicensesPage();

        homepage.getEditor();
        signInPage.signIn();
      });

      describe("estimate: ", function() {
        before(function() {
          addDisplayLicensesPage.get();
          helper.waitDisappear(addDisplayLicensesPage.getLoader(), 'Display Licenses Page Loader');
          browser.sleep(1000);
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

      after(function() {
        commonHeaderPage.signOut(true);
      });

    });
  };

  module.exports = SubscriptionEdit;

})();
