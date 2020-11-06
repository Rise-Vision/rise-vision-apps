'use strict';
var PricingPage = function() {
  var subscribeButton = element(by.id('subscribeButton'));

  this.getSubscribeButton = function() {
    return subscribeButton;
  };
};

module.exports = PricingPage;
