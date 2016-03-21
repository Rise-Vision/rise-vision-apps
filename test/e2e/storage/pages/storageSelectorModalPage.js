'use strict';
var StorageSelectorModalPage = function() {
  var storageSelectorModal = element(by.id('storageSelectorModal'));
  var modalTitle = element(by.css('.modal-title'));

  var newFolderButton = element(by.id('newFolderButton'));
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
  
};

module.exports = StorageSelectorModalPage;
