'use strict';
var PresentationPropertiesModalPage = function() {
  var presentationPropertiesModal = element(by.id('presentationPropertiesModal'));
  var modalTitle = element(by.css('.modal-title'));

  var dismissButton = element(by.id('dismissButton'));

  var nameLabel = element(by.id('nameLabel'));
  var nameInput = element(by.id('nameInput'));
  var presentationId = element(by.id('presentationId'));

  var copyPresentationButton = element(by.id('copyPresentationButton'));

  var resolutionLabel = element(by.id('resolutionLabel'));
  var resolutionSelect = element(by.id('resolutionSelect'));
  var customResolution = element(by.id('customResolution'));

  var backgroundLabel = element(by.id('backgroundLabel'));
  var backgroundImageSettings = element(by.id('backgroundImageSettings'));
  var backgroundColorInput = element(by.css('#backgroundImageSettings input'));
  
  // Due to CSS issue Checkbox is not clickable; use Label instead
  var backgroundImageCheckbox = element(by.css('#backgroundImageSettings .checkbox label'));
  var backgroundImageURLInput = element(by.css('#backgroundImageUrl input'));
  var backgroundImageStorageButton = element(by.css('.input-url-addon button'));

  var playUntilDonePlaceholderLabel = element(by.id('playUntilDonePlaceholderLabel'));
  var playUntilDonePlaceholderSelect = element(by.id('playUntilDonePlaceholderSelect'));
  var hideMousePointerCheckboxLabel = element(by.id('hideMousePointerCheckboxLabel'));
  var hideMousePointerCheckbox = element(by.id('hideMousePointerCheckbox'));

  var applyButton = element(by.id('applyButton'));
  var cancelButton = element(by.id('presentationPropertiesCancelButton'));

  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.buttonText('Delete Forever'));


  this.getWorkspaceContainer = function() {
    return workspaceContainer;
  };

  this.getPresentationPropertiesModal = function() {
    return presentationPropertiesModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };

  this.getNameLabel = function() {
    return nameLabel;
  };

  this.getNameInput = function() {
    return nameInput;
  };

  this.getPresentationId = function() {
    return presentationId;
  };

  this.getCopyPresentationButton = function() {
    return copyPresentationButton;
  };

  this.getResolutionLabel = function() {
    return resolutionLabel;
  };

  this.getResolutionSelect = function() {
    return resolutionSelect;
  };

  this.getBackgroundLabel = function() {
    return backgroundLabel;
  };

  this.getBackgroundColorInput = function() {
    return backgroundColorInput;
  };

  this.getBackgroundImageSettings = function() {
    return backgroundImageSettings;
  };
  
  this.getBackgroundImageCheckbox = function() {
    return backgroundImageCheckbox;
  };
  
  this.getBackgroundImageURLInput = function() {
    return backgroundImageURLInput;
  };
    
  this.getBackgroundImageStorageButton = function() {
    return backgroundImageStorageButton;
  };

  this.getPlayUntilDonePlaceholderLabel = function() {
    return playUntilDonePlaceholderLabel;
  };

  this.getPlayUntilDonePlaceholderSelect = function() {
    return playUntilDonePlaceholderSelect;
  };

  this.getHideMousePointerCheckboxLabel = function() {
    return hideMousePointerCheckboxLabel;
  };

  this.getHideMousePointerCheckbox = function() {
    return hideMousePointerCheckbox;
  };

  this.getApplyButton = function() {
    return applyButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };

  this.getDeleteButton = function() {
    return deleteButton;
  };

  this.getDeleteForeverButton = function() {
    return deleteForeverButton;
  };
  
};

module.exports = PresentationPropertiesModalPage;
