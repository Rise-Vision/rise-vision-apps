'use strict';
var PresentationModalPage = function() {
  var addPresentationModal = element(by.id('addPresentationModal'));
  var modalTitle = element(by.css('#addPresentationModal .modal-title'));
  var closeButton = element(by.css('#addPresentationModal > div.modal-header > button'));
  
  this.getAddPresentationModal = function() {
    return addPresentationModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };
  this.getCloseButton = function() {
    return closeButton;
  };
    
};

module.exports = PresentationModalPage;
