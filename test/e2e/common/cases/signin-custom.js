'use strict';
var expect = require('rv-common-e2e').expect;
var SignUpPage = require('./../pages/signUpPage.js');
var SignInPage = require('./../pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var HomePage = require('./../pages/homepage.js');
var helper = require('rv-common-e2e').helper;

var SigninCustomScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Signin Custom', function() {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signUpPage;
    var signInPage;
    var commonHeaderPage;
    before(function (){
      homepage = new HomePage();
      signUpPage = new SignUpPage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      signUpPage.get();
    });

    it('should show create account page', function() {
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(signUpPage.getSignUpPageContainer().isPresent()).to.eventually.be.true;
      expect(signUpPage.getSignUpCTA().isPresent()).to.eventually.be.true;
    });
    
    it('should show both sign up options', function() {
      expect(signUpPage.getSignUpGoogleLink().isPresent()).to.eventually.be.true;
      expect(signUpPage.getUsernameTextBox().isPresent()).to.eventually.be.true;
      expect(signUpPage.getPasswordTextBox().isPresent()).to.eventually.be.true;
      
      expect(signUpPage.getSignupButton().isPresent()).to.eventually.be.true;
    });

    it('should show password strength warning', function() {
      signUpPage.getUsernameTextBox().sendKeys('test@test.com');
      signUpPage.getPasswordTextBox().sendKeys('longpassword');

      expect(signUpPage.getPasswordStrengthWarning().isDisplayed()).to.eventually.be.true;
    });

    it('should show error when trying to signup', function() {
      signUpPage.getSignupButton().click();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(signUpPage.getAlreadyRegisteredError().isPresent()).to.eventually.be.true;
    });

    it('should go to sign in page',function(){
      signUpPage.getSignInLink().click();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(signInPage.getSignInPageContainer().isPresent()).to.eventually.be.true;
      expect(signInPage.getSignInCTA().isPresent()).to.eventually.be.true;
    });
    
    it('should show both sign in options', function() {
      expect(signInPage.getSignInGoogleLink().isPresent()).to.eventually.be.true;
      expect(signInPage.getUsernameTextBox().isPresent()).to.eventually.be.true;
      expect(signInPage.getPasswordTextBox().isPresent()).to.eventually.be.true;
      
      expect(signInPage.getSigninButton().isPresent()).to.eventually.be.true;
    });

    it('should show incorrect credentials error', function() {
      signInPage.getUsernameTextBox().sendKeys('test@test.com');
      signInPage.getPasswordTextBox().sendKeys('incorrectpassword');

      signInPage.getSigninButton().click();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(signInPage.getIncorrectCredentialsError().isPresent()).to.eventually.be.true;
    });

  });
};

module.exports = SigninCustomScenarios;
