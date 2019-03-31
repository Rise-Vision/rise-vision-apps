'use strict';
var expect = require('rv-common-e2e').expect;
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var PlansModalPage = require('./../../common/pages/plansModalPage.js');
var PresentationListPage = require('./../pages/presentationListPage.js');
var TemplateEditorPage = require('./../pages/templateEditorPage.js');
var helper = require('rv-common-e2e').helper;

var TemplateAddScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Template Editor Add', function () {
    var testStartTime = Date.now();
    var subCompanyName = 'E2E TEST SUBCOMPANY - TEMPLATE EDITOR ADD';
    var presentationName = 'Example Presentation - ' + testStartTime;
    var commonHeaderPage;
    var homepage;
    var signInPage;
    var plansModalPage;
    var presentationsListPage;
    var templateEditorPage;

    function _loadPresentationsList() {
      homepage.getEditor();
      signInPage.signIn();
    }

    function _createSubCompany() {
      commonHeaderPage.createSubCompany(subCompanyName);
    }

    function _selectSubCompany() {
      commonHeaderPage.selectSubCompany(subCompanyName);
    }

    function _startTrial() {
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
      templateEditorPage.seePlansLink().click();
      helper.wait(plansModalPage.getPlansModal(), 'Plans Modal');
      helper.wait(plansModalPage.getStartTrialBasicButton(), 'Basic Plan Start Trial');

      plansModalPage.getStartTrialBasicButton().click();

      helper.waitDisappear(plansModalPage.getPlansModal(), 'Plans Modal');
    }

    before(function () {
      commonHeaderPage = new CommonHeaderPage();
      homepage = new HomePage();
      signInPage = new SignInPage();
      presentationsListPage = new PresentationListPage();
      plansModalPage = new PlansModalPage();
      templateEditorPage = new TemplateEditorPage();

      _loadPresentationsList();
      _createSubCompany();
      _selectSubCompany();
      _startTrial();
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
        helper.clickWhenClickable(templateEditorPage.getSaveButton(), 'Save Button');
        expect(templateEditorPage.getSaveButton().getText()).to.eventually.equal('Saving');
        helper.wait(templateEditorPage.getSaveButton(), 'Save Button');
      });

      it('should publish the Presentation', function () {
        // Since the first time a Presentation is saved it's also Published, to test the button an additional Save is needed (or two?)
        helper.clickWhenClickable(templateEditorPage.getSaveButton(), 'Save Button 1');
        helper.wait(templateEditorPage.getSaveButton(), 'Save Button 1');
        helper.clickWhenClickable(templateEditorPage.getSaveButton(), 'Save Button 2');
        helper.wait(templateEditorPage.getSaveButton(), 'Save Button 2');
        helper.clickWhenClickable(templateEditorPage.getPublishButton(), 'Publish Button');
        helper.wait(templateEditorPage.getSaveButton(), 'Save Button 3');
      });

      it('should load the newly created Presentation', function () {
        helper.clickWhenClickable(templateEditorPage.getPresentationsListLink(), 'Presentations List');
        helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
        helper.clickWhenClickable(templateEditorPage.getCreatedPresentationLink(presentationName), 'Created Presentation Link');
        helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
        expect(templateEditorPage.getImageComponentEdit().isPresent()).to.eventually.be.true;
      });

      it('should navigate into the Image component and back to the Components list', function () {
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        helper.wait(templateEditorPage.getImageComponent(), 'Image Component');
        expect(templateEditorPage.getImageComponent().isPresent()).to.eventually.be.true;
        helper.clickWhenClickable(templateEditorPage.getImageComponentEdit(), 'Image Component Edit');
        helper.wait(templateEditorPage.getBackToComponentsButton(), 'Back to Components Button');
        helper.clickWhenClickable(templateEditorPage.getBackToComponentsButton(), 'Back to Components Button');
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
      });
    });

    describe('financial component', function () {
      it('should show one Financial Component', function () {
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        helper.wait(templateEditorPage.getFinancialComponent(), 'Financial Component');
        expect(templateEditorPage.getFinancialComponent().isPresent()).to.eventually.be.true;
        helper.clickWhenClickable(templateEditorPage.getFinancialComponentEdit(), 'Financial Component Edit');
        expect(templateEditorPage.getAddCurrenciesButton().isEnabled()).to.eventually.be.true;
        expect(templateEditorPage.getInstrumentItems().count()).to.eventually.equal(3);
      });

      it('should show open the Instrument Selector', function () {
        helper.wait(templateEditorPage.getAddCurrenciesButton(), 'Add Currencies');
        helper.clickWhenClickable(templateEditorPage.getAddCurrenciesButton(), 'Add Currencies');
        expect(templateEditorPage.getAddInstrumentButton().isPresent()).to.eventually.be.true;
      });

      it('should add JPY/USD instrument', function () {
        expect(templateEditorPage.getAddInstrumentButton().isEnabled()).to.eventually.be.false;
        helper.clickWhenClickable(templateEditorPage.getJpyUsdSelector(), 'JPY/USD Selector');
        expect(templateEditorPage.getAddInstrumentButton().isEnabled()).to.eventually.be.true;
        helper.clickWhenClickable(templateEditorPage.getAddInstrumentButton(), 'Add Instrument');
        expect(templateEditorPage.getAddCurrenciesButton().isPresent()).to.eventually.be.true;
      });

      it('should save the Presentation, reload it, and validate changes were saved', function () {
        helper.clickWhenClickable(templateEditorPage.getSaveButton(), 'Save Button');
        expect(templateEditorPage.getSaveButton().getText()).to.eventually.equal('Saving');
        helper.wait(templateEditorPage.getSaveButton(), 'Save Button');

        helper.clickWhenClickable(templateEditorPage.getPresentationsListLink(), 'Presentations List');
        helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
        helper.clickWhenClickable(templateEditorPage.getCreatedPresentationLink(presentationName), 'Created Presentation Link');
        helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');

        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        helper.wait(templateEditorPage.getFinancialComponent(), 'Financial Component');
        expect(templateEditorPage.getFinancialComponent().isPresent()).to.eventually.be.true;
        helper.clickWhenClickable(templateEditorPage.getFinancialComponentEdit(), 'Financial Component Edit');
        expect(templateEditorPage.getAddCurrenciesButton().isEnabled()).to.eventually.be.true;
        expect(templateEditorPage.getInstrumentItems().count()).to.eventually.equal(4);
      });
    });

    after(function() {
      commonHeaderPage.deleteCurrentCompany();
    });
  });
};

module.exports = TemplateAddScenarios;
