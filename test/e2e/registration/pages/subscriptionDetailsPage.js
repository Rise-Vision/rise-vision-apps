'use strict';

var SubscriptionDetailsPage = function() {

  var loader = element(by.xpath('//div[@spinner-key="update-subscription-loader"]'));
  var descriptionText = element(by.css('.billing-app h4'));

  var addLicensesButton = element(by.id('addLicenses'));
  var removeLicensesButton = element(by.id('removeLicenses'));
  var addPaymentMethodButton = element(by.id('addPaymentMethod'));

  var invoiceMeItem = element(by.xpath('//label[@for="invoiceMe"]'));
  
  this.getLoader = function() {
    return loader;
  };

  this.getDescriptionText = function() {
    return descriptionText;
  };

  this.getAddLicensesButton = function() {
    return addLicensesButton;
  };

  this.getRemoveLicensesButton = function() {
    return removeLicensesButton;
  };

  this.getAddPaymentMethodButton = function() {
    return addPaymentMethodButton;
  };

  this.getInvoiceMeItem = function() {
    return invoiceMeItem;
  };
};

module.exports = SubscriptionDetailsPage;
