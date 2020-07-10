'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var AlertsPage = require('./../pages/alertsPage.js');
var DisplaysListPage = require('./../pages/displaysListPage.js');
var PresentationModalPage = require('./../../schedules/pages/presentationModalPage.js');
var DistributionModalPage = require('./../../schedules/pages/distributionModalPage.js');
var helper = require('rv-common-e2e').helper;

var AlertsScenarios = function() {

  browser.driver.manage().window().setSize(1024, 768);
  describe('Alerts', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var alertsPage;
    var displaysListPage;
    var presentationModalPage;
    var distributionModalPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      alertsPage = new AlertsPage();
      displaysListPage = new DisplaysListPage();
      presentationModalPage = new PresentationModalPage();
      distributionModalPage = new DistributionModalPage();
    });

    describe('Given user sign in', function () {

      before(function () {
        homepage.get();
        signInPage.signIn();
        homepage.dismissFeatureTour();
        commonHeaderPage.selectAlerts();
      });

      it('should show alerts page', function () {
        expect(alertsPage.getDisplaysAppContainer().isPresent()).to.eventually.be.true;
      });

      it('should show Alerts as title', function () {
        expect(alertsPage.getTitle().isPresent()).to.eventually.be.true;
        expect(alertsPage.getTitle().getText()).to.eventually.equal('Alerts');
      });

      it('should show Turn On Alerts button', function () {        
        expect(alertsPage.getAlertsToggleButton().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getAlertsToggleButton().getText()).to.eventually.equal('Turn On Alerts');
        expect(alertsPage.getAlertsToggleButton().getAttribute('class')).to.eventually.contain('disabled');
      });

      it('should show Accept Terms and Conditions', function () {
        expect(alertsPage.getTermsAcceptedCheckbox().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getTermsAcceptedCheckbox().isSelected()).to.eventually.be.false;   
        expect(alertsPage.getIAcceptLabel().isDisplayed()).to.eventually.be.true;        
        expect(alertsPage.getIAcceptLabel().getText()).to.eventually.equal('I accept the terms and conditions.');
      });

      it('should toggle Terms and Conditions', function () {
        expect(alertsPage.getTermsText().isDisplayed()).to.eventually.be.false;
        alertsPage.getToggleShowTerms().click();
        expect(alertsPage.getTermsText().isDisplayed()).to.eventually.be.true;
      });

      it('should show Alerts Off warning', function () {
        expect(alertsPage.getAlertsOffWarningContainer().isDisplayed()).to.eventually.be.true;        
      });

      it('should enable Turn On Alerts button by accepting Terms', function () {
        alertsPage.getTermsAcceptedCheckbox().click();
        expect(alertsPage.getAlertsToggleButton().getAttribute('class')).to.eventually.not.contain('disabled');      
      });

      it('should hide Alerts Off when pressing Turn On button', function () {
        alertsPage.getAlertsToggleButton().click();
        expect(alertsPage.getAlertsOffWarningContainer().isDisplayed()).to.eventually.be.false;
      });

      it('should show Webservice fields', function () {
        expect(alertsPage.getWebserviceUrlInput().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getUrlResetButton().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getUsernameInput().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getPasswordInput().isDisplayed()).to.eventually.be.true;        
      });

      it('should reset Webservice URL', function () {
        alertsPage.getWebserviceUrlInput().getText(function(text){
          alertsPage.getUrlResetButton().click();
          browser.sleep(5000);
          expect(alertsPage.getWebserviceUrlInput()).to.eventually.not.equal(text);
        });
      });

      it('should not show filters on init', function () {
        expect(alertsPage.getFiltersContainer().isDisplayed()).to.eventually.be.false;
        expect(alertsPage.getSenderContainer().isDisplayed()).to.eventually.be.false;
        expect(alertsPage.getHandlingContainer().isDisplayed()).to.eventually.be.false;
        expect(alertsPage.getCodeContainer().isDisplayed()).to.eventually.be.false;
        expect(alertsPage.getStatusLabel().isDisplayed()).to.eventually.be.false;
        expect(alertsPage.getCategoryLabel().isDisplayed()).to.eventually.be.false;
        expect(alertsPage.getUrgencyLabel().isDisplayed()).to.eventually.be.false;
        expect(alertsPage.getSeveretyLabel().isDisplayed()).to.eventually.be.false;
        expect(alertsPage.getCertaintyLabel().isDisplayed()).to.eventually.be.false;
      });
  
      it('should show filter by clicking Show Filters button', function () {
        alertsPage.getToggleFilters().click();
        expect(alertsPage.getFiltersContainer().isDisplayed()).to.eventually.be.true; 
        expect(alertsPage.getSenderContainer().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getHandlingContainer().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getCodeContainer().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getStatusLabel().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getCategoryLabel().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getUrgencyLabel().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getSeveretyLabel().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getCertaintyLabel().isDisplayed()).to.eventually.be.true;       
      });

      it('should show Alert Text to Show and Default expiry', function () {
        expect(alertsPage.getTextToShowLabel().isDisplayed()).to.eventually.be.true;
        expect(alertsPage.getDefaultExpiryInput().isDisplayed()).to.eventually.be.true;         
      });

      it('should show Presentation modal on click', function () {
          alertsPage.getPresentationField().click();
          helper.wait(presentationModalPage.getAddPresentationModal(), 'Add Presentation Modal');
          expect(presentationModalPage.getAddPresentationModal().isDisplayed()).to.eventually.be.true;
          expect(presentationModalPage.getModalTitle().getText()).to.eventually.equal('Select Presentation');
          presentationModalPage.getCloseButton().click();
          helper.waitDisappear(presentationModalPage.getAddPresentationModal(), 'Add Presentation Modal');
      });

      it('should open the Edit Distribution Modal', function () {
        browser.sleep(100);

        alertsPage.getDistributeToAllText().click();
        alertsPage.getDistributionField().click();
        helper.wait(distributionModalPage.getEditDistributionModal(), 'Edit Distribution Modal');
        expect(distributionModalPage.getEditDistributionModal().isDisplayed()).to.eventually.be.true;
        expect(distributionModalPage.getModalTitle().getText()).to.eventually.equal('Edit Distribution');
        helper.waitDisappear(distributionModalPage.getDistributionListLoader()).then(function () {
          distributionModalPage.getCancelButton().click();
        });
        
        helper.waitDisappear(distributionModalPage.getEditDistributionModal(), 'Edit Distribution Modal');
      });

      it('should show Save Button', function () {
        expect(alertsPage.getSaveButton().isPresent()).to.eventually.be.true;
      });

      it('should show Cancel Button', function () {
        expect(alertsPage.getCancelButton().isPresent()).to.eventually.be.true;
      });

      it('should save Alerts', function () {
        alertsPage.getAlertsToggleButton().click();
        alertsPage.getSaveButton().click();
        helper.waitForElementTextToChange(alertsPage.getSaveButton(),'Saving','Saving Alerts');
        helper.waitForElementTextToChange(alertsPage.getSaveButton(),'Save','Alerts Saved');
      });

      it('should navigate to Displays list on Cancel', function () {
        alertsPage.getCancelButton().click();
        expect(displaysListPage.getTitle().getText()).to.eventually.equal('Displays');
      });
      
    });
  });
};

module.exports = AlertsScenarios;
