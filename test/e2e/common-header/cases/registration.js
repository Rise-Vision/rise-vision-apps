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

  var MailListener = require("mail-listener2-updated");

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


      function getLastEmail() {
        var deferred = protractor.promise.defer();
        console.log("Waiting for an email...");

        mailListener.on("mail", function(mail, seqno, attributes){
          console.log("Mail received: " + mail.subject);

          mailListener.imap.addFlags(attributes.uid, '\\Seen', function(err) {
            if (err) {
              console.log('error marking message read/SEEN');
            } else {
              console.log('marked message as SEEN');
            }
          });          
          deferred.fulfill(mail);
        });
        return deferred.promise;
      };
        
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        registrationModalPage = new RegistrationModalPage();
        signInPage = new SignInPage();
        signUpPage = new SignUpPage();

        EMAIL_ADDRESS = commonHeaderPage.getStageEmailAddress();
        PASSWORD = commonHeaderPage.getPassword();

        console.log('Username: '+EMAIL_ADDRESS);
        mailListener = new MailListener({
          username: "jenkins.rise@gmail.com",
          password: PASSWORD, 
          host: "imap.gmail.com",
          port: 993,
          searchFilter: ["UNSEEN",['TO', EMAIL_ADDRESS]],
          tls: true,
          fetchUnreadOnStart: true
        });
        mailListener.on("server:connected", function(){
          console.log("Mail listener connected");
        });

        mailListener.on("server:disconnected", function(){
          console.log("Mail listener disconnected");
        });
        mailListener.start();

        signUpPage.get();
      });

      it('should show create account page', function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        expect(signUpPage.getSignUpPageContainer().isPresent()).to.eventually.be.true;
        expect(signUpPage.getSignUpCTA().isPresent()).to.eventually.be.true;
      });

      it('should register user', function() {
        signUpPage.getUsernameTextBox().sendKeys(EMAIL_ADDRESS);
        signUpPage.getPasswordTextBox().sendKeys(PASSWORD);
        signUpPage.getConfirmPasswordTextBox().sendKeys(PASSWORD);

        signUpPage.getSignupButton().click();

        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        expect(signUpPage.getAlreadyRegisteredError().isDisplayed()).to.eventually.be.false;
      });

      it('should wait for confirmation email', function() {        
        browser.controlFlow().wait(getLastEmail(), 45000).then(function (email) {

          expect(email.subject).to.equal("Confirm account");

          var pattern = /href="(https:\/\/apps-stage-0\.risevision\.com\/confirmaccount\/.*?)"/g;
          confirmationLink = pattern.exec(email.html)[1];
          console.log("Confirmation link: "+confirmationLink);

          expect(confirmationLink).to.contain("https://apps-stage-0.risevision.com/confirmaccount/"+EMAIL_ADDRESS);
        });        
      });

      it('should confirm email address',function(){
        browser.get(confirmationLink);
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        expect(signInPage.getUsernameTextBox().isPresent()).to.eventually.be.true;
        expect(signInPage.getPasswordTextBox().isPresent()).to.eventually.be.true;
        
        expect(signInPage.getSigninButton().isPresent()).to.eventually.be.true;
      });

      it('should sign in user', function() {
        signInPage.getUsernameTextBox().sendKeys(EMAIL_ADDRESS);

        var enter = "\ue007";
        signInPage.getPasswordTextBox().clear();
        signInPage.getPasswordTextBox().sendKeys(PASSWORD + enter);
      });
      
      it("should show T&C Dialog on new Google Account", function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
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

      after(function(){
        console.log("Stopping Mail listener");
        mailListener.stop();
      })

    });
  };

  module.exports = RegistrationScenarios;

})();
