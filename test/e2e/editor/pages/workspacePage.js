'use strict';
var WorkspacePage = function() {
  var workspaceContainer = element(by.id('workspace'));
  var artboardContainer = element(by.id('artboard'));

  var expandArtboardButton = element(by.id('expandArtboardButton'));
  var presentationPropertiesButton = element(by.id('presentationPropertiesButton'));
  var addPlaceholderButton = element(by.id('addPlaceholderButton'));
  var previewButton = element(by.id('previewButton'));
  var saveButton = element(by.id('saveButton'));
  var cancelButton = element(by.id('cancelButton'));
  var deleteButton = element(by.id('deleteButton'));
  var restoreButton = element(by.id('restoreButton'));
  var publishButton = element(by.id('publishButton'));
  var designButton = element(by.id('designButton'));
  var htmlButton = element(by.id('htmlButton'));
  var deleteForeverButton = element(by.buttonText('Delete Forever'));
  var codemirrorHtmlEditor = element(by.id('codemirrorHtmlEditor'));
  var presentationNameContainer = element(by.id('presentationName'));
  var backToListButton = element(by.id('backToListButton'));

  var saveStatus = element(by.css(".save-status"));


  var errorBox = element(by.id('errorBox'));

  var presentationLoader = element(by.xpath('//div[@spinner-key="presentation-loader"]'));

  this.getWorkspaceContainer = function() {
    return workspaceContainer;
  };

  this.getArtboardContainer = function() {
    return artboardContainer;
  };

  this.getExpandArtboardButton = function() {
    return expandArtboardButton;
  };

  this.getPresentationPropertiesButton = function() {
    return presentationPropertiesButton;
  };

  this.getPreviewButton = function() {
    return previewButton;
  };

  this.getSaveButton = function() {
    return saveButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };

  this.getDeleteButton = function() {
    return deleteButton;
  };

  this.getRestoreButton = function() {
    return restoreButton;
  };

  this.getPublishButton = function() {
    return publishButton;
  };

  this.getDesignButton = function() {
    return designButton;
  };

  this.getHtmlButton = function() {
    return htmlButton;
  };

  this.getDeleteForeverButton = function() {
    return deleteForeverButton;
  };

  this.getAddPlaceholderButton = function() {
    return addPlaceholderButton;
  };

  this.getCodemirrorHtmlEditor = function() {
    return codemirrorHtmlEditor;
  };

  this.getErrorBox = function () {
    return errorBox;
  };

  this.getPresentationLoader = function () {
    return presentationLoader;
  };

  this.getSaveStatus = function () {
    return saveStatus;
  }

  this.getPresentationNameContainer = function () {
    return presentationNameContainer;
  }

  this.getBackToListButton = function () {
    return backToListButton;
  }


};

module.exports = WorkspacePage;
