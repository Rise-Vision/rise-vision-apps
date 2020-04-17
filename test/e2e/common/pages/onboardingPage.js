'use strict';
var OnboardinPage = function() {
  var onboardingContainer = element(by.id('onboardingContainer'));

  var stepsTabs = element.all(by.css('#stepsTabs li'));
  var addTemplateStep = element(by.id('onboardingAddTemplate'));
  var addDisplayStep = element(by.id('onboardingAddDisplay'));
  
  var pickTemplateButtons = element.all(by.id('selectProduct'));

  var nextStepButton = element(by.id('nextStep'));
  var previousStepButton = element(by.id('previousStep'));
  

  this.getOnboardingContainer = function() {
    return onboardingContainer;
  };

  this.getStepsTabs = function() {
    return stepsTabs;
  };

  this.getAddTemplateStep = function() {
    return addTemplateStep;
  };

  this.getAddDisplayStep = function() {
    return addDisplayStep;
  };

  this.getPickTemplateButtons = function() {
    return pickTemplateButtons;
  };

  this.getNextStepButton = function() {
    return nextStepButton;
  };

  this.getPreviousStepButton = function() {
    return previousStepButton;
  };

};

module.exports = OnboardinPage;
