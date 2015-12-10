'use strict';
var DisplayAddPage = function() {
  var displaysAppContainer = element(by.css('.displays-app'));
  var title = element(by.id('title'));
  var displayNameField = element(by.model('display.name'));
  var displayStatusSelect = element(by.model('display.status'));
  var displayUseCompanyAddressCheckbox = element(by.model('display.useCompanyAddress'));
  var displayRebootCheckbox = element(by.model('display.restartEnabled'));

  var displayHoursField = element(by.model('hours'));
  var displayMinutesField = element(by.model('minutes'));
  var displayMeridianButton = element(by.id('meridianButton'));

  var saveButton = element(by.id('saveButton'));
  var cancelButton = element(by.id('cancelButton'));

  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.buttonText('Delete Forever'));

  var displayLoader = element(by.id('display-loader'));

  this.getDisplaysAppContainer = function() {
    return displaysAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getDisplayNameField = function() {
    return displayNameField;
  };

  this.getDisplayStatusSelect = function() {
    return displayStatusSelect;
  };

  this.getDisplayUseCompanyAddressCheckbox = function() {
    return displayUseCompanyAddressCheckbox;
  };

  this.getDisplayRebootCheckbox = function() {
    return displayRebootCheckbox;
  };

  this.getDisplayHoursField = function() {
    return displayHoursField;
  };

  this.getDisplayMinutesField = function() {
    return displayMinutesField;
  };

  this.getDisplayMeridianButton = function() {
    return displayMeridianButton;
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

module.exports = DisplayAddPage;
