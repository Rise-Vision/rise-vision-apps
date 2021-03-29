'use strict';
var PricingPage = function() {
  var subscribeButton = element(by.id('subscribeButton'));
  var contactSalesButton = element(by.id('contactSalesButton'));

  this.getSubscribeButton = function() {
    return subscribeButton;
  };

  this.getContactSalesButton = function() {
    return contactSalesButton;
  };
};

module.exports = PricingPage;
