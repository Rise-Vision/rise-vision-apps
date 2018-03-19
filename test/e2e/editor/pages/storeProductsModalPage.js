'use strict';
var StoreProductsModalPage = function() {
  var storeProductsModal = element(by.id('addStoreProductModal'));
  var modalTitle = element(by.id('storeModalTitle'));
  var searchFilter = element(by.tagName('search-filter'));
  var searchInput = element(by.id('storeProductsSearchInput'));
  var searchCategories = element.all(by.repeater('category in paymentCategories'));

  var storeProductsLoader = element(by.css('#addStoreProductModal .spinner-backdrop'));
  var productListLoader = element(by.xpath('//ul[@spinner-key="product-list-loader"]'));
  
  var storeProductsList = element(by.id('productList'));
  var storeProducts = element.all(by.id('storeProduct'));
  var addBlankPresentation = element(by.id('newPresentationButton'));
  var suggestTemplate = element(by.id('suggestTemplate'));  
  var productNameFields = element.all(by.id('productName'));
  var statusFields = element.all(by.id('status'));
  var freeProducts = element.all(by.cssContainingText('p#status', 'Free'));
  var premiumProducts = element.all(by.cssContainingText('p#status', 'Premium'));
  var displayBanner = element(by.id('displayBanner'));

  var professionalWidgets = element.all(by.repeater('widget in professionalWidgets'));
  var unlockButton = element.all(by.id('unlockButton'));
  var addProfessionalWidgetButton = element.all(by.id('addProfessionalWidgetButton'));
  var startTrialButton = element.all(by.id('startTrialButton'));
  var displaysListLink = element.all(by.id('displaysListLink'));

  var addWidgetByUrlButton = element(by.id('addWidgetByUrl'));
  var closeButton = element(by.css('.close'));

  this.getFreeProducts = function() {
    return freeProducts;
  }

  this.getPremiumProducts = function() {
    return premiumProducts;
  }

  this.getStoreProductsModal = function () {
    return storeProductsModal;
  };

  this.getProductListLoader = function () {
    return productListLoader;
  };

  this.getModalTitle = function () {
    return modalTitle;
  };

  this.getTitle = function() {
    return title;
  };

  this.getSearchFilter = function() {
    return searchFilter;
  };

  this.getSearchInput = function() {
    return searchInput;
  };
  
  this.getSearchCategories = function() {
    return searchCategories;
  }

  this.getStoreProductsList = function() {
    return storeProductsList;
  };

  this.getAddBlankPresentation = function() {
    return addBlankPresentation;
  };

  this.getSuggestTemplate = function() {
    return suggestTemplate;
  };
  
  this.getStoreProductsLoader = function() {
    return storeProductsLoader;
  };

  this.getStoreProducts = function() {
    return storeProducts;
  };

  this.getProductNameFields = function() {
    return productNameFields;
  };

  this.getStatusFields = function() {
    return statusFields;
  };

  this.getDisplayBanner = function() {
    return displayBanner;
  }
  
  this.getProfessionalWidgets = function() {
    return professionalWidgets;
  }
  
  this.getUnlockButton = function() {
    return unlockButton;
  };

  this.getAddProfessionalWidgetButton = function() {
    return addProfessionalWidgetButton;
  };

  this.getStartTrialButton = function() {
    return startTrialButton;
  };

  this.getDisplaysListLink = function() {
    return displaysListLink;
  };

  this.getAddWidgetByUrlButton = function() {
    return addWidgetByUrlButton;
  }

  this.getCloseButton = function() {
    return closeButton;
  };
};

module.exports = StoreProductsModalPage;
