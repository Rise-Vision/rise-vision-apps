'use strict';
var PlansModalPage = function() {
  var plansModal = element(by.id('plans-modal'));
  var startTrialBasicButton = element.all(by.css('#start-trial-plan')).get(1);

  var closeButton = element(by.id('closeButton'));

  this.getPlansModal = function() {
    return plansModal;
  };

  this.getStartTrialBasicButton = function() {
    return startTrialBasicButton;
  };

  this.getCloseButton = function() {
    return closeButton;
  };
};

module.exports = PlansModalPage;
