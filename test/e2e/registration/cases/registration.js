(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var RegistrationModalPage = require('./../pages/registrationModalPage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');
  var SignUpPage = require('./../../common/pages/signUpPage.js');

  var RegistrationScenarios = function() {

    describe("Registration", function() {
      var EMAIL_ADDRESS, 
        PASSWORD,
        NEW_COMPANY_NAME,
        commonHeaderPage, 
        registrationModalPage,
        signInPage,
        signUpPage;
      
      function detectAndFixUserAlreadyRegistered() {
        signInPage.get();
        signInPage.customAuthSignIn(EMAIL_ADDRESS, PASSWORD);
        helper.waitForSpinner();

        signInPage.getIncorrectCredentialsError().isDisplayed().then(function(isDisplayed){
          console.log('Login failed. Assume account not present.');
        }).catch(function() {
          console.log('Login succeeded. Attempting to delete an sign up again.');
          browser.sleep(500);

          registrationModalPage.getRegistrationModal().isPresent().then(function(isPresent){
            if (isPresent) {
              console.log('Registration Modal is present. Completing registration before deleting account.');
              enterRegistrationDetailsAndProceed();
            }
            
          }).finally(function(){
            // if user belongs to a new company, removes the company
            // if it was added to jenkins company, removes only the user
            commonHeaderPage.getMainCompanyNameSpan().getText().then(function(text){
              if (text === NEW_COMPANY_NAME) {
                commonHeaderPage.deleteCurrentCompany(NEW_COMPANY_NAME);
              } else {
                commonHeaderPage.deleteCurrentUser(EMAIL_ADDRESS);
              }
            });
          });
        });
      }

      function enterRegistrationDetailsAndProceed() {
        // If it is a new signup, Company Name field is displayed and we need to enter all details.
        // If user is being added to an existing company, Company Name is hidden and other fields are already populated.
        registrationModalPage.getCompanyNameField().isDisplayed().then(function(isDisplayed){
          if (isDisplayed) {
            registrationModalPage.getFirstNameField().sendKeys("John");
            registrationModalPage.getLastNameField().sendKeys("Doe");
            registrationModalPage.getCompanyNameField().sendKeys(NEW_COMPANY_NAME);
            registrationModalPage.getCompanyIndustryOptions().then(function(options){
              options[2].click(); //select random option
            }); 
          }
        });
        //click authorize
        registrationModalPage.getTermsCheckbox().click();
        
        // No need to sign up for newsletter
        // registrationModalPage.getNewsletterCheckbox().click();
        registrationModalPage.getSaveButton().click();
        
        helper.waitRemoved(registrationModalPage.getRegistrationModal(), "Registration Modal");
      }

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        registrationModalPage = new RegistrationModalPage();
        signInPage = new SignInPage();
        signUpPage = new SignUpPage();

        EMAIL_ADDRESS = commonHeaderPage.getStageEmailAddress();
        PASSWORD = commonHeaderPage.getPassword();
        NEW_COMPANY_NAME = commonHeaderPage.addStageSuffix("Public School");

        console.log('Checking login for ' + EMAIL_ADDRESS);
        detectAndFixUserAlreadyRegistered();

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

      it('should show minimum length error', function() {
        signUpPage.getUsernameTextBox().sendKeys('test@test.com');
        signUpPage.getPasswordTextBox().sendKeys('pa');

        expect(signUpPage.getPasswordMinLengthError().isDisplayed()).to.eventually.be.true;
      });

      it('should dismiss minimum length error after 4 characters', function() {
        signUpPage.getPasswordTextBox().sendKeys('ss');

        expect(signUpPage.getPasswordMinLengthError().isPresent()).to.eventually.be.false;
      });

      it('should show password meter', function() {
        helper.wait(signUpPage.getPasswordMeter(), 'Password Meter Strength');

        expect(signUpPage.getPasswordStrengthText().getText()).to.eventually.equal('Weak');
        expect(signUpPage.getPasswordFeedbackText().getText()).to.eventually.equal('This is a top-100 common password');
        expect(signUpPage.getPasswordMeter().isDisplayed()).to.eventually.be.true;
      });

      it('should show required field error', function() {
        signUpPage.getPasswordTextBox().clear();

        expect(signUpPage.getPasswordRequiredError().isDisplayed()).to.eventually.be.true;
      });

      it('should report strong password', function() {
        signUpPage.getPasswordTextBox().sendKeys('strngPass@*3');

        expect(signUpPage.getPasswordStrengthText().getText()).to.eventually.equal('Great');
      });

      it('should show error when trying to signup with existing user account', function() {
        signUpPage.getSignupButton().click();

        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        expect(signUpPage.getAlreadyRegisteredError().isDisplayed()).to.eventually.be.true;
      });

      it('should register user', function() {
        signUpPage.getUsernameTextBox().clear();
        signUpPage.getPasswordTextBox().clear();
        signUpPage.customAuthSignUp(EMAIL_ADDRESS, PASSWORD);        
        helper.waitForSpinner();
      });

      it('should sign in user and show T&C Dialog on new Account', function() {        
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
        enterRegistrationDetailsAndProceed();

        expect(registrationModalPage.getRegistrationModal().isPresent()).to.eventually.be.false;
      });

      it("should update auth button", function () {
        expect(commonHeaderPage.getProfilePic().isDisplayed()).to.eventually.be.true;
      });

    });
  };

  module.exports = RegistrationScenarios;

})();
