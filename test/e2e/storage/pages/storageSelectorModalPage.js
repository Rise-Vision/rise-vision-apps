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
  var overwriteConfirmationModal = element(by.css('.confirm-overwrite-modal'));
  var retryAllButton = element(by.css('button#retryAll'));
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

  this.getOverwriteConfirmationModal = function() {
    return overwriteConfirmationModal;
  };

  this.getOverwriteFilesButton = function() {
     return overwriteFilesButton;
  }

  this.clickRetryOnFailure = function() {
    return setInterval(function() {
      retryAllButton.isPresent().then(function(present) {
        return present && retryAllButton.isDisplayed();
      })
      .then(function(readyToClick) {
        if (readyToClick) { retryAllButton.click(); }
      })
      .catch(console.error);
    }, 3000);
  }

};

module.exports = StorageSelectorModalPage;
