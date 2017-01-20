'use strict';
var UnsavedChangesModalPage = function() {
  var unsavedChangesModal = element(by.id('unsavedChangesModal'));
  
  var dontSaveButton = element(by.id('unsavedChangesDontSaveButton'));
  var saveButton = element(by.id('unsavedChangesSaveButton'));
  var cancelButton = element(by.id('unsavedChangesCancelButton'));


  this.getUnsavedChangesModal = function() {
    return unsavedChangesModal;
  };

  this.getDontSaveButton = function() {
    return dontSaveButton;
  };

  this.getSaveButton = function() {
    return saveButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };

};

module.exports = UnsavedChangesModalPage;
