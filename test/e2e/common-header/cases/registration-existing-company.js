(function() {

  "use strict";

  var expect = require("rv-common-e2e").expect;
  var helper = require("rv-common-e2e").helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var HomePage = require("./../pages/homepage.js");
  var RegistrationModalPage = require("./../pages/registrationModalPage.js");
  var CompanyUsersModalPage = require("./../pages/companyUsersModalPage.js");
  var UserSettingsModalPage = require("./../pages/userSettingsModalPage.js");
  var SignInPage = require('./../../launcher/pages/signInPage.js');
  var SignUpPage = require('./../../launcher/pages/signUpPage.js');
  var MailListener = require('./../utils/mailListener.js');

  var RegistrationExistingCompanyScenarios = function() {

    browser.driver.manage().window().setSize(1400, 900);
    describe("Registration Existing Company", function () {
      var homepage;
      var commonHeaderPage;
      var registrationModalPage;
      var companyUsersModalPage;
      var userSettingsModalPage;
      var signInPage;
      var signUpPage;
      var EMAIL_ADDRESS;
      var PASSWORD;
      var mailListener;

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        registrationModalPage = new RegistrationModalPage();
        companyUsersModalPage = new CompanyUsersModalPage();
        userSettingsModalPage = new UserSettingsModalPage();
        signInPage = new SignInPage();
        signUpPage = new SignUpPage();

        EMAIL_ADDRESS = commonHeaderPage.getStageEmailAddress();
        PASSWORD = commonHeaderPage.getPassword();

        mailListener = new MailListener(EMAIL_ADDRESS,PASSWORD);
        mailListener.start();

        homepage.get();
        signInPage.signIn();
      });

      describe("Add a new User", function() {
        it("Opens Company Users Dialog and load company users", function() {
          companyUsersModalPage.openCompanyUsersModal();

          helper.wait(companyUsersModalPage.getCompanyUsersModal(), "Company Users Modal");

          expect(companyUsersModalPage.getCompanyUsersModal().isDisplayed()).to.eventually.be.true;
        });

        it("opens up Add User dialog", function () {
          companyUsersModalPage.openAddUserDialog();

          expect(userSettingsModalPage.getUserSettingsModal().isPresent()).to.eventually.be.true;
        });

        it("adds a user", function () {
          userSettingsModalPage.getUsernameField().sendKeys(EMAIL_ADDRESS);
          userSettingsModalPage.getFirstNameField().sendKeys("Added");
          userSettingsModalPage.getLastNameField().sendKeys("User");
          userSettingsModalPage.getEmailField().sendKeys(EMAIL_ADDRESS);
          // Set as User Administrator so they can delete themselves
          userSettingsModalPage.getUaCheckbox().click();
          userSettingsModalPage.getSaveButton().click();
          
          helper.waitDisappear(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");        

          expect(userSettingsModalPage.getUserSettingsModal().isPresent()).to.eventually.be.false;
        });

        it('should send an email to the added user',function(){
          browser.controlFlow().wait(mailListener.getLastEmail(), 45000).then(function (email) {
            expect(email.subject).to.equal("You've been added to a Rise Vision account!");
          }); 
        });
        
        it("Company Users Dialog Should Close", function () {
          companyUsersModalPage.closeCompanyUsersModal();

          expect(companyUsersModalPage.getCompanyUsersModal().isPresent()).to.eventually.be.false;
        });

        it("should log out", function() {
          commonHeaderPage.getProfilePic().click();

          //shows sign-out menu item
          expect(commonHeaderPage.getSignOutButton().isDisplayed()).to.eventually.be.true;

          //click sign out
          commonHeaderPage.getSignOutButton().click();
          
          helper.wait(commonHeaderPage.getSignOutModal(), "Sign Out Modal");
          
          expect(commonHeaderPage.getSignOutModal().isDisplayed()).to.eventually.be.true;
          commonHeaderPage.getSignOutGoogleButton().click();

          //signed out; google sign-in button shows
          expect(signInPage.getSignInGoogleLink().isDisplayed()).to.eventually.be.true;
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        });

      });

      describe("New User Logs in and Registers", function() {
        var confirmationLink;

        it('should register user',function(){
          signUpPage.get();

          signUpPage.customAuthSignUp(EMAIL_ADDRESS, PASSWORD);

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
          expect(signUpPage.getEmailConfirmedNotice().isDisplayed()).to.eventually.be.true;
        });

        it('should sign in user and show T&C Dialog on new Account', function() {
          signInPage.customAuthSignIn(EMAIL_ADDRESS,PASSWORD);         
          helper.wait(registrationModalPage.getRegistrationModal(), "Registration Modal");
          expect(registrationModalPage.getRegistrationModal().isPresent()).to.eventually.be.true;
        });

        it("should show only relevant Registration fields", function() {
          expect(registrationModalPage.getFirstNameField().isDisplayed()).to.eventually.be.true;
          expect(registrationModalPage.getLastNameField().isDisplayed()).to.eventually.be.true;
          expect(registrationModalPage.getCompanyNameField().isDisplayed()).to.eventually.be.false;
          expect(registrationModalPage.getCompanyIndustryDropdown().isDisplayed()).to.eventually.be.false;
          expect(registrationModalPage.getTermsCheckbox().isDisplayed()).to.eventually.be.true;
        });

        it("should complete the registration process", function () {
          registrationModalPage.getFirstNameField().clear();
          registrationModalPage.getFirstNameField().sendKeys("Jenkins1");
          registrationModalPage.getLastNameField().clear();
          registrationModalPage.getLastNameField().sendKeys("ForDeletion");
          //click authorize
          registrationModalPage.getTermsCheckbox().click();
          
          registrationModalPage.getSaveButton().click();
          
          helper.waitRemoved(registrationModalPage.getRegistrationModal(), "Registration Modal");

          expect(registrationModalPage.getRegistrationModal().isPresent()).to.eventually.be.false;
        });

        it("should update auth button", function () {
          expect(commonHeaderPage.getProfilePic().isDisplayed()).to.eventually.be.true;
        });

      });

      describe("New User Deletes Themselves", function() {

        it("Opens User Settings Dialog", function() {
          commonHeaderPage.openProfileMenu();

          expect(homepage.getUserSettingsButton().isDisplayed()).to.eventually.be.true;
          homepage.getUserSettingsButton().click();

          helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");

          helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal Loader");
        });

        it("deletes a user", function() {
          browser.sleep(500);
          // Ensure the right User is being deleted
          expect(userSettingsModalPage.getUsernameLabel().getText()).to.eventually.equal(EMAIL_ADDRESS);

          userSettingsModalPage.getDeleteButton().click();
          
          browser.switchTo().alert().accept();  // Use to accept (simulate clicking ok)
          
          helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal");
        });
        
      });

      after(function(){
        mailListener.stop();
      });

    });
  };

  module.exports = RegistrationExistingCompanyScenarios;

})();
