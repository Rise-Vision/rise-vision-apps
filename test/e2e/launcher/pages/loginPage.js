'use strict';

var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;
var OnboardingPage = require('./../../common/pages/onboarding.js');
var helper = require('rv-common-e2e').helper;

var LoginPage = function() {

  var loginPageContainer = element(by.css('.app-launcher-login'));
  var signInGoogleLink = element(by.id('sign-in-google-link'));

  this.getLoginPageContainer = function() {
    return loginPageContainer;
  };

  this.getSignInGoogleLink = function() {
    return signInGoogleLink;
  };

  this.signIn = function() {
  	var commonHeaderPage = new CommonHeaderPage();
    var googleAuthPage = new GoogleAuthPage();
    var onboardingPage = new OnboardingPage();

    //wait for spinner to go away.
    helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

    signInGoogleLink.isPresent().then(function (state) {
      if (state) {
        signInGoogleLink.click().then(function () {
          googleAuthPage.signin();
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        });
      }
    });
    
    helper.wait(onboardingPage.getOnboardingBar(), 'Onboarding bar');
  }

};

module.exports = LoginPage;
