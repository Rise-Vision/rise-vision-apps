'use strict';
var DisplayAddModalPage = function() {
  var displayAddModal = element(by.id('displayAddModal'));
  var title = element(by.css('.modal-title'));
  var displayNameField = element(by.model('display.name'));

  var displayAddedPage = element(by.id('displayAddedPage'));
  var preconfiguredPlayerButton = element(by.id('preconfiguredPlayerButton'));
  var ownPlayerButton = element(by.id('ownPlayerButton'));

  var userPlayerPage = element(by.id('userPlayerPage'));
  var pickWindowsLink = element(by.id('pickWindowsLink'));
  var downloadWindows64Button = element(by.id('downloadWindows64'));
  var preconfiguredPlayerLink = element(by.id('preconfiguredPlayerLink'));

  var preconfiguredPlayerPage = element(by.id('preconfiguredPlayerPage'));
  var purchasePlayerLink = element(by.id('purchasePlayerLink'));

  var displayIdField = element(by.id('displayIdField'));
  var emailedInstructions = element(by.id('emailedInstructions'));

  var nextButton = element(by.id('nextButton'));
  var previousButton = element(by.id('previousButton'));
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

  this.getDisplayAddedPage = function() {
    return displayAddedPage;
  };

  this.getPreconfiguredPlayerButton = function() {
    return preconfiguredPlayerButton;
  };

  this.getOwnPlayerButton = function() {
    return ownPlayerButton;
  };

  this.getUserPlayerPanel = function() {
    return userPlayerPanel;
  };

  this.getUserPlayerPage = function() {
    return userPlayerPage;
  };

  this.getPickWindowsLink = function() {
    return pickWindowsLink;
  };

  this.getDownloadWindows64Button = function() {
    return downloadWindows64Button;
  };

  this.getPreconfiguredPlayerLink = function() {
    return preconfiguredPlayerLink;
  };

  this.getPreconfiguredPlayerPage = function() {
    return preconfiguredPlayerPage;
  };

  this.getPurchasePlayerLink = function() {
    return purchasePlayerLink;
  };

  this.getDisplayIdField = function() {
    return displayIdField;
  };

  this.getEmailedInstructions = function() {
    return emailedInstructions;
  };

  this.getNextButton = function() {
    return nextButton;
  };

  this.getPreviousButton = function() {
    return previousButton;
  };

  this.getDismissButton = function() {
    return dismissButton;
  };

};

module.exports = DisplayAddModalPage;
