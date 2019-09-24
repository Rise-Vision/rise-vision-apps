/*globals element, by */
(function(module) {
  'use strict';

  var CompanySettingsModalPage = function () {
    var companySettingsModal = element(by.css(".company-settings-modal"));
    var loader = element(by.xpath('//div[@spinner-key="company-settings-modal"]'));

    var nameField = element(by.id("company-settings-name"));
    var streetField = element(by.id("company-settings-street"));

    var formError = element(by.id("errorBox"));
    
    var authKeyField = element(by.css(".ps-auth-key"));
    var claimIdField = element(by.css(".ps-claim-id"));
    var resetAuthKeyButton = element(by.css(".ps-reset-auth-key"));
    var resetClaimIdButton = element(by.css(".ps-reset-claim-id"));

    var saveButton = element(by.id("save-button"));
    var closeButton = element(by.id("close-button"));
    var deleteButton = element(by.id("delete-button"));
    
    this.getCompanySettingsModal = function() {
      return companySettingsModal;
    };
    
    this.getLoader = function() {
      return loader;
    };
    
    this.getNameField = function() {
      return nameField;
    };

    this.getStreetField = function() {
      return streetField;
    };

    this.getFormError = function() {
      return formError;
    };

    this.getAuthKeyField = function() {
      return authKeyField;
    };
    
    this.getClaimIdField = function() {
      return claimIdField;
    };
    
    this.getResetAuthKeyButton = function() {
      return resetAuthKeyButton;
    };
    
    this.getResetClaimIdButton = function() {
      return resetClaimIdButton;
    };

    this.getSaveButton = function() {
      return saveButton;
    };
    
    this.getCloseButton = function() {
      return closeButton;
    };
    
    this.getDeleteButton = function() {
      return deleteButton;
    };
    
  };

  module.exports = CompanySettingsModalPage;
})(module);
