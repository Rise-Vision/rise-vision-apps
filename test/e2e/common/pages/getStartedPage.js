'use strict';

var GetStartedPage = function() {
  var getStartedContainer = element(by.css('.app-launcher-wizard'));

  var wizardStep1 = element(by.id('wizardStep1'));
  var wizardStep2 = element(by.id('wizardStep2'));
  var wizardStep3 = element(by.id('wizardStep3'));
  var wizardStep4 = element(by.id('wizardStep4'));

  var getStartedButton1 = element(by.id('getStartedButton1'));
  var getStartedButton2 = element(by.id('getStartedButton2'));
  var getStartedButton3 = element(by.id('getStartedButton3'));
  var getStartedAddPresentation = element(by.id('getStartedAddPresentation'));

  this.getGetStartedContainer = function() {
    return getStartedContainer;
  };

  this.getWizardStep1 = function() {
    return wizardStep1;
  };

  this.getWizardStep2 = function() {
    return wizardStep2;
  };

  this.getWizardStep3 = function() {
    return wizardStep3;
  };

  this.getWizardStep4 = function() {
    return wizardStep4;
  };

  this.getGetStartedButton1 = function() {
    return getStartedButton1;
  };

  this.getGetStartedButton2 = function() {
    return getStartedButton2;
  };

  this.getGetStartedButton3 = function() {
    return getStartedButton3;
  };

  this.getGetStartedAddPresentation = function() {
    return getStartedAddPresentation;
  };


};

module.exports = GetStartedPage;
