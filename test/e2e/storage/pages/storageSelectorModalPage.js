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
  var closeButton = element(by.id('closeButton'));

  var searchInput = element(by.id('storageSelectorSearchInput'));  

  var loader = element(by.xpath('//div[@spinner-key="_rv-global-spinner"]'));
  var fileListRows = element.all(by.css('#storageFileList > tbody > tr'));

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

  this.getUploadPanel = function() {
    return uploadPanel;
  };

  this.getSearchInput = function(){
    return searchInput;
  }

  this.getFileListRows = function() {
    return fileListRows;
  }

  this.getLoader = function() {
    return loader;
  }
};

module.exports = StorageSelectorModalPage;
