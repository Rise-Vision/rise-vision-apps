'use strict';

var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var SlidesComponentPage = require('./../../pages/components/slidesComponentPage.js');

var SlidesComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Slides Component', function () {
    var testStartTime = Date.now();
    var presentationName = 'Slides Component Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;
    var slidesComponentPage;
    var componentLabel = "Google Slides - Slides with default URL";

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      slidesComponentPage = new SlidesComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('"Slides Component Test"', 'slides-component-test');
    });

    describe('basic operations', function () {

      it('should open properties of Slides Component', function () {
        templateEditorPage.selectComponent(componentLabel);
        expect(slidesComponentPage.getSrcInput().isEnabled()).to.eventually.be.true;
        expect(slidesComponentPage.getSrcInput().getAttribute('value')).to.eventually.equal("");
      });

      it('should auto-save the Presentation after a duration change', function () {

        //change duration
        expect(slidesComponentPage.getDurationInput().isEnabled()).to.eventually.be.true;
        slidesComponentPage.getDurationInput().clear();
        slidesComponentPage.getDurationInput().sendKeys("999" + protractor.Key.ENTER);

        //save presentation
        helper.wait(templateEditorPage.getSavingText(), 'Slides component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Slides component auto-saved');
      });

      it('should auto-save the Presentation after a src change', function () {

        //change slides URL
        expect(slidesComponentPage.getSrcInput().isEnabled()).to.eventually.be.true;
        slidesComponentPage.getSrcInput().clear();
        slidesComponentPage.getSrcInput().sendKeys("randomSlideId" + protractor.Key.ENTER);

        //save presentation
        helper.wait(templateEditorPage.getSavingText(), 'Slides component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Slides component auto-saved');
      });

      it('should show validation error', function () {

        //change slides URL
        expect(slidesComponentPage.getSrcInput().isEnabled()).to.eventually.be.true;
        slidesComponentPage.getSrcInput().clear();
        slidesComponentPage.getSrcInput().sendKeys("randomSlideId2" + protractor.Key.ENTER);

        //wait for validation to complete
        helper.waitDisappear(slidesComponentPage.getLoader(), 'Validation spinner');

        //verify validation error and icon is visible
        expect(slidesComponentPage.getValidationError().isDisplayed()).to.eventually.be.true;
        expect(slidesComponentPage.getValidationIconError().isDisplayed()).to.eventually.be.true;

        //verify validation success icon is not visible
        expect(slidesComponentPage.getValidationIconValid().isPresent()).to.eventually.be.false;
      });

      it('should not show validation error', function () {

        //change slides URL
        expect(slidesComponentPage.getSrcInput().isEnabled()).to.eventually.be.true;
        slidesComponentPage.getSrcInput().clear();
        slidesComponentPage.getSrcInput().sendKeys("" + protractor.Key.ENTER);

        //wait for validation to complete
        helper.waitDisappear(slidesComponentPage.getLoader(), 'Validation spinner');

        //verify validation error and icon is not visible
        expect(slidesComponentPage.getValidationError().isPresent()).to.eventually.be.false;
        expect(slidesComponentPage.getValidationIconError().isPresent()).to.eventually.be.false;

        //verify validation success icon is visible
        expect(slidesComponentPage.getValidationIconValid().isDisplayed()).to.eventually.be.true;
      });

      it('should save the Presentation, reload it, and validate changes were saved', function () {

        //change slides
        expect(slidesComponentPage.getSrcInput().isEnabled()).to.eventually.be.true;
        slidesComponentPage.getSrcInput().clear();
        slidesComponentPage.getSrcInput().sendKeys("https://docs.google.com/presentation/d/e/fakeSlidesId/pub" + protractor.Key.ENTER);

        //wait for validation to complete
        helper.waitDisappear(slidesComponentPage.getLoader(), 'Validation spinner');

        //change presentation name
        presentationsListPage.changePresentationName(presentationName);

        //wait for presentation to be auto-saved
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.wait(templateEditorPage.getSavingText(), 'Text component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Text component auto-saved');

        //log URL for troubeshooting 
        browser.getCurrentUrl().then(function(actualUrl) {
          console.log(actualUrl);
        });
        browser.sleep(100);

        //load presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent(componentLabel);
        expect(slidesComponentPage.getSrcInput().isEnabled()).to.eventually.be.true;
        expect(slidesComponentPage.getSrcInput().getAttribute('value')).to.eventually.equal("https://docs.google.com/presentation/d/e/fakeSlidesId/pub");
      });
    });
  });
};

module.exports = SlidesComponentScenarios;
