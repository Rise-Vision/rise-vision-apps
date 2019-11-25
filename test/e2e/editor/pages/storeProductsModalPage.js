'use strict';
var StoreProductsModalPage = function() {
  var storeProductsModal = element(by.id('addStoreProductModal'));
  var modalTitle = element(by.id('storeModalTitle'));
  var searchFilter = element(by.tagName('search-filter'));
  var searchInput = element(by.id('storeProductsSearchInput'));

  var storeProductsLoader = element(by.css('#addStoreProductModal .spinner-backdrop'));
  var productListLoader = element(by.xpath('//ul[@spinner-key="product-list-loader"]'));
  
  var storeProductsList = element(by.id('productList'));
  var storeProducts = element.all(by.id('storeProduct'));
  var addBlankPresentation = element(by.id('newPresentationButton'));
  var suggestTemplate = element(by.id('suggestTemplate'));  
  var productNameFields = element.all(by.id('productName'));
  var statusFields = element.all(by.id('status'));
  var displayBanner = element(by.id('displayBanner'));

  var professionalWidgets = element.all(by.repeater('widget in filteredProfessionalWidgets = (professionalWidgets | filter: search.query)'));
  var professionalWidgetNames = element.all(by.css('.professional-content .product-grid_details h4'));
  var unlockButton = element.all(by.id('unlockButton'));
  var addProfessionalWidgetButton = element.all(by.id('addProfessionalWidgetButton'));
  var promotionTrialButton = element.all(by.id('promotionTrialButton'));
  var displaysListLink = element.all(by.id('displaysListLink'));

  var addWidgetByUrlButton = element(by.id('addWidgetByUrl'));
  var closeButton = element(by.css('.close'));

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
  };
  
  this.getProfessionalWidgets = function() {
    return professionalWidgets;
  };

  this.getProfessionalWidgetNames = function() {
    return professionalWidgetNames;
  };

  this.getUnlockButton = function() {
    return unlockButton;
  };

  this.getAddProfessionalWidgetButton = function() {
    return addProfessionalWidgetButton;
  };

  this.getPromotionTrialButton = function() {
    return promotionTrialButton;
  };

  this.getDisplaysListLink = function() {
    return displaysListLink;
  };

  this.getAddWidgetByUrlButton = function() {
    return addWidgetByUrlButton;
  };

  this.getCloseButton = function() {
    return closeButton;
  };

  this.getAddButtonById = function(id) {
    return element(by.id(id));
  };
};

module.exports = StoreProductsModalPage;
