(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var HomePage = require('./../pages/homepage.js');
  var RegistrationModalPage = require('./../pages/registrationModalPage.js');
  var SignInPage = require('./../../launcher/pages/signInPage.js');

  var RegistrationScenarios = function() {

    describe("Registration", function() {
      var commonHeaderPage, 
        homepage, 
        registrationModalPage,
        signInPage;
        
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        registrationModalPage = new RegistrationModalPage();
        signInPage = new SignInPage();

        homepage.get();
        signInPage.signIn(browser.params.login.user1, browser.params.login.pass1);
      });

      it("should show T&C Dialog on new Google Account", function() {
        helper.wait(registrationModalPage.getRegistrationModal(), "Registration Modal");
        
        //dialog shows
        expect(registrationModalPage.getRegistrationModal().isPresent()).to.eventually.be.true;
      });

      it("should show all Registration fields", function() {
        expect(registrationModalPage.getFirstNameField().isDisplayed()).to.eventually.be.true;
        expect(registrationModalPage.getLastNameField().isDisplayed()).to.eventually.be.true;
        expect(registrationModalPage.getCompanyNameField().isDisplayed()).to.eventually.be.true;
        expect(registrationModalPage.getCompanyIndustryDropdown().isDisplayed()).to.eventually.be.true;
        expect(registrationModalPage.getTermsCheckbox().isDisplayed()).to.eventually.be.true;
      });

      xit("should not bug me again when I click 'cancel', even after a refresh (limbo state)", function() {
        registrationModalPage.getCancelButton().click();
        browser.refresh();
        
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        
        expect(commonHeaderPage.getSignInButton().isDisplayed()).to.eventually.be.false;
        expect(registrationModalPage.getRegistrationModal().isPresent()).to.eventually.be.false;
      });

      xit("allow me to register when I've changed my mind", function() {
        expect(homepage.getRegisterUserButton().isDisplayed(), "Create Account button should show").to.eventually.be.true;
        homepage.getRegisterUserButton().click();
        
        helper.wait(registrationModalPage.getRegistrationModal(), "Registration Modal");
        
        //dialog shows
        expect(registrationModalPage.getRegistrationModal().isPresent()).to.eventually.be.true;
      });

      it("should show validation errors if i have not agreed to terms and entered a first and last name", function () {
        registrationModalPage.getSaveButton().click();
        
        expect(registrationModalPage.getValidationTermsAccepted().isPresent()).to.eventually.be.true;
        expect(registrationModalPage.getValidationFirstName().isPresent()).to.eventually.be.true;
        expect(registrationModalPage.getValidationLastName().isPresent()).to.eventually.be.true;
        expect(registrationModalPage.getValidationCompanyName().isPresent()).to.eventually.be.true;
        expect(registrationModalPage.getValidationCompanyIndustry().isPresent()).to.eventually.be.true;
      });

      it("should complete the registration process", function () {
        registrationModalPage.getFirstNameField().sendKeys("John");
        registrationModalPage.getLastNameField().sendKeys("Doe");
        registrationModalPage.getCompanyNameField().sendKeys("Public School #5");
        registrationModalPage.getCompanyIndustryOptions().then(function(options){
          options[2].click(); //select random option
        }); 
        //click authorize
        registrationModalPage.getTermsCheckbox().click();
        
        // No need to sign up for newsletter
        // registrationModalPage.getNewsletterCheckbox().click();
        registrationModalPage.getSaveButton().click();
        
        helper.waitRemoved(registrationModalPage.getRegistrationModal(), "Registration Modal");

        expect(registrationModalPage.getRegistrationModal().isPresent()).to.eventually.be.false;
      });

      it("should update auth button", function () {
        expect(commonHeaderPage.getProfilePic().isDisplayed()).to.eventually.be.true;
      });

    });
  };

  module.exports = RegistrationScenarios;

})();
