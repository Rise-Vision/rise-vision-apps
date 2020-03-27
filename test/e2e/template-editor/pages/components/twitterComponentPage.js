'use strict';

var TwitterComponentPage = function() {
  var connectButton = element(by.id('twitterConnectButton'));
  var username = element(by.id('twitterUsername'));
  var maxitems = element(by.id('twitterMaxitems'));

  this.getConnectButton = function () {
    return connectButton;
  };

  this.getUsername = function () {
    return username;
  };

  this.getMaxitems = function () {
    return maxitems;
  };

};

module.exports = TwitterComponentPage;
