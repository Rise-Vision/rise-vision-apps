'use strict';
var DistributionModalPage = function() {
  var editDistributionModal = element(by.id('distributionModal'));
  var modalTitle = element(by.css('.modal-title'));

  var distributionSearchInput = element(by.id('displaySearchInput'));
  var distributionListTable = element(by.id('displayListTable'));
  var distributionItems = element.all(by.css('.display'));
  var distributionListLoader = element(by.css('#distributionModal .spinner-backdrop'));

  var applyButton = element(by.id('applyButton'));
  var cancelButton = element(by.id('distributionModalCancelButton'));


  this.getEditDistributionModal = function() {
    return editDistributionModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };



  this.getDistributionSearchInput = function() {
    return distributionSearchInput;
  };

  this.getDistributionListTable = function() {
    return distributionListTable;
  };

  this.getDistributionItems = function() {
    return distributionItems;
  };

  this.getDistributionListLoader = function() {
    return distributionListLoader;
  };

  this.getApplyButton = function() {
    return applyButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };

};

module.exports = DistributionModalPage;
