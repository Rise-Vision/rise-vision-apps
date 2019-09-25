/*globals element, by */
(function(module) {
  'use strict';

  var UserSettingsModalPage = function () {
    var userSettingsModal = element(by.css(".user-settings-modal"));
    var loader = element(by.xpath('//div[@spinner-key="user-settings-modal"]'));
    var usernameField = element(by.id("user-settings-username"));
    var usernameLabel = element(by.id("user-settings-username-label"));
    var firstNameField = element(by.id("user-settings-first-name"));
    var lastNameField = element(by.id("user-settings-last-name"));
    var phoneField = element(by.id("user-settings-phone"));
    var emailField = element(by.id("user-settings-email"));
    var ceCheckbox = element(by.id("user-settings-ce"));
    var cpCheckbox = element(by.id("user-settings-cp"));
    var daCheckbox = element(by.id("user-settings-da"));
    var uaCheckbox = element(by.id("user-settings-ua"));
    var saveButton = element(by.id("save-button"));
    var deleteButton = element(by.id("delete-button"));
    
    this.getUserSettingsModal = function() {
      return userSettingsModal;
    };
    
    this.getLoader = function() {
      return loader;
    };
    
    this.getUsernameField = function() {
      return usernameField;
    };

    this.getUsernameLabel = function() {
      return usernameLabel;
    };

    this.getFirstNameField = function() {
      return firstNameField;
    };

    this.getLastNameField = function() {
      return lastNameField;
    };
    
    this.getPhoneField = function() {
      return phoneField;
    };
    
    this.getEmailField = function() {
      return emailField;
    };
    
    this.getCeCheckbox = function() {
      return ceCheckbox;
    };
    
    this.getCpCheckbox = function() {
      return cpCheckbox;
    };
    
    this.getDaCheckbox = function() {
      return daCheckbox;
    };

    this.getUaCheckbox = function() {
      return uaCheckbox;
    };

    this.getSaveButton = function() {
      return saveButton;
    };
    
    this.getDeleteButton = function() {
      return deleteButton;
    };
    
  };

  module.exports = UserSettingsModalPage;
})(module);
