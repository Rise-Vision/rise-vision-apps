(function() {

  "use strict";
  
  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var HomePage = require('./../pages/homepage.js');
  var UserSettingsModalPage = require('./../pages/userSettingsModalPage.js');
  var SignInPage = require('./../../launcher/pages/signInPage.js');

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


        homepage.get();
        signInPage.signIn();
      });

      it("should show user settings modal", function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        commonHeaderPage.getProfilePic().click();
        
        expect(homepage.getUserSettingsButton().isDisplayed()).to.eventually.be.true;

        //click on user settings button
        homepage.getUserSettingsButton().click();
        
        helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");

        expect(userSettingsModalPage.getUserSettingsModal().isDisplayed()).to.eventually.be.true;
      });
      
      it("should update settings", function() {
        userSettingsModalPage.getFirstNameField().clear();
        userSettingsModalPage.getFirstNameField().sendKeys("John");

        userSettingsModalPage.getLastNameField().clear();
        userSettingsModalPage.getLastNameField().sendKeys("Doe");

        userSettingsModalPage.getPhoneField().clear();
        userSettingsModalPage.getPhoneField().sendKeys("000-000-0000");

        userSettingsModalPage.getEmailField().clear();
        userSettingsModalPage.getEmailField().sendKeys("testmail@testmail.com");

        if ( !userSettingsModalPage.getCeCheckbox().isSelected() )
        {
           userSettingsModalPage.getCeCheckbox().click();
        }

        if ( userSettingsModalPage.getCpCheckbox().isSelected() )
        {
           userSettingsModalPage.getCpCheckbox().click();
        }

        if ( !userSettingsModalPage.getDaCheckbox().isSelected() )
        {
           userSettingsModalPage.getDaCheckbox().click();
        }

        //click save button
        userSettingsModalPage.getSaveButton().click();
        
        helper.waitRemoved(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
        
      });
      
      it("should show updated information", function() {
        commonHeaderPage.getProfilePic().click();
        homepage.getUserSettingsButton().click();
        
        helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");

        expect(userSettingsModalPage.getFirstNameField().getAttribute('value')).to.eventually.equal("John");
        expect(userSettingsModalPage.getLastNameField().getAttribute('value')).to.eventually.equal("Doe");
        expect(userSettingsModalPage.getEmailField().getAttribute('value')).to.eventually.equal("testmail@testmail.com");
        expect(userSettingsModalPage.getPhoneField().getAttribute('value')).to.eventually.equal("000-000-0000");

        expect(userSettingsModalPage.getCeCheckbox().isSelected()).to.eventually.be.true;
        expect(userSettingsModalPage.getCpCheckbox().isSelected()).to.eventually.be.false;
        expect(userSettingsModalPage.getDaCheckbox().isSelected()).to.eventually.be.true;
      });

      // username should be shown here instead of email
      // however that's not an editable field
      xit("should immediately update fixes", function () {
        expect(element(
          by.css("span.username")).getText()).to.eventually.equal("testmail@testmail.com");
      });
    });

    // describe("Alerts link", function() {
    //   var commonHeaderPage,
    //       homepage;

    //   before(function (){
    //     commonHeaderPage = new CommonHeaderPage();
    //     homepage = new HomePage();

    //     homepage.get();

    //     //sign in, wait for spinner to go away
    //     helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
    //       commonHeaderPage.signin();
    //     });
    //   });

    //   it("should show alert settings page", function() {
    //     commonHeaderPage.getProfilePic().click();

    //     expect(homepage.getAlertSettingsButton().isDisplayed()).to.eventually.be.true;

    //     //click on alert settings button
    //     homepage.getAlertSettingsButton().click();

    //     expect(browser.driver.getCurrentUrl()).to.eventually.contain("alerts");
    //   });
    // });
  };

  module.exports = UserSettingsScenarios;

})();
