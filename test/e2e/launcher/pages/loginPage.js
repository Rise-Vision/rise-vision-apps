'use strict';

var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;
var helper = require('rv-common-e2e').helper;

var LoginPage = function() {

  var loginPageContainer = element(by.css('.app-launcher-login'));
  var signInLink = element(by.id('sign-in-link'));

  this.getLoginPageContainer = function() {
    return loginPageContainer;
  };

  this.getSignInLink = function() {
    return signInLink;
  };

  this.signIn = function() {
  	var commonHeaderPage = new CommonHeaderPage();
    var googleAuthPage = new GoogleAuthPage();

    signInLink.isPresent().then(function (state) {
      if (state) {
        signInLink.click().then(function () {
          googleAuthPage.signin();
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        });
      }
    });  	
  }

};

module.exports = LoginPage;
