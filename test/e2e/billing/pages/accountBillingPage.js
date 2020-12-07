/*globals element, by */
(function(module) {
  'use strict';

  var AccountBillingPage = function () {
    var billingAppContainer = element(by.css('.billing-app'));
    var loader = element(by.xpath('//div[@spinner-key="billing-loader"]'));
    var invoicesListTable = element(by.id('invoicesListTable'));

    this.getBillingAppContainer = function() {
      return billingAppContainer;
    };

    this.getLoader = function() {
      return loader;
    };

    this.getInvoicesListTable = function() {
      return invoicesListTable;
    };

  };

  module.exports = AccountBillingPage;
})(module);
