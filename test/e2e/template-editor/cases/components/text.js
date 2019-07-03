'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var TextComponentPage = require('./../../pages/components/textComponentPage.js');
var AutoScheduleModalPage = require('./../../../schedules/pages/autoScheduleModalPage.js');
var helper = require('rv-common-e2e').helper;

var TextComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Text Component', function () {
    var testStartTime = Date.now();
    var presentationName = 'Text Component Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;
    var textComponentPage;
    var autoScheduleModalPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      textComponentPage = new TextComponentPage();
      autoScheduleModalPage = new AutoScheduleModalPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('"Text Component Test"', 'text-component-test');
    });

    describe('basic operations', function () {

      it('should auto-save the Presentation after it has been created', function () {
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.waitDisappear(templateEditorPage.getSavingText());
        helper.wait(templateEditorPage.getSavedText(), 'Text component auto-saved');
      });

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
      });

      it('should auto create Schedule when publishing Presentation', function () {
        helper.clickWhenClickable(templateEditorPage.getPublishButton(), 'Publish Button');

        browser.sleep(500);

        helper.wait(autoScheduleModalPage.getAutoScheduleModal(), 'Auto Schedule Modal');

        expect(autoScheduleModalPage.getAutoScheduleModal().isDisplayed()).to.eventually.be.true;

        helper.clickWhenClickable(autoScheduleModalPage.getCloseButton(), 'Auto Schedule Modal - Close Button');

        helper.waitDisappear(autoScheduleModalPage.getAutoScheduleModal(), 'Auto Schedule Modal');
        helper.waitDisappear(presentationsListPage.getTemplateEditorLoader());
      });

      it('should auto-save the Presentation, reload it, and validate changes were saved', function () {

        //change presentation name
        presentationsListPage.changePresentationName(presentationName);

        //wait for presentation to be auto-saved
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.wait(templateEditorPage.getSavingText(), 'Text component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Text component auto-saved');

        //log URL for troubleshooting
        browser.getCurrentUrl().then(function(actualUrl) {
          console.log(actualUrl);
        });
        browser.sleep(100);

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
