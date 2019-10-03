(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var HomePage = require('./../pages/homepage.js');
  var RegistrationModalPage = require('./../pages/registrationModalPage.js');
  var SignInPage = require('./../../launcher/pages/signInPage.js');
  var SignUpPage = require('./../../launcher/pages/signUpPage.js');
  var MailListener = require('./../utils/mailListener.js');

  var RegistrationScenarios = function() {

    describe("Registration", function() {
      var EMAIL_ADDRESS, 
        PASSWORD,
        commonHeaderPage, 
        homepage, 
        registrationModalPage,
        signInPage,
        signUpPage,
        mailListener,
        confirmationLink;
      
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        registrationModalPage = new RegistrationModalPage();
        signInPage = new SignInPage();
        signUpPage = new SignUpPage();

        EMAIL_ADDRESS = commonHeaderPage.getStageEmailAddress();
        PASSWORD = commonHeaderPage.getPassword();

        mailListener = new MailListener(EMAIL_ADDRESS,PASSWORD);
        mailListener.start();

        signUpPage.get();
      });

      it('should show create account page', function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        expect(signUpPage.getSignUpPageContainer().isPresent()).to.eventually.be.true;
        expect(signUpPage.getSignUpCTA().isPresent()).to.eventually.be.true;
      });

      it('should register user', function() {
        signUpPage.customAuthSignUp(EMAIL_ADDRESS, PASSWORD);
        
        expect(signUpPage.getAlreadyRegisteredError().isDisplayed()).to.eventually.be.false;
        expect(signUpPage.getConfirmEmailNotice().isDisplayed()).to.eventually.be.true;
      });

      it('should wait for confirmation email', function() {
        browser.controlFlow().wait(signUpPage.getConfirmationLink(mailListener), 45000).then(function(link){
          confirmationLink = link;
          expect(confirmationLink).to.contain("http://localhost:8099/confirmaccount/"+EMAIL_ADDRESS);
        });             
      });

      it('should confirm email address',function(){
        browser.get(confirmationLink);
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        expect(signInPage.getUsernameTextBox().isPresent()).to.eventually.be.true;
        expect(signInPage.getPasswordTextBox().isPresent()).to.eventually.be.true;        
        expect(signInPage.getSigninButton().isPresent()).to.eventually.be.true;

        expect(signUpPage.getEmailConfirmedNotice().isDisplayed()).to.eventually.be.true;
      });

      it('should sign in user and show T&C Dialog on new Account', function() {
        signInPage.customAuthSignIn(EMAIL_ADDRESS, PASSWORD);
        
        helper.wait(registrationModalPage.getRegistrationModal(), "Registration Modal");

        expect(registrationModalPage.getRegistrationModal().isPresent()).to.eventually.be.true;
      });

      it("should show all Registration fields", function() {
        expect(registrationModalPage.getFirstNameField().isDisplayed()).to.eventually.be.true;
        expect(registrationModalPage.getLastNameField().isDisplayed()).to.eventually.be.true;
        expect(registrationModalPage.getCompanyNameField().isDisplayed()).to.eventually.be.true;
        expect(registrationModalPage.getCompanyIndustryDropdown().isDisplayed()).to.eventually.be.true;
        expect(registrationModalPage.getTermsCheckbox().isDisplayed()).to.eventually.be.true;
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
        registrationModalPage.getCompanyNameField().sendKeys(commonHeaderPage.addStageSuffix("Public School"));
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

      it("should sign out", function() {
        commonHeaderPage.signOut(true);
      });

      after(function(){
        mailListener.stop();
      });

    });
  };

  module.exports = RegistrationScenarios;

})();
