'use strict';
var OnboardinPage = function() {
  var onboardingContainer = element(by.id('onboardingContainer')); 

  this.getOnboardingContainer = function() {
    return onboardingContainer;
  };

};

module.exports = OnboardinPage;
