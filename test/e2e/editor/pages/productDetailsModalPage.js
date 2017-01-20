'use strict';
var ProductDetailsModalPage = function() {
  var productDetailsModal = element(by.id('productDetailsModal'));
  var useProductButton = element(by.id('useProductButton'));
  var viewInStoreButton = element(by.id('viewInStoreButton'));  

  var pricingLoader = element(by.xpath('//div[@spinner-key="loading-price"]'));

  var pricingInfo = element(by.id('pricingInfo'));
  var closeButton = element(by.id('closeButton'));

  this.getProductDetailsModal = function(){
    return productDetailsModal;
  };

  this.getUseProductButton = function(){
    return useProductButton;
  };

  this.getViewInStoreButton = function(){
    return viewInStoreButton;
  };  

  this.getPricingLoader = function(){
    return pricingLoader;
  }

  this.getPricingInfo = function(){
    return pricingInfo;
  }

  this.getCloseButton = function() {
    return closeButton;
  };
};

module.exports = ProductDetailsModalPage;
