'use strict';
var PlayerProInfoModalPage = function() {
  var playerProInfoModal = element(by.id('player-pro-info-modal'));

  var startTrialButton = element(by.id('startTrialButton'));
  var dismissButton = element(by.id('dismissButton'));

  this.getPlayerProInfoModal = function() {
    return playerProInfoModal;
  };

  this.getStartTrialButton = function() {
    return startTrialButton;
  };

  this.getDismissButton = function() {
    return dismissButton;
  };

};

module.exports = PlayerProInfoModalPage;
