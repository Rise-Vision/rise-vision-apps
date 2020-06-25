(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var HomePage = require('./../pages/homepage.js');
  var CompanySettingsModalPage = require('./../pages/companySettingsModalPage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');

  var CompanySettingsScenarios = function() {

    describe("Companies Settings", function() {
      var commonHeaderPage, 
        homepage, 
        companySettingsModalPage,
        signInPage;
        
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        companySettingsModalPage = new CompanySettingsModalPage();
        signInPage = new SignInPage();

        homepage.getEditor();
        signInPage.signIn();

        homepage.getNavMenuOptions().get(1).click();
        helper.waitDisappear(companySettingsModalPage.getLoader(), "Company Settings Modal");
      });

      describe("Company Settings", function () {


        it("Opens Company Settings Dialog", function() {
          commonHeaderPage.getProfilePic().click();

          expect(homepage.getCompanySettingsButton().isDisplayed()).to.eventually.be.true;
          homepage.getCompanySettingsButton().click();
          
          helper.wait(companySettingsModalPage.getCompanySettingsModal(), "Comapny Settings Modal");
          
          expect(companySettingsModalPage.getCompanySettingsModal().isDisplayed()).to.eventually.be.true;
        });
        
        it("Loads company settings", function() {
          helper.waitDisappear(companySettingsModalPage.getLoader(), "Load Company Settings");
          
          expect(companySettingsModalPage.getNameField().getAttribute('value')).to.eventually.be.ok;
          expect(companySettingsModalPage.getNameField().getAttribute("value")).to.eventually.equal("jenkins@risevision.com's Company");
        });

        it("should not navigate back with Backspace/Delete key", function(done) {
          browser.getCurrentUrl().then(function(initialUrl) {
            browser.actions().sendKeys(protractor.Key.BACK_SPACE).perform();
            expect(browser.getCurrentUrl()).to.eventually.equal(initialUrl);
            expect(companySettingsModalPage.getCompanySettingsModal().isDisplayed()).to.eventually.be.true;            
            done();
          });
        });

        it("should delete text from input", function() {
          companySettingsModalPage.getNameField().sendKeys(protractor.Key.BACK_SPACE);
          
          expect(companySettingsModalPage.getNameField().getAttribute('value')).to.eventually.equal("jenkins@risevision.com's Compan");

          //revert change
          companySettingsModalPage.getNameField().sendKeys('y')
        });

        it("Resets auth key", function() {
          var authKey = companySettingsModalPage.getAuthKeyField().getText();
          
          companySettingsModalPage.getResetAuthKeyButton().click();

          browser.sleep(500);
          helper.wait(companySettingsModalPage.getConfirmActionButton(), 'Confirm Reset Button');      
          helper.clickWhenClickable(companySettingsModalPage.getConfirmActionButton(), 'Confirm Reset Button');

          helper.waitDisappear(companySettingsModalPage.getLoader(), "Company Settings Modal");
          
          expect(companySettingsModalPage.getAuthKeyField().getText()).to.eventually.be.ok;
          expect(companySettingsModalPage.getAuthKeyField().getText()).to.eventually.not.equal(authKey);
        });

        it("Resets claim id", function() {
          var claimId = companySettingsModalPage.getClaimIdField().getText();
          
          companySettingsModalPage.getResetClaimIdButton().click();

          browser.sleep(500);
          helper.wait(companySettingsModalPage.getConfirmActionButton(), 'Confirm Reset Button');      
          helper.clickWhenClickable(companySettingsModalPage.getConfirmActionButton(), 'Confirm Reset Button');

          helper.waitDisappear(companySettingsModalPage.getLoader(), "Company Settings Modal");
          
          expect(companySettingsModalPage.getClaimIdField().getText()).to.eventually.be.ok;
          expect(companySettingsModalPage.getClaimIdField().getText()).to.eventually.not.equal(claimId);
        });

        it("Flags invalid Company address", function() {          
          expect(companySettingsModalPage.getFormError().isDisplayed()).to.eventually.be.false;

          companySettingsModalPage.getStreetField().sendKeys("515 King St W");

          companySettingsModalPage.getSaveButton().click();
          helper.waitDisappear(companySettingsModalPage.getLoader(), "Load Company Settings");

          expect(companySettingsModalPage.getFormError().isDisplayed()).to.eventually.be.true;
          expect(companySettingsModalPage.getFormError().getText()).to.eventually.be.ok;
          expect(companySettingsModalPage.getFormError().getText()).to.eventually.contain("We couldn't update your address");
        });

        it("Saves company with empty address and closes dialog", function () {
          companySettingsModalPage.getStreetField().clear();
          companySettingsModalPage.getStreetField().sendKeys("515 King St W");

          companySettingsModalPage.getSaveButton().click();
          helper.waitDisappear(companySettingsModalPage.getCompanySettingsModal(), "Company Settings Modal");
          
          expect(companySettingsModalPage.getCompanySettingsModal().isPresent()).to.eventually.be.false;
        });
      });

    });
  };
  
  module.exports = CompanySettingsScenarios;
  
})();
