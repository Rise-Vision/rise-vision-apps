'use strict';
var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../pages/presentationListPage.js');
var TemplateEditorPage = require('./../pages/templateEditorPage.js');
var helper = require('rv-common-e2e').helper;

var TemplateAddScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Template Editor Add', function () {
    var testStartTime = Date.now();
    var presentationName = 'Example Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;

    function _loadCurrentCompanyPresentationList() {
      helper.clickWhenClickable(templateEditorPage.getPresentationsListLink(), 'Presentations List');
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
    }

    function _loadPresentation (presentationName) {
      _loadCurrentCompanyPresentationList();
      helper.clickWhenClickable(templateEditorPage.getCreatedPresentationLink(presentationName), 'Presentation Link');
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
      helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
      browser.sleep(500); // Wait for transition to finish
    }

    function _savePresentation () {
      helper.wait(templateEditorPage.getSaveButton(), 'Save Button');
      helper.clickWhenClickable(templateEditorPage.getSaveButton(), 'Save Button');
      expect(templateEditorPage.getSaveButton().getText()).to.eventually.equal('Saving');
      helper.wait(templateEditorPage.getSaveButton(), 'Save Button');
    }

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      presentationsListPage.openNewExampleTemplate();
    });

    describe('basic operations', function () {
      it('should show more than one component', function () {
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
      });

      it('should edit the Presentation name', function () {
        expect(templateEditorPage.getPresentationName().isEnabled()).to.eventually.be.false;
        templateEditorPage.getEditNameButton().click();
        expect(templateEditorPage.getPresentationName().isEnabled()).to.eventually.be.true;
        templateEditorPage.getPresentationName().sendKeys(presentationName + protractor.Key.ENTER);
      });

      it('should save the Presentation', function () {
        _savePresentation();

        expect(templateEditorPage.getSaveButton().isEnabled()).to.eventually.be.true;
      });

      it('should publish the Presentation', function () {
        // Since the first time a Presentation is saved it's also Published, to test the button an additional Save is needed
        _savePresentation();
        _savePresentation();

        helper.clickWhenClickable(templateEditorPage.getPublishButton(), 'Publish Button');
        helper.wait(templateEditorPage.getSaveButton(), 'Save Button (after Publish)');
        expect(templateEditorPage.getSaveButton().isEnabled()).to.eventually.be.true;
      });

      it('should load the newly created Presentation', function () {
        _loadPresentation(presentationName);

        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
        expect(templateEditorPage.getImageComponentEdit().isPresent()).to.eventually.be.true;
      });

      it('should navigate into the Image component and back to the Components list', function () {
        helper.wait(templateEditorPage.getImageComponentEdit(), 'Image Component');
        helper.clickWhenClickable(templateEditorPage.getImageComponentEdit(), 'Image Component Edit');
        helper.wait(templateEditorPage.getBackToComponentsButton(), 'Back to Components Button');
        helper.clickWhenClickable(templateEditorPage.getBackToComponentsButton(), 'Back to Components Button');
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        browser.sleep(500); // Wait for transition to finish
        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
      });

      function _loadFinancialSelector () {
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        helper.wait(templateEditorPage.getFinancialComponentEdit(), 'Financial Component Edit');
        helper.clickWhenClickable(templateEditorPage.getFinancialComponentEdit(), 'Financial Component Edit');
        expect(templateEditorPage.getAddCurrenciesButton().isEnabled()).to.eventually.be.true;
      }

      it('should show one Financial Component', function () {
        _loadPresentation(presentationName);
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
        helper.wait(templateEditorPage.getSaveButton(), 'Save Button');
        helper.clickWhenClickable(templateEditorPage.getSaveButton(), 'Save Button');
        expect(templateEditorPage.getSaveButton().getText()).to.eventually.equal('Saving');
        helper.wait(templateEditorPage.getSaveButton(), 'Save Button');

        _loadPresentation(presentationName);
        _loadFinancialSelector();

        expect(templateEditorPage.getInstrumentItems().count()).to.eventually.equal(4);
      });
    });
  });
};

module.exports = TemplateAddScenarios;
