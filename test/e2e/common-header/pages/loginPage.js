/*globals element, by */
(function(module) {
  'use strict';

  var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;

  var LoginPage = function() {

    var loginPageContainer = element(by.css('.app-login'));
    var signInWithGoogleLink = element(by.id('sign-in-google-link'));

    this.getLoginPageContainer = function() {
      return loginPageContainer;
    };

    this.getSignInWithGoogleLink = function() {
      return signInWithGoogleLink;
    };

    this.signIn = function(username, password) {
      var googleAuthPage = new GoogleAuthPage();

      signInWithGoogleLink.isPresent().then(function (state) {
        if (state) {
          signInWithGoogleLink.click().then(function () {
            googleAuthPage.signin(username, password);
          });
        }
      });
    };

  };

  module.exports = LoginPage;
})(module);
