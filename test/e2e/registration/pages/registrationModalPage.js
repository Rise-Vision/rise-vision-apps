/*globals element, by */
(function(module) {
  'use strict';

  var RegistrationModalPage = function () {
    var registrationModal = element(by.css("#registration-modal"));
    var loader = element(by.xpath('//div[@spinner-key="company-settings-modal"]'));
    
    var firstNameField = element(by.css("#registration-modal .firstName"));
    var lastNameField = element(by.css("#registration-modal .lastName"));
    var companyNameField = element(by.css("#registration-modal .companyName"));
    var companyIndustryDropdown = element(by.css("#registration-modal .companyIndustry"));
    var companyIndustryOptions = element.all(by.tagName('option'));
    var termsCheckbox = element(by.css(".accept-terms-checkbox"));
    
    var validationTermsAccepted = element(by.css(".validation-error-message-accepted"));
    var validationFirstName = element(by.css(".validation-error-message-first-name"));
    var validationLastName = element(by.css(".validation-error-message-last-name"));
    var validationCompanyName = element(by.css(".validation-error-message-company-name"));
    var validationCompanyIndustry = element(by.css(".validation-error-message-company-industry"));
    
    var saveButton = element(by.css(".registration-save-button"));
    var cancelButton = element(by.css(".registration-cancel-button"));
    
    this.getRegistrationModal = function() {
      return registrationModal;
    };
    
    this.getLoader = function() {
      return loader;
    };
    
    this.getFirstNameField = function() {
      return firstNameField;
    };

    this.getLastNameField = function() {
      return lastNameField;
    };
    
    this.getCompanyNameField = function() {
      return companyNameField;
    };
    
    this.getCompanyIndustryDropdown = function() {
      return companyIndustryDropdown;
    };
    
    this.getCompanyIndustryOptions = function() {
      return companyIndustryOptions;
    };
    
    this.getTermsCheckbox = function() {
      return termsCheckbox;
    };

    this.getValidationTermsAccepted = function() {
      return validationTermsAccepted;
    };
    
    this.getValidationFirstName = function() {
      return validationFirstName;
    };
    
    this.getValidationLastName = function() {
      return validationLastName;
    };

    this.getValidationCompanyName = function() {
      return validationCompanyName;
    };
    
    this.getValidationCompanyIndustry = function() {
      return validationCompanyIndustry;
    };

    this.getSaveButton = function() {
      return saveButton;
    };
    
    this.getCancelButton = function() {
      return cancelButton;
    };
        
  };

  module.exports = RegistrationModalPage;
})(module);
