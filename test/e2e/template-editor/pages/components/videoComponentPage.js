'use strict';

var helper = require('rv-common-e2e').helper;

var VideoComponentPage = function() {
  var selectedVideosMain = element.all(by.repeater('file in selectedFiles track by $index'));
  var volumeComponent = element(by.css('.video-component-volume'));
  var volumeInput = element(by.css('.video-component-volume input'));
  var volumeValue = element(by.css('.video-component-volume .range-value'));
  var uploadButtonMain = element(by.id('video-list-uploader-label'));
  var uploadInputMain = element(by.id('video-list-uploader'));
  var uploadPanelMain = element(by.id('upload-panel-video-list-uploader'));
  var storageSpinner = element(by.id('component-storage-selector-spinner'));
  var storageItemsSelector = 'item in folderItems | filter:search.query | orderBy:search.sortBy:search.reverse as filteredItems track by $index';
  var storageItems = element.all(by.repeater(storageItemsSelector));
  var storageButtonMain = element(by.id('video-list-storage-button'));
  var storageAddSelected = element(by.id('storage-selector-add-selected'));
  var storageNewFile = element(by.repeater(storageItemsSelector).row(1));
  var uploadButtonStorage = element(by.id('storage-selector-uploader-label'));
  var uploadInputStorage = element(by.id('storage-selector-uploader'));
  var uploadPanelStorage = element(by.id('upload-panel-storage-selector-uploader'));
  var videoFileLoader = element(by.xpath('//div[@spinner-key="video-file-loader"]'));

  this.getSelectedVideosMain = function () {
    return selectedVideosMain;
  };

  this.getVolumeComponent = function () {
    return volumeComponent;
  };

  this.getVolumeInput = function () {
    return volumeInput;
  };

  this.getVolumeValue = function () {
    return volumeValue;
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

  this.getVideoFileLoader = function() {
    return videoFileLoader;
  };

  this.getSelectedVideosTitles = function() {
    return element.all(by.xpath('//div[@class="file-text"]/div[1]'));
  };

  this.getBrokenLinks = function() {
    return element.all(by.xpath('//div[@class="file-thumbnail"]/div[2]'));
  };

  this.getRemoveLinkFor = function(videoName) {
    return element(by.xpath(
      '//div[@class="file-remove"][..//div[contains(text(), "' + videoName + '")]]/a'
    ));
  };
};

module.exports = VideoComponentPage;
