'use strict';
var PresentationItemModalPage = function() {
  var presentationItemModal = element(by.id('presentationItemModal'));
  var modalTitle = element(by.css('#presentationItemModal .modal-title'));
  var presentationNameField = element(by.id('presentationName'));
  var presentationIdTextBox = element(by.id('presentationId'));
  var selectPresentationButton = element(by.id('selectPresentationButton'));
  var enterPresentationIdButton = element(by.id('enterPresentationIdButton'));

  var saveButton = element(by.id('presentationItemSave'));

  this.getPresentationItemModal = function () {
    return presentationItemModal;
  };

  this.getModalTitle = function () {
    return modalTitle;
  };

  this.getPresentationNameField = function() {
    return presentationNameField;
  };

  this.getPresentationIdTextBox = function() {
    return presentationIdTextBox;
  };

  this.getSelectPresentationButton = function() {
    return selectPresentationButton;
  };

  this.getEnterPresentationIdButton = function() {
    return enterPresentationIdButton;
  };

  this.getSaveButton = function() {
    return saveButton;
  };
  
};

module.exports = PresentationItemModalPage;
