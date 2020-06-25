(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');
  var HomePage = require('./../pages/homepage.js');
  var CompanyUsersModalPage = require('./../pages/companyUsersModalPage.js');
  var UserSettingsModalPage = require('./../pages/userSettingsModalPage.js');

  var CompanyUsersScenarios = function() {

    describe("Company Users", function() {
      var commonHeaderPage, 
        signInPage,
        homepage, 
        companyUsersModalPage,
        userSettingsModalPage;

      var initialUsername, updatedUsername;

      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        signInPage = new SignInPage();
        homepage = new HomePage();
        companyUsersModalPage = new CompanyUsersModalPage();
        userSettingsModalPage = new UserSettingsModalPage();

        initialUsername = commonHeaderPage.getStageEnv() + "user@somecompany.com";
        updatedUsername = commonHeaderPage.getStageEnv() + "updated@somecompany.com";

        homepage.getEditor();
        signInPage.signIn();

        companyUsersModalPage.deleteUserIfExists(initialUsername);
      });

      it("Opens Company Users Dialog and load company users", function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        companyUsersModalPage.openCompanyUsersModal();

        expect(companyUsersModalPage.getCompanyUsersModal().isDisplayed()).to.eventually.be.true;
      });

      it("loads up a list of users for the company", function () {
        browser.sleep(500);

        helper.waitDisappear(companyUsersModalPage.getLoader(), "Load Company Users");

        expect(companyUsersModalPage.getUsers().count()).to.eventually.be.above(0);
      });

      it("opens up Add User dialog", function () {
        companyUsersModalPage.openAddUserDialog();

        expect(userSettingsModalPage.getUserSettingsModal().isPresent()).to.eventually.be.true;
      });

      it("adds a user", function () {
        userSettingsModalPage.getUsernameField().sendKeys(initialUsername);
        userSettingsModalPage.getFirstNameField().sendKeys("John");
        userSettingsModalPage.getLastNameField().sendKeys("test");
        userSettingsModalPage.getPhoneField().sendKeys("000-000-0000");

        userSettingsModalPage.getCeCheckbox().click();
        userSettingsModalPage.getDaCheckbox().click();

        userSettingsModalPage.getEmailField().sendKeys(initialUsername);
        userSettingsModalPage.getSaveButton().click();
        
        helper.waitDisappear(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");        
      });

      it("searches for the user", function() {
        companyUsersModalPage.searchUser(initialUsername);

        expect(companyUsersModalPage.getUsers().count()).to.eventually.be.greaterThan(0);
      });
      
      it("selects a user", function() {
        // assume first user
        companyUsersModalPage.getUsers().get(0).click();

        helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
        
        helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal Loader");

        expect(userSettingsModalPage.getFirstNameField().getAttribute('value')).to.eventually.equal("John");
        expect(userSettingsModalPage.getLastNameField().getAttribute('value')).to.eventually.equal("test");
        expect(userSettingsModalPage.getEmailField().getAttribute('value')).to.eventually.equal(initialUsername);

        expect(userSettingsModalPage.getCeCheckbox().isSelected()).to.eventually.be.true;
        expect(userSettingsModalPage.getCpCheckbox().isSelected()).to.eventually.be.false;
        expect(userSettingsModalPage.getDaCheckbox().isSelected()).to.eventually.be.true;
      });

      it("should update settings", function() {
        userSettingsModalPage.getFirstNameField().clear();
        userSettingsModalPage.getFirstNameField().sendKeys("Updated");

        userSettingsModalPage.getLastNameField().clear();
        userSettingsModalPage.getLastNameField().sendKeys("Name");

        userSettingsModalPage.getPhoneField().clear();
        userSettingsModalPage.getPhoneField().sendKeys("000-000-0000");

        userSettingsModalPage.getEmailField().clear();
        userSettingsModalPage.getEmailField().sendKeys(updatedUsername);

        userSettingsModalPage.getCpCheckbox().click();
        userSettingsModalPage.getDaCheckbox().click();

        //click save button
        userSettingsModalPage.getSaveButton().click();
        
        helper.waitRemoved(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
        
      });

      it("should search for updated email", function() {
        companyUsersModalPage.searchUser(updatedUsername);

        expect(companyUsersModalPage.getUsers().count()).to.eventually.be.greaterThan(0);
      });
      
      it("should show updated information", function() {
        companyUsersModalPage.getUsers().get(0).click();
        
        helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");

        helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal Loader");

        expect(userSettingsModalPage.getFirstNameField().getAttribute('value')).to.eventually.equal("Updated");
        expect(userSettingsModalPage.getLastNameField().getAttribute('value')).to.eventually.equal("Name");
        expect(userSettingsModalPage.getEmailField().getAttribute('value')).to.eventually.equal(updatedUsername);
        expect(userSettingsModalPage.getPhoneField().getAttribute('value')).to.eventually.equal("000-000-0000");

        expect(userSettingsModalPage.getCeCheckbox().isSelected()).to.eventually.be.true;
        expect(userSettingsModalPage.getCpCheckbox().isSelected()).to.eventually.be.true;
        expect(userSettingsModalPage.getDaCheckbox().isSelected()).to.eventually.be.false;
      });

      it("deletes a user", function() {
        expect(userSettingsModalPage.getEmailField().getAttribute('value')).to.eventually.equal(updatedUsername);

        userSettingsModalPage.getDeleteButton().click();
        
        browser.sleep(500);
        helper.wait(userSettingsModalPage.getDeleteForeverButton(), 'User Delete Forever Button');      
        helper.clickWhenClickable(userSettingsModalPage.getDeleteForeverButton(), 'User Delete Forever Button');
        
        helper.waitDisappear(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
      });
      
      it("Company Users Dialog Should Close", function () {
        companyUsersModalPage.closeCompanyUsersModal();
        
        expect(companyUsersModalPage.getCompanyUsersModal().isPresent()).to.eventually.be.false;
      });
        
    });
  };
  
  module.exports = CompanyUsersScenarios;

})();
