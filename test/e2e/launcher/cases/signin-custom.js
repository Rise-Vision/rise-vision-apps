'use strict';
var expect = require('rv-common-e2e').expect;
var CreateAccountPage = require('./../pages/createAccountPage.js');
var LoginPage = require('./../pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var HomePage = require('./../pages/homepage.js');
var helper = require('rv-common-e2e').helper;

var SigninCustomScenarios = function() {
  var USERNAME2 = browser.params.login.user2;
  var PASSWORD2 = browser.params.login.pass2;

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Signin Custom', function() {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var createAccountPage;
    var loginPage;
    var commonHeaderPage;
    before(function (){
      homepage = new HomePage();
      createAccountPage = new CreateAccountPage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      homepage.get();
    });

    it('should show create account page', function() {
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(createAccountPage.getCreateAccountPageContainer().isPresent()).to.eventually.be.true;
      expect(createAccountPage.getSignUpCTA().isPresent()).to.eventually.be.true;
    });
    
    it('should show both sign up options', function() {
      expect(createAccountPage.getSignInGoogleLink().isPresent()).to.eventually.be.true;
      expect(createAccountPage.getUsernameTextBox().isPresent()).to.eventually.be.true;
      expect(createAccountPage.getPasswordTextBox().isPresent()).to.eventually.be.true;
      
      expect(createAccountPage.getSignupButton().isPresent()).to.eventually.be.true;
    });

    it('should show password strength warning', function() {
      createAccountPage.getUsernameTextBox().sendKeys(USERNAME2);
      createAccountPage.getPasswordTextBox().sendKeys(PASSWORD2);

      expect(createAccountPage.getPasswordStrengthWarning().isPresent()).to.eventually.be.true;
    });

    it('should show error when trying to signup', function() {
      createAccountPage.getSignupButton().click();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(createAccountPage.getAlreadyRegisteredError().isPresent()).to.eventually.be.true;
    });

    it('should go to sign in page',function(){
      createAccountPage.getSignInLink().click();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(loginPage.getLoginPageContainer().isPresent()).to.eventually.be.true;
      expect(loginPage.getSignInCTA().isPresent()).to.eventually.be.true;
    });
    
    it('should show both sign in options', function() {
      expect(loginPage.getSignInGoogleLink().isPresent()).to.eventually.be.true;
      expect(loginPage.getUsernameTextBox().isPresent()).to.eventually.be.true;
      expect(loginPage.getPasswordTextBox().isPresent()).to.eventually.be.true;
      
      expect(loginPage.getSigninButton().isPresent()).to.eventually.be.true;
    });

    it('should show incorrect credentials error', function() {
      loginPage.getUsernameTextBox().sendKeys(USERNAME2);
      loginPage.getPasswordTextBox().sendKeys('incorrectpassword');

      loginPage.getSigninButton().click();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(loginPage.getIncorrectCredentialsError().isPresent()).to.eventually.be.true;
    });

    it('should sign in user', function() {
      var enter = "\ue007";

      loginPage.getPasswordTextBox().clear();
      loginPage.getPasswordTextBox().sendKeys(PASSWORD2 + enter);
    });
    
    it('should go to sign in page',function(){
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(homepage.getAppLauncherContainer().isPresent()).to.eventually.be.true;
    });

    it('should not sign in the user through google when it is already signed in',function(){
      homepage.get();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      expect(homepage.getAppLauncherContainer().isPresent()).to.eventually.be.true;
    });

    after('should not show sign out modal when signing out user', function() {
      commonHeaderPage.getProfilePic().click();
      commonHeaderPage.getSignOutButton().click();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(loginPage.getLoginPageContainer().isPresent()).to.eventually.be.true;
      expect(loginPage.getSignInCTA().isPresent()).to.eventually.be.true;
    });
  });
};

module.exports = SigninCustomScenarios;
