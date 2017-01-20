'use strict';
var DistributionModalPage = function() {
  var editDistributionModal = element(by.id('distributionModal'));
  var modalTitle = element(by.css('.modal-title'));
  var cancelButton = element(by.id('distributionModalCancelButton'));

  this.getEditDistributionModal = function() {
    return editDistributionModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };

};

module.exports = DistributionModalPage;
