'use strict';
var NewFolderModalPage = function() {
  var newFolderModal = element(by.id('newFolderModal'));
  var modalTitle = element(by.css('#newFolderModal .modal-title'));
  var newFolderInput = element(by.id('newFolderInput'));

  var saveButton = element(by.id('newFolderModalSaveButton'));
  var cancelButton = element(by.id('newFolderModalCancelButton'));

  this.getNewFolderModal = function() {
    return newFolderModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };

  this.getNewFolderInput = function() {
    return newFolderInput;
  };

  this.getSaveButton = function() {
    return saveButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };
  
};

module.exports = NewFolderModalPage;
