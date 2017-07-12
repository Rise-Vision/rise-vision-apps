'use strict';

var OnboardingPage = function() {
  
  var onboardingBar = element(by.id('onboardingBar'));
  var addPresentation = element(by.id('onboardingAddPresentation'));
  var addPresentationButton = element(by.id('onboardingAddPresentationButton'));

  var addDisplay = element(by.id('onboardingAddDisplay'));
  var addDisplayButton = element(by.id('onboardingAddDisplayButton'));

  var activateDisplay = element(by.id('onboardingActivateDisplay'));
  var activateDisplayButton = element(by.id('onboardingActivateDisplayButton'));

  var stepCount = element(by.id('stepCount'));

  this.getOnboardingBar = function() {
    return onboardingBar;
  };

  this.getAddPresentation = function() {
    return addPresentation;
  };

  this.getAddPresentationButton = function() {
    return addPresentationButton;
  };

  this.getAddDisplay = function() {
    return addDisplay;
  };

  this.getAddDisplayButton = function() {
    return addDisplayButton;
  };

  this.getActivateDisplay = function() {
    return activateDisplay;
  };

  this.getActivateDisplayButton = function() {
    return activateDisplayButton;
  };

  this.getStepCount = function() {
    return stepCount;
  };

};

module.exports = OnboardingPage;
