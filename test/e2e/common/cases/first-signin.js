'use strict';
var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var HomePage = require('./../pages/homepage.js');
var SignInPage = require('./../pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var GetStartedPage = require('./../pages/getStartedPage.js');
var WorkspacePage = require('./../../editor/pages/workspacePage.js');
var StoreProductsModalPage = require('./../../editor/pages/storeProductsModalPage.js');
var AutoScheduleModalPage = require('./../../schedules/pages/autoScheduleModalPage.js');

var FirstSigninScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('First Signin', function () {
    var subCompanyName = 'E2E TEST SUBCOMPANY - FIRST SIGN IN';
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var getStartedPage;
    var workspacePage;
    var storeProductsModalPage;
    var autoScheduleModalPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      getStartedPage = new GetStartedPage();
      workspacePage = new WorkspacePage();
      storeProductsModalPage = new StoreProductsModalPage()
      autoScheduleModalPage = new AutoScheduleModalPage();
    });

    function _waitFullPageLoad(retries) {
      browser.sleep(10000);
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH Spinner Loader')
      .then(function () {
        helper.waitDisappear(homepage.getPresentationsListLoader(), 'Presentations List Loader');
        helper.waitDisappear(homepage.getSchedulesListLoader(), 'Schedules List Loader');
        helper.waitDisappear(homepage.getDisplaysListLoader(), 'Displays List Loader');
      })
      .catch(function () {
        retries = typeof(retries) === 'undefined' ? 3 : retries;

        if (retries > 0) {
          browser.driver.navigate().refresh();
          _waitFullPageLoad(retries - 1);
        }
      });
    }

    describe('Given a user that just signed up for Rise Vision', function () {
      var displayId;

      before(function () {
        homepage.get();
        signInPage.signIn();
        _waitFullPageLoad();

        commonHeaderPage.createUnsubscribedSubCompany(subCompanyName);
        helper.waitForSpinner();

        commonHeaderPage.selectSubCompany(subCompanyName);
        _waitFullPageLoad();
      });

      it('should show the Get Started page', function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        expect(getStartedPage.getGetStartedContainer().isDisplayed()).to.eventually.be.true;
      });
      
      it('should show the First Step', function() {
        browser.sleep(500);
        expect(getStartedPage.getWizardStep1().isDisplayed()).to.eventually.be.true;
        
        expect(getStartedPage.getGetStartedButton1().isDisplayed()).to.eventually.be.true;
      });

      it('should progress to the Second Step', function() {
        helper.clickWhenClickable(getStartedPage.getGetStartedButton1(), 'Get Started Button 1');
        browser.sleep(500);

        expect(getStartedPage.getWizardStep2().isDisplayed()).to.eventually.be.true;
        
        expect(getStartedPage.getGetStartedButton2().isDisplayed()).to.eventually.be.true;
      });

      it('should progress to the Third Step', function() {
        helper.clickWhenClickable(getStartedPage.getGetStartedButton2(), 'Get Started Button 2');
        browser.sleep(500);

        expect(getStartedPage.getWizardStep3().isDisplayed()).to.eventually.be.true;
        
        expect(getStartedPage.getGetStartedButton3().isDisplayed()).to.eventually.be.true;
      });

      it('should progress to the Last Step', function() {
        helper.clickWhenClickable(getStartedPage.getGetStartedButton3(), 'Get Started Button 3');
        browser.sleep(500);

        expect(getStartedPage.getWizardStep4().isDisplayed()).to.eventually.be.true;
        
        expect(getStartedPage.getGetStartedAddPresentation().isDisplayed()).to.eventually.be.true;
      });

      it('should show last step after reload',function(){
        browser.refresh();
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        // wait for transition
        browser.sleep(1000);
        
        expect(getStartedPage.getWizardStep4().isDisplayed()).to.eventually.be.true;
        
        expect(getStartedPage.getGetStartedAddPresentation().isDisplayed()).to.eventually.be.true;
      });

      it('should start a new presentation', function () {
        helper.clickWhenClickable(getStartedPage.getGetStartedAddPresentation(), 'Get Started Add Presentation');

        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader());
        helper.clickWhenClickable(storeProductsModalPage.getAddBlankPresentation(), 'Add Blank Presentation');
        
        helper.wait(workspacePage.getWorkspaceContainer(), 'Workspace Container');
        expect(workspacePage.getWorkspaceContainer().isDisplayed()).to.eventually.be.true;
      });

      it('should show Display License Required message', function() {
        helper.wait(workspacePage.getDisplayLicenseRequiredModal(), 'Display License Notification');
        
        expect(workspacePage.getDisplayLicenseRequiredModal().isDisplayed()).to.eventually.be.true;
        browser.sleep(500);

        workspacePage.getDisplayLicenseRequiredCloseButton().click();
      });

      it('should show Change Template button', function () {
        expect(workspacePage.getChangeTemplateButton().isDisplayed()).to.eventually.be.true;
      });      

      it('should auto create Schedule when saving first Presentation', function () {
        browser.sleep(500);

        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');
        helper.clickWhenClickable(workspacePage.getSaveButton(), 'Save Button');

        helper.wait(autoScheduleModalPage.getAutoScheduleModal(), 'Auto Schedule Modal');

        expect(autoScheduleModalPage.getAutoScheduleModal().isDisplayed()).to.eventually.be.true;

        helper.clickWhenClickable(autoScheduleModalPage.getCloseButton(), 'Auto Schedule Modal - Close Button');

        helper.waitDisappear(autoScheduleModalPage.getAutoScheduleModal(), 'Auto Schedule Modal');
      });

      it('should no longer show the Get Started Page', function () {
        homepage.get();
        signInPage.signIn();
        _waitFullPageLoad();

        commonHeaderPage.selectSubCompany(subCompanyName);

        _waitFullPageLoad();

        expect(getStartedPage.getGetStartedContainer().isDisplayed()).to.eventually.be.false;
      });

      after(function() {
        commonHeaderPage.deleteCurrentCompany();

        commonHeaderPage.signOut(true);
      });

    });
  });
};
module.exports = FirstSigninScenarios;
