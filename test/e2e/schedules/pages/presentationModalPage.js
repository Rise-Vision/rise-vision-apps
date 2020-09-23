'use strict';
var PresentationModalPage = function() {
  var addPresentationModal = element(by.id('addPresentationModal'));
  var modalTitle = element(by.css('#addPresentationModal .modal-title'));
  var presentationSearchInput = element(by.id('presentationSearchInput'));
  var presentationListTable = element(by.id('presentationListTable'));
  var presentationItems = element.all(by.repeater('presentation in presentations.items.list'));
  var presentationListLoader = element(by.xpath('//div[@spinner-key="presentation-list-loader"]'));
  var presentationNames = element.all(by.css('#addPresentationModal #presentationName'));
  var selectPresentationsButton = element(by.id('selectPresentations'));
  var closeButton = element(by.css('#addPresentationModal > div.modal-header > button'));

  this.getAddPresentationModal = function() {
    return addPresentationModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };

  this.getPresentationSearchInput = function() {
    return presentationSearchInput;
  };

  this.getPresentationListTable = function() {
    return presentationListTable;
  };

  this.getPresentationItems = function() {
    return presentationItems;
  };

  this.getPresentationListLoader = function() {
    return presentationListLoader;
  };
  
  this.getPresentationNames = function() {
    return presentationNames;
  };

  this.getSelectPresentationsButton = function() {
    return selectPresentationsButton;
  };
  
  this.getCloseButton = function() {
    return closeButton;
  };

};

module.exports = PresentationModalPage;
