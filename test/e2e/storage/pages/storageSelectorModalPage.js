'use strict';
var StorageSelectorModalPage = function() {
  var storageSelectorModal = element(by.id('storageSelectorModal'));
  var modalTitle = element(by.css('.modal-title'));

  var newFolderButton = element(by.id('newFolderButton'));
  var uploadDropdown = element(by.id('uploadDropdown'));
  var uploadButton = element(by.id('uploadButton'));
  var uploadFolderButton = element(by.id('uploadFolderButton'));
  var uploadInput = element(by.id('upload-files'));
  var uploadPanel = element(by.css('.upload-panel'));
  var selectFilesButton = element(by.id('selectFilesButton'));
  var closeButton = element(by.id('closeButton'));

  this.getStorageSelectorModal = function() {
    return storageSelectorModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };

  this.getCloseButton = function() {
    return closeButton;
  };

  this.getNewFolderButton = function() {
    return newFolderButton;
  };  

  this.getUploadDropdown = function() {
    return uploadDropdown;
  };

  this.getUploadButton = function() {
    return uploadButton;
  };

  this.getUploadFolderButton = function() {
    return uploadFolderButton;
  };

  this.getUploadInput = function() {
    return uploadInput;
  };
  
  this.getSelectFilesButton = function() {
    return selectFilesButton;
  };

  this.getUploadPanel = function() {
    return uploadPanel;
  };

};

module.exports = StorageSelectorModalPage;
