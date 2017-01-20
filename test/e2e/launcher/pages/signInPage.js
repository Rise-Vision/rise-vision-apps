'use strict';
var HomePage = require('./homepage.js');

var SignInPage = function() {
  var homepage = new HomePage;
  var url = homepage.getUrl() + 'signin';

  this.get = function() {
    browser.get(url);
  };

  this.getUrl = function() {
    return url;
  }
};

module.exports = SignInPage;
