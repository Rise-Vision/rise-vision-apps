'use strict';
var DisplayManagePage = function() {
  var displaysAppContainer = element(by.css('.displays-app'));
  var title = element(by.id('title'));

  var displayNameField = element(by.css('display-fields stretchy-input input'));  
  var displayNameEditButton = element(by.css('display-fields stretchy-input #editButton'));

  var displayInstructionsPanel = element(by.css('.display-instructions-panel'));
  var purchasePlayerButton = element(by.id('purchasePlayerButton'));
  var installPlayerButton = element(by.id('installPlayerButton'));
  var displayActionsButton = element(by.id('displayActionsButton'));
  var purchasePlayerActionButton = element(by.id('purchasePlayerAction'));
  var installPlayerActionButton = element(by.id('installPlayerAction'));
  var displayUseCompanyAddressCheckbox = element(by.id('useCompanyAddress'));
  var displayRebootCheckbox = element(by.id('restartEnabled'));
  var viewScheduleLink = element(by.id('viewSchedule'));

  var displayCountrySelect = element(by.model('factory.display.country'));  
  var displayTimeZoneSelect = element(by.model('factory.display.timeZoneOffset'));  

  var saveButton = element(by.id('saveButton'));
  var cancelButton = element(by.id('cancelButton'));

  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.id('confirm-primary'));

  var displayLoader = element(by.xpath('//div[@spinner-key="display-loader"]'));

  this.getDisplaysAppContainer = function() {
    return displaysAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getDisplayNameField = function() {
    return displayNameField;
  };

  this.getDisplayNameEditButton = function() {
    return displayNameEditButton;
  };

  this.getDisplayInstructionsPanel = function() {
    return displayInstructionsPanel;
  };

  this.getPurchasePlayerButton = function() {
    return purchasePlayerButton;
  };

  this.getInstallPlayerButton = function() {
    return installPlayerButton;
  };

  this.getDisplayActionsButton = function() {
    return displayActionsButton;
  };

  this.getPurchasePlayerActionButton = function() {
    return purchasePlayerActionButton;
  };

  this.getInstallPlayerActionButton = function() {
    return installPlayerActionButton;
  };

  this.getDisplayUseCompanyAddressCheckbox = function() {
    return displayUseCompanyAddressCheckbox;
  };

  this.getDisplayRebootCheckbox = function() {
    return displayRebootCheckbox;
  };

  this.getViewScheduleLink = function() {
    return viewScheduleLink;
  };

  this.getDisplayCountrySelect = function() {
    return displayCountrySelect;
  };

  this.getDisplayTimeZoneSelect = function() {
    return displayTimeZoneSelect;
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

  this.getDeleteForeverButton = function() {
    return deleteForeverButton;
  };

  this.getDisplayLoader = function() {
    return displayLoader;
  };

};

module.exports = DisplayManagePage;
