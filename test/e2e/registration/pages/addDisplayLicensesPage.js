'use strict';

var HomePage = require('../../common/pages/homepage.js');

var AddDisplayLicensesPage = function() {
  var homepage = new HomePage();

  var url = homepage.getUrl() + 'licenses/add';

  var loader = element(by.xpath('//div[@spinner-key="purchase-licenses-loader"]'));
  var purchaseLicensesPanel = element(by.css('.purchase-licenses-centered-panel'));
  var backButton = element(by.id('backButton'));
  var payButton = element(by.id('payButton'));
  var displayCountInput = element(by.css('input[name="displayCount"]'));
  var addCouponCodeLink = element(by.css('a[aria-label="Add Coupon Code"]'));
  var couponCodeInput = element(by.id('coupon-code'));
  var applyCouponCodeButton = element(by.id('apply-coupon-code'));
  var cancelCouponCodeLink = element(by.css('a[aria-label="Cancel Coupon Code"]'));
  var couponRows = element.all(by.css('p.coupon-row'));
  var couponAmount = element(by.css('p.coupon-row > span:last-child'));
  var proratedAmountTotal = element(by.css('#prorated-amount-row .purchase-total'));
  var nextInvoiceTotal = element(by.css('#next-invoice-row .purchase-total'));

  this.get = function() {
    browser.get(url);
  };

  this.getLoader = function() {
    return loader;
  };

  this.getPurchaseLicensesPanel = function() {
    return purchaseLicensesPanel;
  };

  this.getBackButton = function() {
    return backButton;
  };

  this.getPayButton = function() {
    return payButton;
  };

  this.getDisplayCountInput = function() {
    return displayCountInput;
  };

  this.getAddCouponCodeLink = function() {
    return addCouponCodeLink;
  };

  this.getCouponCodeInput = function() {
    return couponCodeInput;
  };

  this.getApplyCouponCodeButton = function() {
    return applyCouponCodeButton;
  };

  this.getCancelCouponCodeLink = function() {
    return cancelCouponCodeLink;
  };

  this.getCouponRows = function() {
    return couponRows;
  };

  this.getCouponAmount = function() {
    return couponAmount;
  };

  this.getProratedAmountTotal = function() {
    return proratedAmountTotal;
  };

  this.getNextInvoiceTotal = function() {
    return nextInvoiceTotal;
  };
};

module.exports = AddDisplayLicensesPage;
