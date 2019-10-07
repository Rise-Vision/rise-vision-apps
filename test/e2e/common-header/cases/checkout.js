(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var HomePage = require('./../pages/homepage.js');
  var SignInPage = require('./../../launcher/pages/signInPage.js');
  var PurchaseFlowModalPage = require('./../../common/pages/purchaseFlowModalPage.js');
  var PricingComponentModalPage = require('./../../common/pages/pricingComponentModalPage.js');

  var Checkout = function() {

    describe("Checkout", function() {
      var commonHeaderPage, 
        homepage, 
        signInPage,
        purchaseFlowModalPage,
        pricingComponentModalPage;
                
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        signInPage = new SignInPage();
        purchaseFlowModalPage = new PurchaseFlowModalPage();
        pricingComponentModalPage = new PricingComponentModalPage();

        //TODO Allow time for the trial subscription to be enabled
        browser.sleep(30000);

        homepage.get();

        signInPage.customAuthSignIn(commonHeaderPage.getStageEmailAddress(), commonHeaderPage.getPassword());
      });

      it("should show Subscribe button", function() {
        expect(purchaseFlowModalPage.getSubscribeNowButton().isDisplayed()).to.eventually.be.true;
      });

      it("should open plans modal", function() {
        helper.clickWhenClickable(purchaseFlowModalPage.getSubscribeNowButton(), 'Subscribe Button');

        helper.wait(pricingComponentModalPage.getSubscribeButton(), 'Pricing Component Modal');

        expect(pricingComponentModalPage.getSubscribeButton().isDisplayed()).to.eventually.be.true;
      });

      it("should open checkout modal", function() {
        helper.clickWhenClickable(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button');
        
        helper.waitDisappear(pricingComponentModalPage.getSubscribeButton(), 'Subscribe Button Disappear');

        expect(purchaseFlowModalPage.getContinueButton().isDisplayed()).to.eventually.be.true;        
      });

      it("should purchase",function() {
        purchaseFlowModalPage.purchase();

        expect(purchaseFlowModalPage.getSubscribeNowButton().isDisplayed()).to.eventually.be.false;
      });

      after(function() {
        commonHeaderPage.signOut(true);
      });

    });
  };

  module.exports = Checkout;

})();
