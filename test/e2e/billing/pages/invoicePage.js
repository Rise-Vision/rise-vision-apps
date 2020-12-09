/*globals element, by */
(function(module) {
  'use strict';

  var InvoicePage = function () {
    var invoiceContainer = element(by.css('.billing-app'));
    var loader = element(by.xpath('//div[@spinner-key="invoice-loader"]'));
    var invoiceTitle = element(by.css('.panel-body .app-header .app-header-title'));
    var shareButton = element(by.id('share-url-button'));
    var downloadButton = element(by.id('downloadButton'));
    var payNowButton = element(by.id('payNowButton'));

    this.getInvoiceContainer = function() {
      return invoiceContainer;
    };

    this.getLoader = function() {
      return loader;
    };

    this.getInvoiceTitle = function() {
      return invoiceTitle;
    };

    this.getShareButton = function() {
      return shareButton;
    };

    this.getDownloadButton = function() {
      return downloadButton;
    };

    this.getPayNowButton = function() {
      return payNowButton;
    };

  };

  module.exports = InvoicePage;
})(module);
