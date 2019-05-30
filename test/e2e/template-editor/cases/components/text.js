'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var TextComponentPage = require('./../../pages/components/textComponentPage.js');

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

      it('should save the Presentation, reload it, and validate changes were saved', function () {

        //change text
        expect(textComponentPage.getTextInput().isEnabled()).to.eventually.be.true;
        textComponentPage.getTextInput().clear();
        textComponentPage.getTextInput().sendKeys("Changed Text" + protractor.Key.ENTER);
    
        //save presentation
        presentationsListPage.changePresentationName(presentationName);
        presentationsListPage.savePresentation();
        expect(templateEditorPage.getSaveButton().isEnabled()).to.eventually.be.true;

        //log URL for troubeshooting 
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
