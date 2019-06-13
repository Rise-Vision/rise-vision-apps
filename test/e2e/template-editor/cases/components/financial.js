'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var FinancialComponentPage = require('./../../pages/components/financialComponentPage.js');
var helper = require('rv-common-e2e').helper;

var FinancialComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Financial Component', function () {
    var testStartTime = Date.now();
    var presentationName = 'Financial Component Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;
    var financialComponentPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      financialComponentPage = new FinancialComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();
      presentationsListPage.createNewPresentationFromTemplate('"Example Financial Template V3"', 'example-financial-template-v3');
    });

    describe('basic operations', function () {

      it('should warn users that a Financial Data License is required',function() {
        helper.wait(templateEditorPage.getFinancialDataLicenseMessage(),'Financial Data License Message');
        expect(templateEditorPage.getFinancialDataLicenseMessage().isDisplayed()).to.eventually.be.true;

        templateEditorPage.dismissFinancialDataLicenseMessage();
      });

      it('should show one Financial Component', function () {
        templateEditorPage.selectComponent("Financial - ");
        expect(financialComponentPage.getInstrumentItems().count()).to.eventually.equal(3);
      });

      it('should show open the Instrument Selector', function () {
        helper.wait(financialComponentPage.getAddCurrenciesButton(), 'Add Currencies');
        helper.clickWhenClickable(financialComponentPage.getAddCurrenciesButton(), 'Add Currencies');
        expect(financialComponentPage.getAddInstrumentButton().isPresent()).to.eventually.be.true;
      });

      it('should add JPY/USD instrument', function () {
        helper.wait(financialComponentPage.getJpyUsdSelector(), 'JPY/USD Selector');
        helper.clickWhenClickable(financialComponentPage.getJpyUsdSelector(), 'JPY/USD Selector');
        helper.wait(financialComponentPage.getAddInstrumentButton(), 'Add Instrument');
        helper.clickWhenClickable(financialComponentPage.getAddInstrumentButton(), 'Add Instrument');
        expect(financialComponentPage.getAddCurrenciesButton().isPresent()).to.eventually.be.true;
      });

      it('should save the Presentation, reload it, and validate changes were saved', function () {

        presentationsListPage.changePresentationName(presentationName);
        presentationsListPage.savePresentation();

        //log presentaion / company URL for troubeshooting
        browser.getCurrentUrl().then(function(actualUrl) {
          console.log(actualUrl);
        });
        browser.sleep(100);

        expect(templateEditorPage.getSaveButton().isEnabled()).to.eventually.be.true;

        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent("Financial - ");

        expect(financialComponentPage.getInstrumentItems().count()).to.eventually.equal(4);
      });
    });
  });
};

module.exports = FinancialComponentScenarios;
