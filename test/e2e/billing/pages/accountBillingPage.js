/*globals element, by */
(function(module) {
  'use strict';

  var AccountBillingPage = function () {
    var billingAppContainer = element(by.css('.billing-app'));
    var loader = element(by.xpath('//div[@spinner-key="billing-loader"]'));
    var invoicesListTable = element(by.id('invoicesListTable'));
    var paidInvoiceIcon = element(by.css('#invoicesListTable td .paid'));
    var payNowButton = element(by.css('#invoicesListTable td .btn-pay-now'));

    this.getBillingAppContainer = function() {
      return billingAppContainer;
    };

    this.getLoader = function() {
      return loader;
    };

    this.getInvoicesListTable = function() {
      return invoicesListTable;
    };

    this.getPaidInvoiceIcon = function() {
      return paidInvoiceIcon;
    };

    this.getPayNowButton = function() {
      return payNowButton;
    };

  };

  module.exports = AccountBillingPage;
})(module);
