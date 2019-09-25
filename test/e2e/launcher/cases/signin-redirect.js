'use strict';
var expect = require('rv-common-e2e').expect;
var SignInPage = require('./../pages/signInPage.js');
var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var HomePage = require('./../pages/homepage.js');
var helper = require('rv-common-e2e').helper;

var SigninRedirectScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Signin Redirect', function() {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var googleAuthPage;
    var commonHeaderPage;
    before(function (){
      homepage = new HomePage();
      signInPage = new SignInPage();
      googleAuthPage = new GoogleAuthPage();
      commonHeaderPage = new CommonHeaderPage();
      homepage.getProtectedPage();

    });

    it('should sign in the user through google',function(){
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        signInPage.getGoogleLogin();
        googleAuthPage.signin();
      });
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      expect(browser.getCurrentUrl()).to.eventually.have.string(homepage.getProtectedPageUrl());
    });

    after('Should sign out user', function() {
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      commonHeaderPage.signOut();
    });
  });
};

module.exports = SigninRedirectScenarios;
