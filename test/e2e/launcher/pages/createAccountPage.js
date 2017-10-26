'use strict';

var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;
var OnboardingPage = require('./../../common/pages/onboarding.js');
var helper = require('rv-common-e2e').helper;

var CreateAccountPage = function() {

  var createAccountPageContainer = element(by.css('.app-launcher-login'));
  var signUpCTA = element(by.cssContainingText('h1', 'Get Started For Free'));
  var signInLink = element(by.id('sign-in-link'));
  var signInGoogleLink = element(by.id('sign-in-google-link'));
  var usernameTextBox = element(by.id('username'));
  var passwordTextBox = element(by.id('password'));
  var signupButton = element(by.cssContainingText('button.btn-primary', 'Sign Up'));
  var passwordStrengthWarning = element(by.cssContainingText('.text-warning', 'strong password'));
  var alreadyRegisteredError = element(by.cssContainingText('.bg-danger', 'already registered'));

  this.getCreateAccountPageContainer = function() {
    return createAccountPageContainer;
  };

  this.getSignUpCTA = function() {
    return signUpCTA;
  };

  this.getSignInLink = function() {
    return signInLink;
  };

  this.getSignInGoogleLink = function() {
    return signInGoogleLink;
  };

  this.getUsernameTextBox = function() {
    return usernameTextBox;
  };

  this.getPasswordTextBox = function() {
    return passwordTextBox;
  };

  this.getSignupButton = function() {
    return signupButton;
  };

  this.getPasswordStrengthWarning = function() {
    return passwordStrengthWarning;
  };

  this.getAlreadyRegisteredError = function() {
    return alreadyRegisteredError;
  };

};

module.exports = CreateAccountPage;
