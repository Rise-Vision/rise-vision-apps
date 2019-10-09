'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var TextComponentPage = require('./../../pages/components/textComponentPage.js');
var helper = require('rv-common-e2e').helper;

var TextComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Text Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var textComponentPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      textComponentPage = new TextComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Text Component Test', 'text-component-test');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name + ' updated';
      });
    });

    describe('basic operations', function () {
      it('should auto-save the Presentation after it has been created', function () {
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.waitDisappear(templateEditorPage.getSavingText());
        helper.wait(templateEditorPage.getSavedText(), 'Text component auto-saved');
      });

      it('should open properties of Text Component', function () {
        templateEditorPage.selectComponent("Text - Title");

        expect(textComponentPage.getTextInput().getAttribute('value')).to.eventually.equal("Financial Literacy");
      });

      it('should update component text', function () {
        textComponentPage.getTextInput().clear();
        textComponentPage.getTextInput().sendKeys("Changed Text" + protractor.Key.ENTER);
      });

      it('should change the Presentation name and auto-save', function () {
        // Note: sendKeys does not trigger the "ng-change" event for the text textbox
        // have to send a fake autoupdate to trigger it
        presentationsListPage.changePresentationName(presentationName);

        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.wait(templateEditorPage.getSavingText(), 'Text component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Text component auto-saved');
      });

      it('should reload the Presentation, and validate changes were saved', function () {
        presentationsListPage.loadPresentation(presentationName);

        templateEditorPage.selectComponent("Text - Title");
        expect(textComponentPage.getTextInput().isEnabled()).to.eventually.be.true;
        expect(textComponentPage.getTextInput().getAttribute('value')).to.eventually.equal("Changed Text");
      });

    });
  });
};

module.exports = TextComponentScenarios;
