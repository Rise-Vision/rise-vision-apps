(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;
  var assert = require('rv-common-e2e').assert;
  var helper = require('rv-common-e2e').helper;
  var CommonHeaderPage = require('./../pages/commonHeaderPage.js');
  var HomePage = require('./../pages/homepage.js');
  var AddSubcompanyModalPage = require('./../pages/addSubcompanyModalPage.js');
  var SelectSubcompanyModalPage = require('./../pages/selectSubcompanyModalPage.js');
  var CompanySettingsModalPage = require('./../pages/companySettingsModalPage.js');
  var MoveCompanyModalPage = require('./../pages/moveCompanyModalPage.js');
  var SafeDeleteModalPage = require('./../pages/safeDeleteModalPage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');

  var CompanySubcompaniesScenarios = function() {

    describe("Subcompanies", function() {
      var subCompanyName = 'E2E TEST SUBCOMPANY - SUBCOMPANIES - parent';
      var subSubCompanyName = 'E2E TEST SUBCOMPANY - SUBCOMPANIES - sub';

      var commonHeaderPage, 
        homepage,
        addSubcompanyModalPage,
        selectSubcompanyModalPage,
        companySettingsModalPage,
        moveCompanyModalPage,
        safeDeleteModalPage,
        signInPage;
        
      var companyUrl, subCompanyUrl, subCompanyCount;  
        
      before(function (){
        commonHeaderPage = new CommonHeaderPage();
        homepage = new HomePage();
        addSubcompanyModalPage = new AddSubcompanyModalPage();
        selectSubcompanyModalPage = new SelectSubcompanyModalPage();
        companySettingsModalPage = new CompanySettingsModalPage();
        moveCompanyModalPage = new MoveCompanyModalPage();
        safeDeleteModalPage = new SafeDeleteModalPage();
        signInPage = new SignInPage();

        homepage.getEditor();
        signInPage.signIn();

        // In case move succeeded and deletion failed
        commonHeaderPage.deleteSubCompanyIfExists(subSubCompanyName);
      });
      
      describe("Add subcompany", function () {
        before("Get company url", function(done) {
          browser.getCurrentUrl().then(function(value) {
            companyUrl = value;
            
            done();
          });  
        });
        
        it("Add new company", function() {
          commonHeaderPage.createUnsubscribedSubCompany(subCompanyName);
        });
      });

      describe("Select Subcompany", function () {
        it("Switches to subcompany", function (done) {
          commonHeaderPage.selectSubCompany(subCompanyName);

          expect(homepage.getSubcompanyAlert().isDisplayed()).to.eventually.be.true;
          expect(browser.getCurrentUrl()).to.eventually.not.equal(companyUrl);
          
          browser.getCurrentUrl().then(function(value) {
            subCompanyUrl = value;
            
            done();
          });
        });
        
        it("Shows sub-company details", function() {
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
          commonHeaderPage.getProfilePic().click();

          expect(homepage.getSelectSubcompanyButton().isDisplayed()).to.eventually.be.false;
          expect(homepage.getChangeSubcompanyButton().isDisplayed()).to.eventually.be.true;
          expect(homepage.getResetSubcompanyButton().isDisplayed()).to.eventually.be.true;
        });

        it("Switches back to parent company", function () {
          homepage.getResetSubcompanyButton().click();
          
          helper.waitDisappear(homepage.getSubcompanyAlert(), "Subcompany Alert");

          expect(homepage.getSubcompanyAlert().isDisplayed()).to.eventually.be.false;

          expect(browser.getCurrentUrl()).to.eventually.equal(companyUrl);
        });

        it("Can specify subcompany via URL parameter", function () {
          browser.get(subCompanyUrl);
          
          helper.wait(homepage.getSubcompanyAlert(), "Subcompany Alert");

          expect(homepage.getSubcompanyAlert().isDisplayed()).to.eventually.be.true;
          expect(homepage.getTestCompanyAlert().isDisplayed()).to.eventually.be.false;
        });
      });
      
      describe("Move company", function () {
        var subCompanyClaimId;
        
        it("Add another sub company", function() {
          commonHeaderPage.createUnsubscribedSubCompany(subSubCompanyName);
        });
        
        it("Switch to sub-sub-company", function() {
          commonHeaderPage.selectSubCompany(subSubCompanyName);

          expect(homepage.getSubcompanyAlert().getText()).to.eventually.contain(commonHeaderPage.addStageSuffix(subSubCompanyName));
        });
          
        it("Get Company Auth Key", function(done) {
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
          commonHeaderPage.getProfilePic().click();
          homepage.getCompanySettingsButton().click();
          
          helper.wait(companySettingsModalPage.getCompanySettingsModal(), "Comapny Settings Modal");        
          helper.waitDisappear(companySettingsModalPage.getLoader(), "Load Company Settings");
          
          companySettingsModalPage.getAuthKeyField().getText().then(function(value) {
            subCompanyClaimId = value;
                        
            done();
          });        
        });
        
        it("Opens Move Company Dialog", function() {
          browser.get(companyUrl);

          helper.waitDisappear(homepage.getSubcompanyAlert(), "Subcompany Alert");
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

          commonHeaderPage.getProfilePic().click();
          homepage.getAddSubcompanyButton().click();

          helper.wait(addSubcompanyModalPage.getAddSubcompanyModal(), "Add Subcompany Modal");

          expect(addSubcompanyModalPage.getMoveButton().isDisplayed()).to.eventually.be.true;

          browser.sleep(500);

          addSubcompanyModalPage.getMoveButton().click();
          
          helper.wait(moveCompanyModalPage.getMoveCompanyModal(), "Move Company Modal");

          expect(moveCompanyModalPage.getMoveCompanyModal().isDisplayed()).to.eventually.be.true;
        });

        it("Shows error on invalid auth key", function () {
          moveCompanyModalPage.getAuthKeyField().clear();
          moveCompanyModalPage.getAuthKeyField().sendKeys("invalid-auth-key");
          
          moveCompanyModalPage.getRetrieveDetailsButton().click();
          
          helper.waitDisappear(moveCompanyModalPage.getLoader(), "Move Company Loader");
          
          expect(moveCompanyModalPage.getNotFoundMessage().isDisplayed()).to.eventually.be.true;
          expect(moveCompanyModalPage.getMoveButton().isDisplayed()).to.eventually.be.false;
        });

        it("Retrieves Company Info", function () {
          moveCompanyModalPage.getAuthKeyField().clear();
          moveCompanyModalPage.getAuthKeyField().sendKeys(subCompanyClaimId);

          moveCompanyModalPage.getRetrieveDetailsButton().click();
          
          helper.waitDisappear(moveCompanyModalPage.getLoader(), "Move Company Loader");
          
          expect(moveCompanyModalPage.getNotFoundMessage().isPresent()).to.eventually.be.false;
          expect(moveCompanyModalPage.getMoveButton().isDisplayed()).to.eventually.be.true;
          expect(moveCompanyModalPage.getCompanyDetailsMessage().isDisplayed()).to.eventually.be.true;
        });
        
        it("Should Move Company", function () {
          moveCompanyModalPage.getMoveButton().click();

          helper.waitDisappear(moveCompanyModalPage.getLoader(), "Move Company Loader");

          expect(moveCompanyModalPage.getSuccessMessage().isDisplayed()).to.eventually.be.true;
          expect(moveCompanyModalPage.getMoveButton().isDisplayed()).to.eventually.be.false;
        });

        it("Move Company Dialog Should Close", function () {
          moveCompanyModalPage.getCloseButton().click();
          
          helper.waitDisappear(moveCompanyModalPage.getMoveCompanyModal(), "Move Company Modal");
          
          expect(moveCompanyModalPage.getMoveCompanyModal().isPresent()).to.eventually.be.false;
        });

        it("Closes Add subcompany Dialog", function () {
          addSubcompanyModalPage.getCloseButton().click();
          
          helper.waitDisappear(addSubcompanyModalPage.getAddSubcompanyModal(), "Add Sub-Company Modal");

          expect(addSubcompanyModalPage.getAddSubcompanyModal().isPresent()).to.eventually.be.false;
        });

        it("Verify there are 2 sub-companies", function() {
          commonHeaderPage.searchSubCompany("E2E TEST SUBCOMPANY - SUBCOMPANIES");

          expect(selectSubcompanyModalPage.getCompanies().count()).to.eventually.equal(2);
        });

        it("Close sub-company modal dialog", function() {
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
          selectSubcompanyModalPage.getCloseButton().click();
        });
      });
      
      describe("Delete Company", function () {
        before(function() {
          homepage.getEditor();
        });

        it("Switch to sub-company", function() {
          commonHeaderPage.selectSubCompany(subCompanyName);
        });
        
        it("Opens Company Settings Dialog", function() {
          helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

          commonHeaderPage.getProfilePic().click();
          
          homepage.getCompanySettingsButton().click();        
          
          helper.wait(companySettingsModalPage.getCompanySettingsModal(), "Comapny Settings Modal");
          
          expect(companySettingsModalPage.getCompanySettingsModal().isDisplayed()).to.eventually.be.true;
            
          helper.waitDisappear(companySettingsModalPage.getLoader(), "Load Company Settings");
          
          expect(companySettingsModalPage.getNameField().getAttribute('value')).to.eventually.equal(commonHeaderPage.addStageSuffix(subCompanyName));
        });

        it("Should open safe delete dialog",function(){
          companySettingsModalPage.getDeleteButton().click();

          helper.wait(safeDeleteModalPage.getSafeDeleteModal(), "Safe Delete Modal");

          expect(safeDeleteModalPage.getSafeDeleteModal().isDisplayed()).to.eventually.be.true;
        });

        it("should disable Delete Forever Button until DELETE is typed", function(){
          expect(safeDeleteModalPage.getDeleteForeverButton().isEnabled()).to.eventually.be.false;

          safeDeleteModalPage.getSafeDeleteInput().sendKeys('DEL');
          expect(safeDeleteModalPage.getDeleteForeverButton().isEnabled()).to.eventually.be.false;

          safeDeleteModalPage.getSafeDeleteInput().sendKeys('ETE');
          expect(safeDeleteModalPage.getDeleteForeverButton().isEnabled()).to.eventually.be.true;
        });
        
        it("Should delete the company and return to parent company", function() {
          safeDeleteModalPage.getDeleteForeverButton().click();

          helper.waitDisappear(homepage.getSubcompanyAlert(), "Subcompany Alert");

          expect(homepage.getSubcompanyAlert().isDisplayed()).to.eventually.be.false;
        });
      });

      describe("Clean up other subcompany", function() {
        before(function() {
          homepage.getEditor();
        });

        it("Switch to sub-company and delete it", function() {
          commonHeaderPage.selectSubCompany(subSubCompanyName);

          expect(homepage.getSubcompanyAlert().getText()).to.eventually.contain(commonHeaderPage.addStageSuffix(subSubCompanyName));

          commonHeaderPage.deleteCurrentCompany();
        });
        
        it("Should return to parent company", function() {
          expect(homepage.getSubcompanyAlert().isDisplayed()).to.eventually.be.false;
        });
      });

    });
  };
  
  module.exports = CompanySubcompaniesScenarios;
  
})();
