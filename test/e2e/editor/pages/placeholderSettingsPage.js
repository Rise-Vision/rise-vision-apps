'use strict';
var PlaceholderSettingsPage = function() {
  var editPlaylistButton = element(by.id('editPlaylistButton'));
  var editPropertiesButton = element(by.id('editPropertiesButton'));
  var idTextbox = element(by.id('placeholderId'));
  var newIdTextbox = element(by.id('placeholderNewId'));
  var requiredValidation = element(by.id('requiredValidation'));
  var invalidValidation = element(by.id('invalidValidation'));
  var duplicateValidation = element(by.id('duplicateValidation'));
  var editNameLink = element(by.id('editPlaceholderName'));
  var saveNameLink = element(by.id('savePlaceholderName'));
  var cancelNameLink = element(by.id('cancelPlaceholderName'));
  var transitionSelect = element(by.id('transitionSelect'));
  
  
  this.getEditPlaylistButton = function() {
    return editPlaylistButton;
  };

  this.getEditPropertiesButton = function() {
    return editPropertiesButton;
  };
  
  this.getIdTextbox = function() {
    return idTextbox;
  };
  
  this.getNewIdTextbox = function() {
    return newIdTextbox;
  };
  
  this.getRequiredValidation = function() {
    return requiredValidation;
  };
  
  this.getInvalidValidation = function() {
    return invalidValidation;
  };

  this.getDuplicateValidation = function() {
    return duplicateValidation;
  };
  
  this.getEditNameLink = function() {
    return editNameLink;
  };
  
  this.getSaveNameLink = function() {
    return saveNameLink;
  };
  
  this.getCancelNameLink = function() {
    return cancelNameLink;
  };

  this.getTransitionSelect = function() {
    return transitionSelect;
  };
  
};

module.exports = PlaceholderSettingsPage;
