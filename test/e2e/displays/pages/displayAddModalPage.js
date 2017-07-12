'use strict';
var DisplayAddModalPage = function() {
  var displayAddModal = element(by.id('display-add-modal'));
  var title = element(by.css('.modal-title'));
  var displayNameField = element(by.model('display.name'));
  var downloadWindows64Button = element(by.id('downloadWindows64'));

  var displayIdField = element(by.id('displayIdField'));

  var nextButton = element(by.id('nextButton'));
  var dismissButton = element(by.id('dismissButton'));

  this.getDisplayAddModal = function() {
    return displayAddModal;
  };

  this.getTitle = function() {
    return title;
  };

  this.getDisplayNameField = function() {
    return displayNameField;
  };
  
  this.getDownloadWindows64Button = function() {
    return downloadWindows64Button;
  };
  
  this.getDisplayIdField = function() {
    return displayIdField;
  };

  this.getNextButton = function() {
    return nextButton;
  };

  this.getDismissButton = function() {
    return dismissButton;
  };

};

module.exports = DisplayAddModalPage;
