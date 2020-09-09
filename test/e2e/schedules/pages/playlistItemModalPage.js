'use strict';
var PlaylistItemModalPage = function() {
  var playlistItemModal = element(by.id('playlistItemModal'));
  var modalTitle = element(by.css('#playlistItemModal .modal-title'));
  var nameTextbox = element(by.id('itemName'));
  var durationTextbox = element(by.id('itemDuration'));
  // url item fields
  var urlInput = element(by.id('url'));
  var storageSelectorIcon = element(by.tagName('storage-selector'));
  // presentation item fields
  var presentationNameField = element(by.css('#playlistItemModal #presentationName'));

  var invalidUrlMessage = element(by.cssContainingText('form div p', 'Please provide a valid URL.'));
  var requiredFieldMessage = element(by.cssContainingText('form div p', 'This field is required.'));
  var insecureUrlMessage = element(by.cssContainingText('form div p', 'Please use secure URLs'));
  
  var saveButton = element(by.id('itemSave'));

  this.getPlaylistItemModal = function () {
    return playlistItemModal;
  };

  this.getModalTitle = function () {
    return modalTitle;
  };

  this.getNameTextbox = function() {
    return nameTextbox;
  };
  
  this.getDurationTextbox = function() {
    return durationTextbox;
  };
  
  this.getUrlInput = function() {
    return urlInput;
  };

  this.getStorageSelectorIcon = function() {
    return storageSelectorIcon;
  };
  
  this.getPresentationNameField = function() {
    return presentationNameField;
  };

  this.getInvalidUrlMessage = function() {
    return invalidUrlMessage;
  }

  this.getRequiredFieldMessage = function() {
    return requiredFieldMessage;
  }

  this.getInsecureUrlMessage = function() {
    return insecureUrlMessage;
  };

  this.getSaveButton = function() {
    return saveButton;
  };
  
};

module.exports = PlaylistItemModalPage;
