'use strict';
var WidgetByUrlModalPage = function() {
  var addWidgetByUrlModal = element(by.id('addWidgetByUrlModal'));
  var modalTitle = element(by.css('#addWidgetByUrlModal .modal-title'));

  var urlInput = element(by.id('urlInput'));
  var settingsUrlInput = element(by.id('settingsUrlInput'));
  var warningRequired = element(by.id('warningRequired'));
  var warningInvalidUrl = element(by.id('warningInvalidUrl'));

  var applyButton = element(by.id('applyButton'));


  this.getAddWidgetByUrlModal = function() {
    return addWidgetByUrlModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };

  this.getUrlInput = function() {
    return urlInput;
  };

  this.getSettingsUrlInput = function() {
    return settingsUrlInput;
  };

  this.getApplyButton = function() {
    return applyButton;
  };

  this.getWarningRequired = function() {
    return warningRequired;
  };

  this.getWarningInvalidUrl = function() {
    return warningInvalidUrl;
  };

};

module.exports = WidgetByUrlModalPage;
