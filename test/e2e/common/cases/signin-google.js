'use strict';
var expect = require('rv-common-e2e').expect;
var SignInPage = require('./../pages/signInPage.js');
var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var HomePage = require('./../pages/homepage.js');
var helper = require('rv-common-e2e').helper;

var SigninGoogleScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Signin', function() {
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
      signInPage.get();
    });

    it('should sign in the user through google',function(){
      signInPage.getGoogleLogin();
      googleAuthPage.signin();
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      expect(homepage.getAppsHomeContainer().isPresent()).to.eventually.be.true;
    });

    it('should not sign in the user through google when it is already signed in',function(){
      signInPage.get();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      expect(homepage.getAppsHomeContainer().isPresent()).to.eventually.be.true;
    });

    after('Should sign out user', function() {
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      commonHeaderPage.signOut();
    });
  });
};

module.exports = SigninGoogleScenarios;
