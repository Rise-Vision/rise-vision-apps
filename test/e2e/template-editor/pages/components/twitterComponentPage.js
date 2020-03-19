'use strict';

var TwitterComponentPage = function() {
  var username = element(by.id('twitterUsername'));
  var maxitems = element(by.id('twitterMaxitems'));

  this.getUsername = function () {
    return username;
  };

  this.getMaxitems = function () {
    return maxitems;
  };

};

module.exports = TwitterComponentPage;
