'use strict';
var HomePage = require('./homepage.js');

var SignUpPage = function() {
  var homepage = new HomePage;
  var url = homepage.getUrl() + 'signup';
  var modalDialog = element(by.css('.modal-dialog'));
  var modalTitle = element(by.css('.modal-title'));

  this.get = function() {
    browser.get(url);
  };

  this.getUrl = function() {
    return url;
  };

  this.getModalDialog = function () {
    return modalDialog;
  };

  this.getModalTitle = function () {
    return modalTitle;
  };

};

module.exports = SignUpPage;
