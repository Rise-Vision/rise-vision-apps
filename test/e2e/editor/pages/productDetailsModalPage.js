'use strict';
var ProductDetailsModalPage = function() {
  var productDetailsModal = element(by.id('productDetailsModal'));
  var useProductButton = element(by.id('useProductButton'));
  var startTrialButton = element(by.id('startTrialButton'));

  var pricingLoader = element(by.xpath('//div[@spinner-key="loading-price"]'));
  var trialLoader = element(by.xpath('//a[@spinner-key="loading-trial"]'));

  var pricingInfo = element(by.id('pricingInfo'));
  var closeButton = element(by.id('closeButton'));

  var errorDialogCloseButton = element(by.css('#messageForm button[class="close"]'));

  this.getProductDetailsModal = function(){
    return productDetailsModal;
  };

  this.getUseProductButton = function(){
    return useProductButton;
  };

  this.getStartTrialButton = function(){
    return startTrialButton;
  };

  this.getPricingLoader = function(){
    return pricingLoader;
  }

  this.getTrialLoader = function(){
    return trialLoader;
  }

  this.getPricingInfo = function(){
    return pricingInfo;
  }

  this.getCloseButton = function() {
    return closeButton;
  };

  this.getErrorDialogCloseButton = function() {
    return errorDialogCloseButton;
  };
};

module.exports = ProductDetailsModalPage;
