(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var RegistrationModalPage = require('./../pages/registrationModalPage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');
  var SignUpPage = require('./../../common/pages/signUpPage.js');
  var MailListener = require('./../utils/mailListener.js');

  var RegistrationScenarios = function() {

    describe("Registration", function() {
      var EMAIL_ADDRESS, 
        PASSWORD,
        NEW_COMPANY_NAME,
        commonHeaderPage, 
        registrationModalPage,
        signInPage,
        signUpPage,
        mailListener,
        confirmationLink;
      
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        registrationModalPage = new RegistrationModalPage();
        signInPage = new SignInPage();
        signUpPage = new SignUpPage();

        EMAIL_ADDRESS = commonHeaderPage.getStageEmailAddress();
        PASSWORD = commonHeaderPage.getPassword();
        NEW_COMPANY_NAME = commonHeaderPage.addStageSuffix("Public School");

        mailListener = new MailListener(EMAIL_ADDRESS,PASSWORD);
        mailListener.start();

        signUpPage.get();
      });

      function detectAndFixUserAlreadyRegistered() {
        signUpPage.getAlreadyRegisteredError().isDisplayed().then(function(isDisplayed){
          if (isDisplayed) {
            console.log('User already registered. Attempting to delete an sign up again.');
            signInPage.get();
            signInPage.customAuthSignIn(EMAIL_ADDRESS, PASSWORD);

            // if user belongs to a new company, removes the company
            // if it was added to jenkins company, removes only the user
            commonHeaderPage.getMainCompanyNameSpan().getText().then(function(text){
              if (text === NEW_COMPANY_NAME) {
                commonHeaderPage.deleteCurrentCompany(NEW_COMPANY_NAME);
              } else {
                commonHeaderPage.deleteCurrentUser(EMAIL_ADDRESS);
              }
            });
            signUpPage.get();
            helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
            signUpPage.customAuthSignUp(EMAIL_ADDRESS, PASSWORD);
          }
        });
      }

      it('should show create account page', function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        expect(signUpPage.getSignUpPageContainer().isPresent()).to.eventually.be.true;
        expect(signUpPage.getSignUpCTA().isPresent()).to.eventually.be.true;
      });

      it('should register user', function() {
        signUpPage.customAuthSignUp(EMAIL_ADDRESS, PASSWORD);
        
        detectAndFixUserAlreadyRegistered();

        expect(signUpPage.getConfirmEmailNotice().isDisplayed()).to.eventually.be.true;
      });

      it('should wait for confirmation email', function() {
        browser.controlFlow().wait(signUpPage.getConfirmationLink(mailListener), 60000).then(function(link){
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
        registrationModalPage.getCompanyNameField().sendKeys(NEW_COMPANY_NAME);
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

      after(function(){
        mailListener.stop();
      });

    });
  };

  module.exports = RegistrationScenarios;

})();
