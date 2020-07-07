/*globals element, by */
(function(module) {
  'use strict';

  var MoveCompanyModalPage = function () {
    var moveCompanyModal = element(by.css(".move-company-modal"));
    var loader = element(by.xpath('//div[@spinner-key="move-company-modal"]'));
    var authKeyField = element(by.id("auth-key"));
    
    var retrieveDetailsButton = element(by.css(".retrieve-company-details-button"));
    var notFoundMessage = element(by.css(".move-company-modal .alert.alert-danger"));
    var companyDetailsMessage = element(by.css(".company-details-info"));
    var successMessage = element(by.css(".alert.alert-success"));
    
    var moveButton = element(by.css(".move-company-button"));    
    var closeButton = element(by.css(".close-move-company-button"));
    
    this.getMoveCompanyModal = function() {
      return moveCompanyModal;
    };
    
    this.getLoader = function() {
      return loader;
    };
    
    this.getAuthKeyField = function() {
      return authKeyField;
    };
    
    this.getRetrieveDetailsButton = function() {
      return retrieveDetailsButton;
    };
    
    this.getNotFoundMessage = function() {
      return notFoundMessage;
    };
    
    this.getCompanyDetailsMessage = function() {
      return companyDetailsMessage;
    };

    this.getSuccessMessage = function() {
      return successMessage;
    };

    this.getMoveButton = function() {
      return moveButton;
    };

    this.getCloseButton = function() {
      return closeButton;
    };
        
  };

  module.exports = MoveCompanyModalPage;
})(module);
