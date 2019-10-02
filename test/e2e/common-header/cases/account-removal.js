(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var HomePage = require('./../pages/homepage.js');
  var CompanySettingsModalPage = require('./../pages/companySettingsModalPage.js');
  var SafeDeleteModalPage = require('./../pages/safeDeleteModalPage.js');
  var SignInPage = require('./../../launcher/pages/signInPage.js');

  var AccountRemoval = function() {

    describe("Account Removal", function() {
      var commonHeaderPage, 
        homepage, 
        companySettingsModalPage,
        safeDeleteModalPage,
        signInPage;
                
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        companySettingsModalPage = new CompanySettingsModalPage();
        safeDeleteModalPage = new SafeDeleteModalPage();
        signInPage = new SignInPage();

        homepage.get();

        signInPage.customAuthSignIn(commonHeaderPage.getStageEmailAddress(), commonHeaderPage.getPassword());
      });

      it("Deletes company", function() {
        commonHeaderPage.openProfileMenu();
        homepage.getCompanySettingsButton().click();        
        
        helper.wait(companySettingsModalPage.getCompanySettingsModal(), "Comapny Settings Modal");
        helper.waitDisappear(companySettingsModalPage.getLoader(), "Load Company Settings");
        
        // Ensure the right Company is being deleted
        expect(companySettingsModalPage.getNameField().getAttribute("value")).to.eventually.equal(commonHeaderPage.addStageSuffix("Public School"));

        companySettingsModalPage.getDeleteButton().click();
    
        // confirm delete
        helper.wait(safeDeleteModalPage.getSafeDeleteModal(), "Safe Delete Modal");
        safeDeleteModalPage.getSafeDeleteInput().sendKeys('DELETE');
        safeDeleteModalPage.getDeleteForeverButton().click();
        
        helper.waitRemoved(companySettingsModalPage.getCompanySettingsModal(), "Company Settings Modal");
      });
      
      it("Signs user out when deleting company", function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        
        expect(signInPage.getSignInGoogleLink().isDisplayed()).to.eventually.be.true;
      });
    });
  };

  module.exports = AccountRemoval;

})();
