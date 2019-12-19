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
  var signupButton = element(by.id('sign-up-button'));
  var passwordMinLengthError = element(by.cssContainingText('.text-danger', 'Password needs to be 4 or more characters in length.'));
  var passwordRequiredError = element(by.cssContainingText('.text-danger', 'Oops, don\'t leave this blank.'));
  var alreadyRegisteredError = element(by.id('already-registered-warning'));
  var passwordStrengthText = element(by.id('strengthText'));
  var passwordMeter = element(by.id('passwordMeter'));
  var passwordFeedbackText = element(by.id('passwordFeedback'));  
  
  var confirmEmailNotice = element(by.cssContainingText('.panel-body', 'check your inbox to complete your account registration'));
  var emailConfirmedNotice = element(by.cssContainingText('.panel-body', 'Account successfully confirmed'));

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

  this.getSignupButton = function() {
    return signupButton;
  };

  this.getPasswordMinLengthError = function() {
    return passwordMinLengthError;
  };

  this.getPasswordRequiredError = function() {
    return passwordRequiredError;
  };

  this.getPasswordStrengthText = function() {
    return passwordStrengthText;
  };

  this.getPasswordMeter = function() {
    return passwordMeter;
  };

  this.getPasswordFeedbackText = function() {
    return passwordFeedbackText;
  };

  this.getAlreadyRegisteredError = function() {
    return alreadyRegisteredError;
  };

  this.getConfirmEmailNotice = function() {
    return confirmEmailNotice;
  };

  this.getEmailConfirmedNotice = function() {
    return emailConfirmedNotice;
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

  this.customAuthSignUp = function(email, password){
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

    this.getUsernameTextBox().sendKeys(email);
    this.getPasswordTextBox().sendKeys(password);

    this.getSignupButton().click();

    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
  };

};

module.exports = SignUpPage;
