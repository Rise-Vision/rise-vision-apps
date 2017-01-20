'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var helper = require('rv-common-e2e').helper;
var WorkspacePage = require('./../../editor/pages/workspacePage.js');
var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
var PresentationPropertiesModalPage = require('./../../editor/pages/presentationPropertiesModalPage.js');
var StoreProductsModalPage = require('./../../editor/pages/storeProductsModalPage.js');
var AutoScheduleModalPage = require('./../../editor/pages/autoScheduleModalPage.js');

var FirstSigninScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe("Storage Selector", function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var workspacePage;
    var presentationListPage;
    var presentationPropertiesModalPage;
    var storeProductsModalPage;
    var autoScheduleModalPage;
    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      workspacePage = new WorkspacePage();
      presentationListPage = new PresentationListPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      storeProductsModalPage = new StoreProductsModalPage()
      autoScheduleModalPage = new AutoScheduleModalPage();
    });

    describe("Given a user that just signed up for Rise Vision", function () {

      before(function () {
        homepage.get();
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
          loginPage.signIn();
        });
        var subCompanyName = 'E2E TEST SUBCOMPANY';
        commonHeaderPage.createSubCompany(subCompanyName);
        commonHeaderPage.selectSubCompany(subCompanyName);   
      });

      it('should show Priority Support Banner', function () {
        expect(homepage.getPrioritySupportBanner().isDisplayed()).to.eventually.be.true;
      });

      it('should show Add Presentation CTA home page', function () {
        helper.wait(homepage.getPresentationCTA(), 'Presentation Call to Action');
        expect(homepage.getPresentationCTA().isDisplayed()).to.eventually.be.true;
        expect(homepage.getPresentationCTAButton().isDisplayed()).to.eventually.be.true;
      });

      it('should start a new presentation', function () {
        homepage.getPresentationCTAButton().click();

        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader());
        storeProductsModalPage.getAddBlankPresentation().click();
        
        helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
        browser.sleep(500);
        expect(presentationPropertiesModalPage.getPresentationPropertiesModal().isDisplayed()).to.eventually.be.true;
        presentationPropertiesModalPage.getApplyButton().click();
      });

      it('should show Change Template button', function () {
        expect(workspacePage.getChangeTemplateButton().isDisplayed()).to.eventually.be.true;
      });      

      it('should auto create Schedule when saving first Presentation', function () {
        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');
        workspacePage.getSaveButton().click();

        helper.wait(autoScheduleModalPage.getAutoScheduleModal());

        expect(autoScheduleModalPage.getAutoScheduleModal().isDisplayed()).to.eventually.be.true;
        autoScheduleModalPage.getCloseButton().click();
      });

      it('removes current SubCompany',function(){
        commonHeaderPage.deleteCurrentCompany();
      });

      after(function(){
        commonHeaderPage.deleteAllSubCompanies();
      });
      
    });
  });
};
module.exports = FirstSigninScenarios;
