'use strict';
var StorageHomePage = function() {
  var storageAppContainer = element(by.css('.storage-app'));

  var newFolderButton = element(by.id('newFolderButton'));
  var uploadDropdown = element(by.id('uploadDropdown'));
  var uploadButton = element(by.id('uploadButton'));
  var uploadInput = element(by.id('upload-files'));
  var uploadPanel = element(by.css('.upload-panel'));
  
  var copyUrlButton = element(by.id('fileCopyUrlButton'));

  var searchInput = element(by.id('storageSelectorSearchInput'));  

  var loader = element(by.xpath('//div[@spinner-key="_rv-global-spinner"]'));
  var storageFileList = element(by.css('.storage-app .scrollable-list'));
  var fileListRows = element.all(by.css('#storageFileList > tbody > tr'));

  this.getStorageAppContainer = function() {
    return storageAppContainer;
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
  
  this.getCopyUrlButton = function() {
    return copyUrlButton;
  }

  this.getSearchInput = function(){
    return searchInput;
  }

  this.getFileListRows = function() {
    return fileListRows;
  }

  this.getStorageFileList = function() {
    return storageFileList;
  }

  this.getLoader = function() {
    return loader;
  }
};

module.exports = StorageHomePage;
