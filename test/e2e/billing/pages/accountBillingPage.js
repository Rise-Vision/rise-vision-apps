/*globals element, by */
(function(module) {
  'use strict';

  var AccountBillingPage = function () {
    var billingAppContainer = element(by.css('.billing-app'));
    var loader = element(by.xpath('//div[@spinner-key="billing-loader"]'));
    var invoicesListTable = element(by.id('invoicesListTable'));
    var subscriptionsListTable = element(by.id('subscriptionsListTable'));
    var subscriptionsTableHeaderSubscription = element(by.css('#subscriptionsListTable tr th:nth-child(1)'));
    var subscriptionsTableHeaderStatus = element(by.css('#subscriptionsListTable tr th:nth-child(2)'));
    var subscriptionsTableHeaderRenewalDate = element(by.css('#subscriptionsListTable tr th:nth-child(3)'));
    var subscriptionsTableHeaderRenewalAmount = element(by.css('#subscriptionsListTable tr th:nth-child(4)'));
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

    this.getSubscriptionsListTable = function() {
      return subscriptionsListTable;
    };

    this.getSubscriptionsTableHeaderSubscription = function() {
      return subscriptionsTableHeaderSubscription;
    };

    this.getSubscriptionsTableHeaderStatus = function() {
      return subscriptionsTableHeaderStatus;
    };

    this.getSubscriptionsTableHeaderRenewalDate = function() {
      return subscriptionsTableHeaderRenewalDate;
    };

    this.getSubscriptionsTableHeaderRenewalAmount = function() {
      return subscriptionsTableHeaderRenewalAmount;
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
