'use strict';
var expect = require('rv-common-e2e').expect;
var SignInPage = require('./../pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;

var SigninCustomScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Signin Custom', function() {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var signInPage;
    var commonHeaderPage;
    before(function (){
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      signInPage.get();
    });
    
    it('should go to sign in page',function(){
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

    it('should not show minimum length error', function() {
      signInPage.getUsernameTextBox().sendKeys('test@test.com');
      signInPage.getPasswordTextBox().sendKeys('pas');

      expect(signInPage.getPasswordMinLengthError().isPresent()).to.eventually.be.false;
    });

    it('should show required field error', function() {
      signInPage.getPasswordTextBox().clear();

      expect(signInPage.getPasswordRequiredError().isDisplayed()).to.eventually.be.true;
    });

    it('should show incorrect credentials error', function() {
      signInPage.getPasswordTextBox().sendKeys('incorrectpassword');

      signInPage.getSigninButton().click();

      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

      expect(signInPage.getIncorrectCredentialsError().isPresent()).to.eventually.be.true;
    });

  });
};

module.exports = SigninCustomScenarios;
