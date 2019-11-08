'use strict';
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;
var HomePage = require('./homepage.js');
var helper = require('rv-common-e2e').helper;
var expect = require('rv-common-e2e').expect;

var SignInPage = function() {
  var _this = this;
  var commonHeaderPage = new CommonHeaderPage();
  var googleAuthPage = new GoogleAuthPage();
  var homepage = new HomePage();

  var url = homepage.getUrl() + 'signin';

  var signInPageContainer = element(by.css('.app-launcher-login'));
  var signInCTA = element(by.cssContainingText('h1', 'Sign In'));
  var signInLink = element(by.id('sign-in-link'));
  var signInGoogleLink = element(by.id('sign-in-google-link'));
  var usernameTextBox = element(by.id('username'));
  var passwordTextBox = element(by.id('password'));
  var signinButton = element(by.cssContainingText('button.btn-primary', 'Sign In'));
  var incorrectCredentialsError = element(by.cssContainingText('.bg-danger', 'incorrect'));
  var passwordMinLengthError = element(by.cssContainingText('.text-danger', 'Password needs to be 4 or more characters in length.'));
  var passwordRequiredError = element(by.cssContainingText('.text-danger', 'Oops, don\'t leave this blank.'));

  var USERNAME1 = browser.params.login.user1;
  var PASSWORD1 = browser.params.login.pass1;

  this.get = function() {
    browser.get(url);
  };
  
  this.getUrl = function() {
    return url;
  }

  this.getSignInPageContainer = function() {
    return signInPageContainer;
  };

  this.getSignInCTA = function() {
    return signInCTA;
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

  this.getSigninButton = function() {
    return signinButton;
  };

  this.getIncorrectCredentialsError = function() {
    return incorrectCredentialsError;
  };

  this.getPasswordMinLengthError = function() {
    return passwordMinLengthError;
  };

  this.getPasswordRequiredError = function() {
    return passwordRequiredError;
  };

  this.customAuthSignIn = function(username,password) {
    username = username || USERNAME1;
    password = password || PASSWORD1;
    //wait for spinner to go away.
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader - Before Custom Sign In');

    this.getUsernameTextBox().isPresent().then(function (state) {
      if (state) {
        _this.getUsernameTextBox().clear();
        _this.getUsernameTextBox().sendKeys(username);

        var enter = "\ue007";
        _this.getPasswordTextBox().clear();
        _this.getPasswordTextBox().sendKeys(password + enter);

        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader - After Custom Sign In');
      }
    });
  };

  this.getGoogleLogin = function() {
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader - Get Google Login');
    helper.wait(signInGoogleLink, 'Sign In Google Link', 1000);
    signInGoogleLink.click();
  };

  this.googleSignIn = function(username,password) {
    //wait for spinner to go away.
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader - Before Google Sign In');

    signInGoogleLink.isPresent().then(function (state) {
      if (state) {
        signInGoogleLink.click().then(function () {
          googleAuthPage.signin(username,password);
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader - After Google Sign In');
        });
      }
    });
    
  };

  this.signIn = this.customAuthSignIn;

};

module.exports = SignInPage;
