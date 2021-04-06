'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var HtmlComponentPage = require('./../../pages/components/htmlComponentPage.js');
var helper = require('rv-common-e2e').helper;

var HtmlComponentScenarios = function () {

  describe('Html Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var htmlComponentPage;
    var componentLabel = "HTML Component 1";

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      htmlComponentPage = new HtmlComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Example html component', 'example-html-component');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name;
      });
    });

    describe('basic operations', function () {
      it('should open properties of Html Component', function () {
        templateEditorPage.selectComponent(componentLabel);

        expect(htmlComponentPage.getTextArea().getAttribute('value')).to.eventually.contain("Hello World");
      });

      it('should clear and update the component html', function () {
        // Note: Disconnect from Angular to prevent Autosave timeout from interrupting edits
        browser.waitForAngularEnabled(false);
        helper.wait(htmlComponentPage.getTextArea(), 'Text component Text Area');
        browser.sleep(500);
        htmlComponentPage.getTextArea().clear();
        browser.sleep(500);
        htmlComponentPage.getTextArea().sendKeys("Changed Text");
        browser.waitForAngularEnabled(true);

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should reload the Presentation, and validate changes were saved', function () {
        presentationsListPage.loadPresentation(presentationName);

        templateEditorPage.selectComponent(componentLabel);
        expect(htmlComponentPage.getTextArea().isEnabled()).to.eventually.be.true;
        expect(htmlComponentPage.getTextArea().getAttribute('value')).to.eventually.equal("Changed Text");
      });

    });
  });
};

module.exports = HtmlComponentScenarios;
