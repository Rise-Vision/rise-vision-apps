'use strict';
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var HomePage = require('./homepage.js');
var LoginPage = require('./../pages/loginPage.js');
var helper = require('rv-common-e2e').helper;

var SignUpPage = function() {
  var commonHeaderPage = new CommonHeaderPage();
  var homepage = new HomePage();
  var loginPage = new LoginPage();
  var url = homepage.getUrl() + 'signup';
  var signInLink = element(by.id('sign-in-link'));
  var modalDialog = element(by.css('.modal-dialog'));
  var modalTitle = element(by.css('.modal-title'));

  this.get = function() {
    browser.get(url);
  };

  this.getUrl = function() {
    return url;
  };

  this.getSignInLink = function() {
    return signInLink;
  };

  this.getModalDialog = function () {
    return modalDialog;
  };

  this.getModalTitle = function () {
    return modalTitle;
  };

  this.getGoogleLogin = function() {
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

    signInLink.click();

    helper.wait(loginPage.getSignInGoogleLink(), 'Sign In Google Link', 1000);
    loginPage.getSignInGoogleLink().click();
  };

};

module.exports = SignUpPage;
