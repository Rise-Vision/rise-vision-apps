'use strict';
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var HomePage = require('./homepage.js');
var LoginPage = require('./../pages/loginPage.js');
var helper = require('rv-common-e2e').helper;

var SignInPage = function() {
  var commonHeaderPage = new CommonHeaderPage();
  var homepage = new HomePage();
  var loginPage = new LoginPage();
  var url = homepage.getUrl() + 'signin';

  this.get = function() {
    browser.get(url);
  };

  this.getGoogleLogin = function() {
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
    loginPage.getSignInLink().click();
    helper.wait(loginPage.getSignInGoogleLink(), 'Sign In Google Link', 1000);
    loginPage.getSignInGoogleLink().click();
  };

  this.getUrl = function() {
    return url;
  }
};

module.exports = SignInPage;
