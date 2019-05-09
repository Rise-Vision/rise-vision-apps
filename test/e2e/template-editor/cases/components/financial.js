'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var helper = require('rv-common-e2e').helper;

var FinancialComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Financial Component', function () {
    var testStartTime = Date.now();
    var presentationName = 'Financial Component Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();

      presentationsListPage.loadCurrentCompanyPresentationList();
      presentationsListPage.createNewPresentationFromTemplate("Example Financial Template", "example-financial-template");
    });

    describe('basic operations', function () {

      function _loadFinancialSelector() {
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        helper.wait(templateEditorPage.getFinancialComponentEdit(), 'Financial Component Edit');
        helper.clickWhenClickable(templateEditorPage.getFinancialComponentEdit(), 'Financial Component Edit');
        expect(templateEditorPage.getAddCurrenciesButton().isEnabled()).to.eventually.be.true;
      }

      it('should show one Financial Component', function () {
        // presentationsListPage.loadPresentation(presentationName);
        _loadFinancialSelector();
        expect(templateEditorPage.getInstrumentItems().count()).to.eventually.equal(3);
      });

      it('should show open the Instrument Selector', function () {
        helper.wait(templateEditorPage.getAddCurrenciesButton(), 'Add Currencies');
        helper.clickWhenClickable(templateEditorPage.getAddCurrenciesButton(), 'Add Currencies');
        expect(templateEditorPage.getAddInstrumentButton().isPresent()).to.eventually.be.true;
      });

      it('should add JPY/USD instrument', function () {
        helper.wait(templateEditorPage.getJpyUsdSelector(), 'JPY/USD Selector');
        helper.clickWhenClickable(templateEditorPage.getJpyUsdSelector(), 'JPY/USD Selector');
        helper.wait(templateEditorPage.getAddInstrumentButton(), 'Add Instrument');
        helper.clickWhenClickable(templateEditorPage.getAddInstrumentButton(), 'Add Instrument');
        expect(templateEditorPage.getAddCurrenciesButton().isPresent()).to.eventually.be.true;
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
        _loadFinancialSelector();

        expect(templateEditorPage.getInstrumentItems().count()).to.eventually.equal(4);
      });
    });
  });
};

module.exports = FinancialComponentScenarios;
