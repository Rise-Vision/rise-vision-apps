'use strict';

var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var SlidesComponentPage = require('./../../pages/components/slidesComponentPage.js');

var SlidesComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Slides Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var slidesComponentPage;
    var componentLabel = "Google Slides - Slides with default URL";

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      slidesComponentPage = new SlidesComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Slides Component Test', 'slides-component-test');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name + ' updated';
      });
    });

    describe('basic operations', function () {
      it('should open properties of Slides Component', function () {
        templateEditorPage.selectComponent(componentLabel);
        expect(slidesComponentPage.getSrcInput().isEnabled()).to.eventually.be.true;
        expect(slidesComponentPage.getSrcInput().getAttribute('value')).to.eventually.equal("https://docs.google.com/presentation/d/e/2PACX-1vRK9noBs7XGTp-jRNkkxSR_bvTIPFq415ff2EKZIpUAOQJcYoV42XtxPGnGEd6bvjl36yZvjcn_eYDS/pub");
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
        slidesComponentPage.getDurationInput().clear();
        slidesComponentPage.getDurationInput().sendKeys("999" + protractor.Key.ENTER);

        //wait for validation to complete
        helper.waitDisappear(slidesComponentPage.getLoader(), 'Validation spinner');
      });

      it('should change the Presentation name and auto-save', function () {
        // Note: sendKeys does not trigger the "ng-change" event for the duration textbox
        // have to send a fake autoupdate to trigger it
        presentationsListPage.changePresentationName(presentationName);

        //wait for presentation to be auto-saved
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.wait(templateEditorPage.getSavingText(), 'Slides component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Slides component auto-saved');

        //load presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent(componentLabel);
        expect(slidesComponentPage.getSrcInput().isEnabled()).to.eventually.be.true;
        expect(slidesComponentPage.getSrcInput().getAttribute('value')).to.eventually.equal("https://docs.google.com/presentation/d/e/fakeSlidesId/pub");
        expect(slidesComponentPage.getDurationInput().isEnabled()).to.eventually.be.true;
        expect(slidesComponentPage.getDurationInput().getAttribute('value')).to.eventually.equal("999");
      });
    });
  });
};

module.exports = SlidesComponentScenarios;
