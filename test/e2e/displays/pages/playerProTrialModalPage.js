'use strict';
var PlayerProTrialModalPage = function() {
  var playerProTrialModal = element(by.id('player-pro-trial-modal'));

  var startTrialButton = element(by.id('startTrialButton'));
  var dismissButton = element(by.id('dismissButton'));

  this.getPlayerProTrialModal = function() {
    return playerProTrialModal;
  };

  this.getStartTrialButton = function() {
    return startTrialButton;
  };

  this.getDismissButton = function() {
    return dismissButton;
  };

};

module.exports = PlayerProTrialModalPage;
