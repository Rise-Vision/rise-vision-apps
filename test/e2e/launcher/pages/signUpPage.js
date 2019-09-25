'use strict';
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var HomePage = require('./homepage.js');
var SignInPage = require('./../pages/signInPage.js');
var helper = require('rv-common-e2e').helper;

var SignUpPage = function() {
  var commonHeaderPage = new CommonHeaderPage();
  var homepage = new HomePage();
  var signInPage = new SignInPage();
  var url = homepage.getUrl() + 'signup';

  var signUpPageContainer = element(by.css('.app-launcher-login'));
  var signUpCTA = element(by.cssContainingText('h1', 'Get Started For Free'));
  var signInLink = element(by.id('sign-in-link'));
  var signUpGoogleLink = element(by.id('sign-up-google-link'));
  var usernameTextBox = element(by.id('username'));
  var passwordTextBox = element(by.id('password'));
  var confirmPasswordTextBox = element(by.id('confirmPassword'));
  var signupButton = element(by.id('sign-up-button'));
  var passwordStrengthWarning = element(by.cssContainingText('.text-warning', 'strong password'));
  var matchingPasswordsError = element(by.cssContainingText('.text-danger', 'must match'));
  var alreadyRegisteredError = element(by.id('already-registered-warning'));

  var modalDialog = element(by.css('.modal-dialog'));
  var modalTitle = element(by.css('.modal-title'));

  this.get = function() {
    browser.get(url);
  };

  this.getUrl = function() {
    return url;
  };

  this.getSignUpPageContainer = function() {
    return signUpPageContainer;
  };

  this.getSignUpCTA = function() {
    return signUpCTA;
  };

  this.getSignInLink = function() {
    return signInLink;
  };

  this.getSignUpGoogleLink = function() {
    return signUpGoogleLink;
  };

  this.getUsernameTextBox = function() {
    return usernameTextBox;
  };

  this.getPasswordTextBox = function() {
    return passwordTextBox;
  };
  
  this.getConfirmPasswordTextBox = function() {
    return confirmPasswordTextBox;
  };

  this.getSignupButton = function() {
    return signupButton;
  };

  this.getPasswordStrengthWarning = function() {
    return passwordStrengthWarning;
  };

  this.getMatchingPasswordsError = function() {
    return matchingPasswordsError;
  };

  this.getAlreadyRegisteredError = function() {
    return alreadyRegisteredError;
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

    helper.wait(signInPage.getSignInGoogleLink(), 'Sign In Google Link', 1000);
    signInPage.getSignInGoogleLink().click();
  };

};

module.exports = SignUpPage;
