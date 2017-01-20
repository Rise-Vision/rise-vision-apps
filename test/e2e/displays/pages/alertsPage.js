'use strict';
var AlertsPage = function() {
  var displaysAppContainer = element(by.css('.displays-app'));
  var title = element(by.id('title'));
  
  var alertsToggleButton = element(by.id('alertsToggleButton'));

  var termsAcceptedCheckbox = element(by.id('termsAcceptedCheckbox'));
  var iAcceptLabel = element(by.id('iAcceptLabel'));
  var toggleShowTerms = element(by.id('toggleShowTerms'));
  var termsText = element(by.id('termsText'));

  var alertsOffWarningContainer = element(by.id('alertsOffWarningContainer'));

  var webserviceUrlInput = element(by.id('webserviceUrlInput'));
  var urlResetButton = element(by.id('urlResetButton'));
  var usernameInput = element(by.id('usernameInput'));
  var passwordInput = element(by.id('passwordInput'));

  var filtersContainer = element(by.id('filtersContainer'));
  var toggleFilters = element(by.id('toggleFilters'));

  var senderContainer = element(by.id('senderContainer'));
  var handlingContainer = element(by.id('handlingContainer'));
  var codeContainer = element(by.id('codeContainer'));
  var statusLabel = element(by.id('statusLabel'));
  var categoryLabel = element(by.id('categoryLabel'));
  var urgencyLabel = element(by.id('urgencyLabel'));
  var severetyLabel = element(by.id('severetyLabel'));
  var certaintyLabel = element(by.id('certaintyLabel'));

  var textToShowLabel = element(by.id('textToShowLabel'));
  var defaultExpiryInput = element(by.id('defaultExpiryInput'));

  var distributeToAllText = element(by.id('distributeToAllText'));
  var distributionField = element(by.id('distributionField'));
  var presentationField = element(by.id('presentationField'));
  
  var saveButton = element(by.id('saveButton'));
  var cancelButton = element(by.id('cancelButton'));
  
  this.getPresentationField = function() {
    return presentationField;
  };

  this.getDistributeToAllText = function() {
    return distributeToAllText;
  };

  this.getDistributionField = function() {
    return distributionField;
  };

  this.getTextToShowLabel = function() {
    return textToShowLabel;
  };

  this.getDefaultExpiryInput = function() {
    return defaultExpiryInput;
  };

  this.getSenderContainer = function() {
    return senderContainer;
  };

  this.getHandlingContainer = function() {
    return handlingContainer;
  };

  this.getCodeContainer = function() {
    return codeContainer;
  };

  this.getStatusLabel = function() {
    return statusLabel;
  };

  this.getCategoryLabel = function() {
    return categoryLabel;
  };

  this.getUrgencyLabel = function() {
    return urgencyLabel;
  };

  this.getSeveretyLabel = function() {
    return severetyLabel;
  };

  this.getCertaintyLabel = function() {
    return certaintyLabel;
  };

  this.getFiltersContainer = function() {
    return filtersContainer;
  };

  this.getToggleFilters = function() {
    return toggleFilters;
  };

  this.getWebserviceUrlInput = function() {
    return webserviceUrlInput;
  };

  this.getUrlResetButton = function() {
    return urlResetButton;
  };

  this.getUsernameInput = function() {
    return usernameInput;
  };

  this.getPasswordInput = function() {
    return passwordInput;
  };


  this.getAlertsOffWarningContainer = function() {
    return alertsOffWarningContainer;
  };

  this.getDisplaysAppContainer = function() {
    return displaysAppContainer;
  };

  this.getAlertsToggleButton = function() {
    return alertsToggleButton;
  };

  this.getTermsAcceptedCheckbox = function() {
    return termsAcceptedCheckbox;
  };

  this.getIAcceptLabel = function() {
    return iAcceptLabel;
  };
  
  this.getToggleShowTerms = function() {
    return toggleShowTerms;
  };
  
  this.getTermsText = function() {
    return termsText;
  };

  this.getTitle = function() {
    return title;
  };

  this.getSaveButton = function() {
    return saveButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };
};

module.exports = AlertsPage;
