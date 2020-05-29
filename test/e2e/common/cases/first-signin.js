'use strict';
var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var HomePage = require('./../pages/homepage.js');
var SignInPage = require('./../pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var TemplateEditorPage = require('./../../template-editor/pages/templateEditorPage.js');
var DisplayAddModalPage = require('./../../displays/pages/displayAddModalPage.js');
var OnboardingPage = require('./../pages/onboardingPage.js');


var FirstSigninScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('First Signin', function () {
    var subCompanyName = 'E2E TEST SUBCOMPANY - FIRST SIGN IN';
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var templateEditorPage;
    var displayAddModalPage;
    var onboardingPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      templateEditorPage = new TemplateEditorPage();
      displayAddModalPage = new DisplayAddModalPage();
      onboardingPage = new OnboardingPage();
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

      it('should show the Onboarding page', function() {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        helper.waitDisappear(onboardingPage.getOnboardingLoader(), 'Onboarding Loader');

        helper.wait(onboardingPage.getOnboardingContainer(), 'Onboarding Page');

        expect(onboardingPage.getOnboardingContainer().isDisplayed()).to.eventually.be.true;
      });
      
      it('should show Step 1', function() {
        expect(onboardingPage.getStepsTabs().get(0).isDisplayed()).to.eventually.be.true;
        expect(onboardingPage.getStepsTabs().get(0).getAttribute('class')).to.eventually.contain('active'); 
      });

      it('should show recommended Templates', function() {
        expect(onboardingPage.getAddTemplateStep().isDisplayed()).to.eventually.be.true;
      });

      it('should show `go back to previous step` if I click other steps', function() {
        onboardingPage.getStepsTabs().get(1).click();

        expect(onboardingPage.getPreviousStepButton().isDisplayed()).to.eventually.be.true;
      });

      it('should allow user to pick a Template', function() {
        onboardingPage.getPreviousStepButton().click();

        expect(onboardingPage.getPickTemplateButtons().get(0).isDisplayed()).to.eventually.be.true;

        onboardingPage.getPickTemplateButtons().get(0).click();
      });

      it('should go back to Onboarding after publishing the Template', function() {
        helper.clickWhenClickable(templateEditorPage.getPublishButton(), 'Publish Button');

        helper.wait(onboardingPage.getOnboardingContainer(), 'Onboarding Page');

        expect(onboardingPage.getOnboardingContainer().isDisplayed()).to.eventually.be.true;  
      });

      it('should show Next Step button', function() {
        expect(onboardingPage.getNextStepButton().isDisplayed()).to.eventually.be.true;
        onboardingPage.getNextStepButton().click();
      });

      it('should show Step 2', function() {
        expect(onboardingPage.getStepsTabs().get(1).getAttribute('class')).to.eventually.contain('active');
        expect(onboardingPage.getAddDisplayStep().isDisplayed()).to.eventually.be.true;
      });

      it('should add display', function () {
        var displayName = 'TEST_E2E_DISPLAY ' + commonHeaderPage.getStageEnv();
        displayAddModalPage.getDisplayNameField().sendKeys(displayName);
        expect(displayAddModalPage.getNextButton().isEnabled()).to.eventually.be.true;
        displayAddModalPage.getNextButton().click();
      });

      it('should show display activation instructions', function() {
        helper.wait(displayAddModalPage.getDisplayAddedPage(), 'Display Added page');

        expect(displayAddModalPage.getDisplayAddedPage().isDisplayed()).to.eventually.be.true;
        expect(displayAddModalPage.getPreconfiguredPlayerButton().isDisplayed()).to.eventually.be.true;
        expect(displayAddModalPage.getOwnPlayerButton().isDisplayed()).to.eventually.be.true;
      });

      it('should show instructions on how to configure Own Media Player', function() {
        displayAddModalPage.getOwnPlayerButton().click();
        displayAddModalPage.getNextButton().click();

        helper.wait(displayAddModalPage.getUserPlayerPage(), 'User Player page');      
        expect(displayAddModalPage.getUserPlayerPage().isDisplayed()).to.eventually.be.true;
        expect(displayAddModalPage.getPickWindowsLink().isDisplayed()).to.eventually.be.true;
      });

      after(function() {
        commonHeaderPage.deleteCurrentCompany();

        commonHeaderPage.signOut(true);
      });

    });
  });
};
module.exports = FirstSigninScenarios;
