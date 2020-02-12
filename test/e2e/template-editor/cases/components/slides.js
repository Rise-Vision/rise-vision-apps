'use strict';

var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var SlidesComponentPage = require('./../../pages/components/slidesComponentPage.js');

var SlidesComponentScenarios = function () {
  describe('Slides Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var slidesComponentPage;
    var componentLabel = "Slides with default URL";

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      slidesComponentPage = new SlidesComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Slides Component Test', 'slides-component-test');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name;
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

      it('should update slides URL', function () {
        //change slides
        expect(slidesComponentPage.getSrcInput().isEnabled()).to.eventually.be.true;
        slidesComponentPage.getSrcInput().clear();
        slidesComponentPage.getSrcInput().sendKeys("https://docs.google.com/presentation/d/e/fakeSlidesId/pub" + protractor.Key.ENTER);

        //wait for validation to complete
        helper.waitDisappear(slidesComponentPage.getLoader(), 'Validation spinner');

        //wait for presentation to be auto-saved
        helper.wait(templateEditorPage.getSavedText(), 'RSS component auto-saved');
      });

      it('should clear and update the duration text', function () {
        // Note: Disconnect from Angular to prevent Autosave timeout from interrupting edits
        browser.waitForAngularEnabled(false);
        slidesComponentPage.getDurationInput().clear();
        slidesComponentPage.getDurationInput().sendKeys("999" + protractor.Key.ENTER);
        browser.waitForAngularEnabled(true);

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should reload the Presentation, and validate changes were saved', function () {
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
