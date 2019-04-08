'use strict';
var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('./../../../../web/bower_components/common-header/test/e2e/pages/commonHeaderPage.js');
var GetStartedPage = require('./../pages/getStartedPage.js');
var OnboardingPage = require('./../pages/onboarding.js');
var WorkspacePage = require('./../../editor/pages/workspacePage.js');
var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
var PresentationPropertiesModalPage = require('./../../editor/pages/presentationPropertiesModalPage.js');
var StoreProductsModalPage = require('./../../editor/pages/storeProductsModalPage.js');
var AutoScheduleModalPage = require('./../../editor/pages/autoScheduleModalPage.js');
var DisplayAddModalPage = require('./../../displays/pages/displayAddModalPage.js');

var FirstSigninScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('First Signin', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var getStartedPage;
    var onboardingPage;
    var workspacePage;
    var presentationListPage;
    var presentationPropertiesModalPage;
    var storeProductsModalPage;
    var autoScheduleModalPage;
    var displayAddModalPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      getStartedPage = new GetStartedPage();
      onboardingPage = new OnboardingPage();
      workspacePage = new WorkspacePage();
      presentationListPage = new PresentationListPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      storeProductsModalPage = new StoreProductsModalPage()
      autoScheduleModalPage = new AutoScheduleModalPage();
      displayAddModalPage = new DisplayAddModalPage();
    });

    describe('Given a user that just signed up for Rise Vision', function () {
      var displayId;

      before(function () {
        homepage.get();
        signInPage.signIn();
        var subCompanyName = 'E2E TEST SUBCOMPANY - FIRST SIGN IN';
        commonHeaderPage.createSubCompany(subCompanyName);
        commonHeaderPage.selectSubCompany(subCompanyName);   
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

      it('should show Change Template button', function () {
        expect(workspacePage.getChangeTemplateButton().isDisplayed()).to.eventually.be.true;
      });      

      it('should auto create Schedule when saving first Presentation', function () {
        browser.sleep(500);

        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');
        helper.clickWhenClickable(workspacePage.getSaveButton(), 'Save Button');

        helper.wait(autoScheduleModalPage.getAutoScheduleModal());

        expect(autoScheduleModalPage.getAutoScheduleModal().isDisplayed()).to.eventually.be.true;
        helper.clickWhenClickable(autoScheduleModalPage.getCloseButton(), 'Close Button');
      });

      it('should no longer show the Get Started Page', function () {
        helper.clickWhenClickable(commonHeaderPage.getCommonHeaderMenuItems().get(0), 'First Common Header Menu Item');

        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        expect(getStartedPage.getGetStartedContainer().isDisplayed()).to.eventually.be.false;
      });

      it('removes current SubCompany',function(){
        commonHeaderPage.deleteCurrentCompany();
      });

      xdescribe('Onboarding Bar: ', function() {
        it('should show Add Presentation CTA home page', function () {
          helper.wait(homepage.getPresentationCTA(), 'Presentation Call to Action');
          expect(homepage.getPresentationCTA().isDisplayed()).to.eventually.be.true;
          expect(homepage.getPresentationCTAButton().isDisplayed()).to.eventually.be.true;
        });

        it('should show onboarding bar where the next step is Add Presentation', function() {
          helper.wait(onboardingPage.getOnboardingBar(), 'Onboarding bar');

          expect(onboardingPage.getOnboardingBar().isDisplayed()).to.eventually.be.true;

          expect(onboardingPage.getAddPresentation().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getAddPresentationButton().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getAddPresentation().getAttribute('class')).to.eventually.contain('current');
          
          expect(onboardingPage.getAddDisplay().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getAddDisplayButton().isPresent()).to.eventually.be.false;

          expect(onboardingPage.getActivateDisplay().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getActivateDisplayButton().isPresent()).to.eventually.be.false;
          
          expect(onboardingPage.getStepCount().getText()).to.eventually.equal('3');
        });

        it('should start a new presentation', function () {
          homepage.getPresentationCTAButton().click();

          helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
          helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader());
          storeProductsModalPage.getAddBlankPresentation().click();
          
          helper.wait(workspacePage.getWorkspaceContainer(), 'Workspace Container');
          expect(workspacePage.getWorkspaceContainer().isDisplayed()).to.eventually.be.true;
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
        
        it('should complete Add Presentation onboarding step', function() {
          expect(onboardingPage.getAddPresentation().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getAddPresentationButton().isPresent()).to.eventually.be.false;
          expect(onboardingPage.getAddPresentation().getAttribute('class')).to.eventually.contain('completed');
          
          expect(onboardingPage.getAddDisplay().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getAddDisplayButton().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getAddDisplay().getAttribute('class')).to.eventually.contain('current');

          expect(onboardingPage.getActivateDisplay().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getActivateDisplayButton().isPresent()).to.eventually.be.false;

          expect(onboardingPage.getStepCount().getText()).to.eventually.equal('2');
        });
        
        it('should open add Display modal', function() {
          onboardingPage.getAddDisplayButton().click();

          helper.wait(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
          expect(displayAddModalPage.getDisplayNameField().isPresent()).to.eventually.be.true;
        });
        
        it('should add display', function () {
          var displayName = 'TEST_E2E_DISPLAY';
          displayAddModalPage.getDisplayNameField().sendKeys(displayName);
          expect(displayAddModalPage.getNextButton().isEnabled()).to.eventually.be.true;
          displayAddModalPage.getNextButton().click();
          helper.waitDisappear(displayAddModalPage.getNextButton(), 'Next Button');
          expect(displayAddModalPage.getNextButton().isDisplayed()).to.eventually.be.false;
          
          displayAddModalPage.getDisplayIdField().getText().then(function(text) {
            displayId = text;
          });
        });

        it('should close modal', function() {
          helper.clickWhenClickable(displayAddModalPage.getDismissButton(), 'Close modal button');
          
          helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
        });

        it('should complete Add Display onboarding step', function() {
          expect(onboardingPage.getAddPresentation().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getAddPresentationButton().isPresent()).to.eventually.be.false;
          expect(onboardingPage.getAddPresentation().getAttribute('class')).to.eventually.contain('completed');
          
          expect(onboardingPage.getAddDisplay().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getAddDisplayButton().isPresent()).to.eventually.be.false;
          expect(onboardingPage.getAddDisplay().getAttribute('class')).to.eventually.contain('completed');

          expect(onboardingPage.getActivateDisplay().isDisplayed()).to.eventually.be.true;
          expect(onboardingPage.getActivateDisplayButton().isDisplayed()).to.eventually.be.true;        
          expect(onboardingPage.getActivateDisplay().getAttribute('class')).to.eventually.contain('current');

          expect(onboardingPage.getStepCount().getText()).to.eventually.equal('1');
        });
        
        it('should show Display installation instructions', function () {
          onboardingPage.getActivateDisplayButton().click();

          helper.wait(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
          expect(displayAddModalPage.getDisplayIdField().getText()).to.eventually.equal(displayId);
        });  
        
        it('should close modal', function() {
          helper.clickWhenClickable(displayAddModalPage.getDismissButton(), 'Close modal button');
          
          helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
        });

      });

      after(function() {
        commonHeaderPage.deleteAllSubCompanies();
      });
    });
  });
};
module.exports = FirstSigninScenarios;
