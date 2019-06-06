'use strict';

var ImageComponentPage = function() {
  var selectedImagesMain = element.all(by.repeater('image in selectedImages track by $index'));
  var listDurationComponent = element(by.css('.image-component-list-duration'));
  var uploadButtonMain = element(by.id('image-list-uploader-label'));
  var uploadInputMain = element(by.id('image-list-uploader'));
  var uploadPanelMain = element(by.id('upload-panel-image-list-uploader'));
  var storageSpinner = element(by.id('storage-image-storage-spinner'));
  var storageItemsSelector = 'item in folderItems track by $index';
  var storageItems = element.all(by.repeater(storageItemsSelector));
  var storageButtonMain = element(by.id('image-list-storage-button'));
  var storageAddSelected = element(by.id('image-storage-add-selected'));
  var storageNewFile = element(by.repeater(storageItemsSelector).row(1));
  var uploadButtonStorage = element(by.id('image-storage-uploader-label'));
  var uploadInputStorage = element(by.id('image-storage-uploader'));
  var uploadPanelStorage = element(by.id('upload-panel-image-storage-uploader'));

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

  this.getUploadButtonStorage = function () {
    return uploadButtonStorage;
  };

  this.getUploadInputStorage = function () {
    return uploadInputStorage;
  };

  this.getUploadPanelStorage = function () {
    return uploadPanelStorage;
  };
};

module.exports = ImageComponentPage;
