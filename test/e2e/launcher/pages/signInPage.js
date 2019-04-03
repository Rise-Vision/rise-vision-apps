'use strict';
var CommonHeaderPage = require('./../../../../web/bower_components/common-header/test/e2e/pages/commonHeaderPage.js');
var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;
var HomePage = require('./homepage.js');
var OnboardingPage = require('./../../common/pages/onboarding.js');
var helper = require('rv-common-e2e').helper;

var SignInPage = function() {
  var commonHeaderPage = new CommonHeaderPage();
  var googleAuthPage = new GoogleAuthPage();
  var homepage = new HomePage();
  var onboardingPage = new OnboardingPage();


  var url = homepage.getUrl() + 'signin';

  var signInPageContainer = element(by.css('.app-launcher-login'));
  var signInCTA = element(by.cssContainingText('h1', 'Sign In'));
  var signInLink = element(by.id('sign-in-link'));
  var signInGoogleLink = element(by.id('sign-in-google-link'));
  var usernameTextBox = element(by.id('username'));
  var passwordTextBox = element(by.id('password'));
  var signinButton = element(by.cssContainingText('button.btn-primary', 'Sign In'));
  var incorrectCredentialsError = element(by.cssContainingText('.bg-danger', 'incorrect'));

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

  this.getGoogleLogin = function() {
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader - Get Google Login');
    helper.wait(signInGoogleLink, 'Sign In Google Link', 1000);
    signInGoogleLink.click();
  };

  this.googleSignIn = function() {
    //wait for spinner to go away.
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader - Before Google Sign In');

    signInGoogleLink.isPresent().then(function (state) {
      if (state) {
        signInGoogleLink.click().then(function () {
          googleAuthPage.signin();
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader - After Google Sign In');
        });
      }
    });
    
    // helper.wait(onboardingPage.getOnboardingBar(), 'Onboarding bar');
  };

  this.signIn = this.googleSignIn;

};

module.exports = SignInPage;
