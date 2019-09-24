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

  var RegistrationExistingCompanyScenarios = function() {

    browser.driver.manage().window().setSize(1400, 900);
    describe("Registration Existing Company", function () {
      var homepage;
      var commonHeaderPage;
      var registrationModalPage;
      var companyUsersModalPage;
      var userSettingsModalPage;
      var signInPage;

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        registrationModalPage = new RegistrationModalPage();
        companyUsersModalPage = new CompanyUsersModalPage();
        userSettingsModalPage = new UserSettingsModalPage();
        signInPage = new SignInPage();

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
          userSettingsModalPage.getUsernameField().sendKeys("jenkins1@risevision.com");
          userSettingsModalPage.getFirstNameField().sendKeys("Jenkins");
          userSettingsModalPage.getLastNameField().sendKeys("1");
          userSettingsModalPage.getEmailField().sendKeys("jenkins1@risevision.com");
          // Set as User Administrator so they can delete themselves
          userSettingsModalPage.getUaCheckbox().click();
          userSettingsModalPage.getSaveButton().click();
          
          helper.waitDisappear(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");        

          expect(userSettingsModalPage.getUserSettingsModal().isPresent()).to.eventually.be.false;
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
          commonHeaderPage.getSignOutRvOnlyButton().click();

          //signed out; google sign-in button shows
          expect(signInPage.getSignInGoogleLink().isDisplayed()).to.eventually.be.true;
        });

      });

      describe("New User Logs in and Registers", function() {
        it("should show T&C Dialog on new Google Account", function() {
          //sign in, wait for spinner to go away
          signInPage.signIn(browser.params.login.user1, browser.params.login.pass1);
          
          helper.wait(registrationModalPage.getRegistrationModal(), "Registration Modal");
          
          //dialog shows
          expect(registrationModalPage.getRegistrationModal().isPresent()).to.eventually.be.true;

          //fill in email address
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

      describe("New User Deletes Themselves", function() {
        before(function() {
          homepage.get();

          helper.waitDisappear(commonHeaderPage.getLoader(), "CH spinner loader");
        });

        it("Opens User Settings Dialog", function() {
          commonHeaderPage.getProfilePic().click();

          expect(homepage.getUserSettingsButton().isDisplayed()).to.eventually.be.true;
          homepage.getUserSettingsButton().click();

          helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");

          helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal Loader");
        });

        it("deletes a user", function() {
          // Ensure the right User is being deleted
          expect(userSettingsModalPage.getUsernameLabel().getText()).to.eventually.equal("jenkins1@risevision.com");

          userSettingsModalPage.getDeleteButton().click();
          
          browser.switchTo().alert().accept();  // Use to accept (simulate clicking ok)
          
          helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal");
        });
        
      });

    });
  };

  module.exports = RegistrationExistingCompanyScenarios;

})();
