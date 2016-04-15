'use strict';
var StorageHomePage = function() {
  var storageAppContainer = element(by.css('.storage-app'));

  var newFolderButton = element(by.id('newFolderButton'));
  var uploadDropdown = element(by.id('uploadDropdown'));
  var uploadButton = element(by.id('uploadButton'));
  var uploadInput = element(by.id('upload-files'));
  var uploadPanel = element(by.css('.upload-panel'));
  
  var downloadButton = element(by.id('fileDownloadButton'));
  var copyUrlButton = element(by.id('fileCopyUrlButton'));
  var moveToTrashButton = element(by.id('moveToTrashButton'));
  var restoreFromTrashButton = element(by.id('restoreFromTrashButton'));
  var deleteForeverButton = element(by.id('deleteForeverButton'));
  var confirmDeleteButton = element(by.id('confirmForm')).element(by.buttonText('Delete Forever'));

  var pendingOperationsPanel = element(by.id('pendingOperationsPanel'));

  this.getStorageAppContainer = function() {
    return storageAppContainer;
  };

  this.getPendingOperationsPanel = function() {
    return pendingOperationsPanel;
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

  this.getUploadInput = function() {
    return uploadInput;
  };

  this.getUploadPanel = function() {
    return uploadPanel;
  };
  
  this.getDownloadButton = function() {
    return downloadButton;
  };
  
  this.getCopyUrlButton = function() {
    return copyUrlButton;
  }

  this.getMoveToTrashButton = function() {
    return moveToTrashButton;
  }

  this.getRestoreFromTrashButton = function() {
    return restoreFromTrashButton;
  }

  this.getDeleteForeverButton = function() {
    return deleteForeverButton;
  }

  this.getConfirmDeleteButton = function() {
    return confirmDeleteButton;
  }

};

module.exports = StorageHomePage;
