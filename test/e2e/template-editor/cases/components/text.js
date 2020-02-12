'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var TextComponentPage = require('./../../pages/components/textComponentPage.js');
var helper = require('rv-common-e2e').helper;

var TextComponentScenarios = function () {

  describe('Text Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var textComponentPage;
    var componentLabel = "Title";

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      textComponentPage = new TextComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Text Component Test', 'text-component-test');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name;
      });
    });

    describe('basic operations', function () {
      it('should open properties of Text Component', function () {
        templateEditorPage.selectComponent(componentLabel);

        expect(textComponentPage.getTextInput().getAttribute('value')).to.eventually.equal("Financial Literacy");
      });

      it('should clear and update the component text', function () {
        // Note: Disconnect from Angular to prevent Autosave timeout from interrupting edits
        browser.waitForAngularEnabled(false);
        textComponentPage.getTextInput().clear();
        textComponentPage.getTextInput().sendKeys("Changed Text" + protractor.Key.ENTER);
        browser.waitForAngularEnabled(true);

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should reload the Presentation, and validate changes were saved', function () {
        presentationsListPage.loadPresentation(presentationName);

        templateEditorPage.selectComponent(componentLabel);
        expect(textComponentPage.getTextInput().isEnabled()).to.eventually.be.true;
        expect(textComponentPage.getTextInput().getAttribute('value')).to.eventually.equal("Changed Text");
      });

    });
  });
};

module.exports = TextComponentScenarios;
