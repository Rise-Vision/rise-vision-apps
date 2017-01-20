'use strict';
var PresentationModalPage = function() {
  var addPresentationModal = element(by.id('addPresentationModal'));
  var modalTitle = element(by.css('#addPresentationModal .modal-title'));
  var presentationSearchInput = element(by.id('presentationSearchInput'));
  var presentationListTable = element(by.id('presentationListTable'));
  var presentationItems = element.all(by.repeater('presentation in presentations.list'));
  var presentationListLoader = element(by.css('#addPresentationModal .spinner-backdrop'));
  var presentationNames = element.all(by.css('#addPresentationModal #presentationName'));

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

};

module.exports = PresentationModalPage;
