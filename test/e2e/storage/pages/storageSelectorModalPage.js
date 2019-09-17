'use strict';
var StorageSelectorModalPage = function() {
  var storageSelectorModal = element(by.id('storageSelectorModal'));
  var modalTitle = element(by.css('.modal-title'));

  var newFolderButton = element(by.id('newFolderButton'));
  var uploadButton = element(by.id('uploadButton'));
  var uploadFolderButton = element(by.id('uploadFolderButton'));
  var uploadInput = element(by.id('upload-files'));
  var uploadPanel = element(by.id('uploadPanel'));
  var selectFilesButton = element(by.id('selectFilesButton'));
  var byURLButton = element(by.id('byURLButton'));
  var closeButton = element(by.id('closeButton'));
  var startTrialButton = element(by.id('startTrialButton'));
  var overwriteConfirmationModal = element(by.css('.confirm-overwrite-modal'));
  var overwriteFilesButton = element(by.css('.confirm-overwrite-modal')).element(by.buttonText('Yes, overwrite files'));
  

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

  this.getByURLButton = function() {
    return byURLButton;
  };

  this.getUploadPanel = function() {
    return uploadPanel;
  };

  this.getStartTrialButton = function() {
    return startTrialButton;
  };

  this.getOverwriteConfirmationModal = function() {
    return overwriteConfirmationModal;
  };

  this.getOverwriteFilesButton = function() {
     return overwriteFilesButton;
  }

};

module.exports = StorageSelectorModalPage;
