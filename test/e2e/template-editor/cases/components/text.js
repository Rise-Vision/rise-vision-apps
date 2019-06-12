'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var TextComponentPage = require('./../../pages/components/textComponentPage.js');
var helper = require('rv-common-e2e').helper;

var TextComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Text Component', function () {
    var testStartTime = Date.now();
    var presentationName = 'Text Component Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;
    var textComponentPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      textComponentPage = new TextComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('"Text Component Test"', 'text-component-test');
    });

    describe('basic operations', function () {

      it('should open properties of Text Component', function () {
        templateEditorPage.selectComponent("Text - Title");
        expect(textComponentPage.getTextInput().isEnabled()).to.eventually.be.true;
        expect(textComponentPage.getTextInput().getAttribute('value')).to.eventually.equal("Financial Literacy");
      });

      it('should auto-save the Presentation after a text change', function () {

        //change text
        expect(textComponentPage.getTextInput().isEnabled()).to.eventually.be.true;
        textComponentPage.getTextInput().clear();
        textComponentPage.getTextInput().sendKeys("Changed Text" + protractor.Key.ENTER);

        //save presentation
        helper.wait(templateEditorPage.getSavingText(), 'Text component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Text component auto-saved');

        //wait for lagging auto-saves
        browser.sleep(10000);
        helper.wait(templateEditorPage.getSavedText(), 'Text component auto-saved');
      });

      it('should auto-save the Presentation, reload it, and validate changes were saved', function () {

        //change presentation name
        browser.sleep(1000);
        presentationsListPage.changePresentationName(presentationName);

        //save presentation
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.wait(templateEditorPage.getSavingText(), 'Text component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Text component auto-saved');
        browser.sleep(1000);

        //log URL for troubeshooting
        browser.getCurrentUrl().then(function(actualUrl) {
          console.log(actualUrl);
        });

        //load presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent("Text - Title");
        expect(textComponentPage.getTextInput().isEnabled()).to.eventually.be.true;
        expect(textComponentPage.getTextInput().getAttribute('value')).to.eventually.equal("Changed Text");
      });
    });
  });
};

module.exports = TextComponentScenarios;
