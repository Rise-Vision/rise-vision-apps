'use strict';
var expect = require('rv-common-e2e').expect;
var SignUpPage = require('./../pages/signUpPage.js');
var GoogleAuthPage = require('rv-common-e2e').googleAuthPage;
var CommonHeaderPage = require('./../../../../web/bower_components/common-header/test/e2e/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;

var SignupScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Signup', function() {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var signUpPage;
    var googleAuthPage;
    var commonHeaderPage;
    before(function (){
      signUpPage = new SignUpPage();
      googleAuthPage = new GoogleAuthPage();
      commonHeaderPage = new CommonHeaderPage();
    });

    it('should not sign in the user through google when it is already signed in',function(){
      signUpPage.get();
      signUpPage.getGoogleLogin();
      googleAuthPage.signin();
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      signUpPage.get();
      expect(signUpPage.getModalDialog().isPresent()).to.eventually.be.false;
      expect(signUpPage.getModalTitle().isPresent()).to.eventually.be.false;
    });

    after('Should sign out user', function() {
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      commonHeaderPage.signOut();
    });
  });
};

module.exports = SignupScenarios;
