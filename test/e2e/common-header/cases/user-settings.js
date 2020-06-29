(function() {

  "use strict";
  
  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var HomePage = require('./../pages/homepage.js');
  var UserSettingsModalPage = require('./../pages/userSettingsModalPage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');

  var UserSettingsScenarios = function() {

    describe("User Settings", function() {
      var commonHeaderPage, 
        homepage, 
        userSettingsModalPage,
        signInPage;
        
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        userSettingsModalPage = new UserSettingsModalPage();
        signInPage = new SignInPage();

        homepage.getEditor();
        signInPage.signIn();
      });

      it("should show user settings modal", function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        commonHeaderPage.getProfilePic().click();
        
        expect(homepage.getUserSettingsButton().isDisplayed()).to.eventually.be.true;

        //click on user settings button
        homepage.getUserSettingsButton().click();
        
        helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
        helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Loader");

        expect(userSettingsModalPage.getUserSettingsModal().isDisplayed()).to.eventually.be.true;
      });
      
      it("should show user information", function() {
        expect(userSettingsModalPage.getFirstNameField().getAttribute('value')).to.eventually.equal("Jenkins");
        expect(userSettingsModalPage.getLastNameField().getAttribute('value')).to.eventually.equal("Rise");
        expect(userSettingsModalPage.getEmailField().getAttribute('value')).to.eventually.equal(browser.params.login.user1);
        expect(userSettingsModalPage.getPhoneField().getAttribute('value')).to.eventually.equal("000-000-0000");

        expect(userSettingsModalPage.getCeCheckbox().isSelected()).to.eventually.be.true;
        expect(userSettingsModalPage.getCpCheckbox().isSelected()).to.eventually.be.true;
        expect(userSettingsModalPage.getDaCheckbox().isSelected()).to.eventually.be.true;
      });

    });

  };

  module.exports = UserSettingsScenarios;

})();
