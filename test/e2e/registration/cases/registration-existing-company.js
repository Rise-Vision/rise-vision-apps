(function() {

  "use strict";

  var expect = require("rv-common-e2e").expect;
  var helper = require("rv-common-e2e").helper;
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var HomePage = require("./../../common-header/pages/homepage.js");
  var RegistrationModalPage = require("./../pages/registrationModalPage.js");
  var CompanyUsersModalPage = require("./../../common-header/pages/companyUsersModalPage.js");
  var UserSettingsModalPage = require("./../../common-header/pages/userSettingsModalPage.js");
  var SignInPage = require('./../../common/pages/signInPage.js');
  var SignUpPage = require('./../../common/pages/signUpPage.js');

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
          helper.clickOverIFrame(userSettingsModalPage.getUaCheckbox(), "UA Checkbox");
          helper.clickOverIFrame(userSettingsModalPage.getSaveButton(), "Save Button");
          
          helper.waitDisappear(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");        

          expect(userSettingsModalPage.getUserSettingsModal().isPresent()).to.eventually.be.false;
        });

        it("Company Users Dialog Should Close", function () {
          companyUsersModalPage.closeCompanyUsersModal();

          expect(companyUsersModalPage.getCompanyUsersModal().isPresent()).to.eventually.be.false;
        });

        it("should log out", function() {
          commonHeaderPage.signOut(true);
          //signed out; google sign-in button shows
          expect(signInPage.getSignInGoogleLink().isDisplayed()).to.eventually.be.true;
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        });

      });

      describe("New User Logs in and Registers", function() {
        it('should register user',function(){
          signUpPage.get();

          signUpPage.customAuthSignUp(EMAIL_ADDRESS, PASSWORD);
        });

        it('should sign in user and show T&C Dialog on new Account', function() {
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
          helper.clickOverIFrame(homepage.getUserSettingsButton(), "User Settings Button");

          helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
          helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal Loader");

          expect(userSettingsModalPage.getUserSettingsModal().isPresent()).to.eventually.be.true;
        });

        it("User deletes themselves", function() {
          browser.sleep(500);
          // Ensure the right User is being deleted
          expect(userSettingsModalPage.getUsernameLabel().getText()).to.eventually.equal(EMAIL_ADDRESS);
          expect(userSettingsModalPage.getDeleteButton().isPresent()).to.eventually.be.true;

          helper.clickOverIFrame(userSettingsModalPage.getDeleteButton(), 'User Delete Button');

          browser.sleep(500);
          helper.wait(userSettingsModalPage.getDeleteForeverButton(), 'User Delete Forever Button');      
          helper.clickOverIFrame(userSettingsModalPage.getDeleteForeverButton(), 'User Delete Forever Button');

          helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal");
          helper.waitDisappear(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
        });
        
        it("Signs user out when deleting themselves", function() {
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
          
          expect(signInPage.getSignInGoogleLink().isDisplayed()).to.eventually.be.true;
        });
        
      });

    });
  };

  module.exports = RegistrationExistingCompanyScenarios;

})();
