'use strict';
var DisplayManagePage = function() {
  var displaysAppContainer = element(by.css('.displays-app'));
  var title = element(by.id('title'));

  var displayNameField = element(by.css('display-fields stretchy-input input'));  
  var displayNameEditButton = element(by.css('display-fields stretchy-input #editButton'));

  var notActivatedPlayerLink = element(by.id('notActivatedLink'));
  var displayActionsButton = element(by.id('displayActionsButton'));
  var installPlayerButton = element(by.id('installPlayer'));
  var displayUseCompanyAddressCheckbox = element(by.model('display.useCompanyAddress'));
  var displayRebootCheckbox = element(by.model('display.restartEnabled'));
  var viewScheduleLink = element(by.id('viewSchedule'));

  var displayCountrySelect = element(by.model('display.country'));  
  var displayTimeZoneSelect = element(by.model('display.timeZoneOffset'));  

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

  this.getNotActivatedPlayerLink = function() {
    return notActivatedPlayerLink;
  };

  this.getDisplayActionsButton = function() {
    return displayActionsButton;
  };

  this.getInstallPlayerButton = function() {
    return installPlayerButton;
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
