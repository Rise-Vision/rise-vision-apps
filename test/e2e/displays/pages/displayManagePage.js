'use strict';
var DisplayManagePage = function() {
  var displaysAppContainer = element(by.css('.displays-app'));
  var title = element(by.id('title'));

  var displayNameField = element(by.css('display-fields stretchy-input input'));  
  var displayNameEditButton = element(by.css('display-fields stretchy-input #editButton'));

  var notActivatedPlayerLink = element(by.id('notActivatedLink'));
  var installPlayerButton = element(by.id('installPlayer'));
  var displayUseCompanyAddressCheckbox = element(by.model('display.useCompanyAddress'));
  var displayRebootCheckbox = element(by.model('display.restartEnabled'));
  var viewScheduleLink = element(by.id('viewSchedule'));

  var displayCountrySelect = element(by.model('display.country'));  
  var displayTimeZoneSelect = element(by.model('display.timeZoneOffset'));  

  var displayHoursField = element(by.model('hours'));
  var displayMinutesField = element(by.model('minutes'));
  var displayMeridianButton = element(by.id('meridianButton'));

  var saveButton = element(by.id('saveButton'));
  var cancelButton = element(by.id('cancelButton'));

  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.buttonText('Delete Forever'));

  var displayLoader = element(by.xpath('//div[@spinner-key="display-loader"]'));

  var displayErrorBox = element(by.id('errorBox'));

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

  this.getDisplayErrorBox = function() {
    return displayErrorBox;
  };
};

module.exports = DisplayManagePage;
