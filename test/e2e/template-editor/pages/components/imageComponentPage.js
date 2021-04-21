'use strict';

var helper = require('rv-common-e2e').helper;

var ImageComponentPage = function() {
  var selectedImagesMain = element.all(by.repeater('image in selectedImages track by $index'));
  var listDurationComponent = element(by.css('.image-component-list-duration'));
  var uploadButtonMain = element(by.id('image-list-uploader-label'));
  var uploadInputMain = element(by.id('image-list-uploader'));
  var uploadPanelMain = element(by.id('upload-panel-image-list-uploader'));
  var storageSpinner = element(by.id('component-storage-selector-spinner'));
  var storageItemsSelector = 'item in folderItems | filter:search.query | orderBy:search.sortBy:search.reverse as filteredItems track by $index';
  var storageItems = element.all(by.repeater(storageItemsSelector));
  var storageButtonMain = element(by.id('image-list-storage-button'));
  var storageAddSelected = element(by.id('storage-selector-add-selected'));
  var storageNewFile = element(by.repeater(storageItemsSelector).row(1));
  var storageSearchInput = element(by.id('componentStorageSearchInput'));
  var noSearchResultContainer = element(by.id('noSearchResult'));
  var uploadButtonStorage = element(by.id('storage-selector-uploader-label'));
  var uploadInputStorage = element(by.id('storage-selector-uploader'));
  var uploadPanelStorage = element(by.id('upload-panel-storage-selector-uploader'));
  var emptyListContainer = element(by.css('.image-component-list .item-list-empty'));
  var imageFileLoader = element(by.xpath('//div[@spinner-key="image-file-loader"]'));

  this.getSelectedImagesMain = function () {
    return selectedImagesMain;
  };

  this.getListDurationComponent = function () {
    return listDurationComponent;
  };

  this.getUploadButtonMain = function () {
    return uploadButtonMain;
  };

  this.getUploadInputMain = function () {
    return uploadInputMain;
  };

  this.getUploadPanelMain = function () {
    return uploadPanelMain;
  };

  this.getStorageSpinner = function () {
    return storageSpinner;
  };

  this.getStorageItems = function () {
    return storageItems;
  };

  this.getStorageButtonMain = function () {
    return storageButtonMain;
  };

  this.getStorageAddSelected = function () {
    return storageAddSelected;
  };

  this.getStorageNewFile = function () {
    return storageNewFile;
  };

  this.getStorageSearchInput = function () {
    return storageSearchInput;
  };

  this.getNoSearchResultContainer = function () {
    return noSearchResultContainer;
  };

  this.getUploadButtonStorage = function () {
    return uploadButtonStorage;
  };

  this.getUploadInputStorage = function () {
    return uploadInputStorage;
  };

  this.getUploadPanelStorage = function () {
    return uploadPanelStorage;
  };

  this.getEmptyListContainer = function () {
    return emptyListContainer;
  };

  this.getImageFileLoader = function() {
    return imageFileLoader;
  };

  this.getSelectedImagesTitles = function() {
    return element.all(by.xpath('//div[@class="file-text"]/div[1]'));
  };

  this.getThumbnails = function() {
    return element.all(by.xpath('//div[@class="file-thumbnail"]/img'));
  };

  this.getBrokenLinks = function() {
    return element.all(by.xpath('//div[@class="file-thumbnail"]/div[2]'));
  };

  this.getRemoveLinkFor = function(imageName) {
    return element(by.xpath(
      '//div[@class="file-remove"][..//div[contains(text(), "' + imageName + '")]]/a'
    ));
  };
};

module.exports = ImageComponentPage;
