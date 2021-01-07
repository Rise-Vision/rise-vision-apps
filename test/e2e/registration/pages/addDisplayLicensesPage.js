'use strict';

var HomePage = require('../../common/pages/homepage.js');

var AddDisplayLicensesPage = function() {
  var homepage = new HomePage();

  var url = homepage.getUrl() + 'licenses';

  var loader = element(by.xpath('//div[@spinner-key="purchase-licenses-loader"]'));
  var purchaseLicensesPanel = element(by.css('.purchase-licenses-centered-panel'));
  var backButton = element(by.id('backButton'));
  var payButton = element(by.id('payButton'));
  var displayCountInput = element(by.css('input[name="displayCount"]'));
  var addCouponCodeLink = element(by.css('a[aria-label="Add Coupon Code"]'));

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
};

module.exports = AddDisplayLicensesPage;
