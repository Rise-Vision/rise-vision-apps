'use strict';
var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../pages/presentationListPage.js');
var TemplateEditorPage = require('./../pages/templateEditorPage.js');
var helper = require('rv-common-e2e').helper;

var TemplateAddScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Template Editor Add', function () {
    var testStartTime = Date.now();
    var presentationName = 'Example Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      presentationsListPage.createNewPresentationFromTemplate("Example Financial Template", "example-financial-template");
    });

    describe('basic operations', function () {
      it('should show more than one component', function () {
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
      });

      it('should edit the Presentation name', function () {
        presentationsListPage.changePresentationName(presentationName);
        expect(templateEditorPage.getPresentationName().getAttribute('value')).to.eventually.equal(presentationName);
      });

      it('should save the Presentation', function () {
        presentationsListPage.savePresentation();

        expect(templateEditorPage.getSaveButton().isEnabled()).to.eventually.be.true;
      });

      it('should publish the Presentation', function () {
        // Since the first time a Presentation is saved it's also Published, to test the button an additional Save is needed
        presentationsListPage.savePresentation();
        presentationsListPage.savePresentation();

        helper.clickWhenClickable(templateEditorPage.getPublishButton(), 'Publish Button');
        helper.wait(templateEditorPage.getSaveButton(), 'Save Button (after Publish)');
        expect(templateEditorPage.getSaveButton().isEnabled()).to.eventually.be.true;
      });

      it('should load the newly created Presentation', function () {
        presentationsListPage.loadPresentation(presentationName);

        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
        expect(templateEditorPage.getImageComponentEdit().isPresent()).to.eventually.be.true;
      });

      // image component now has some extra behaviros, this test will be fixed later as part of the e2e task
      xit('should navigate into the Image component and back to the Components list', function () {
        helper.wait(templateEditorPage.getImageComponentEdit(), 'Image Component');
        helper.clickWhenClickable(templateEditorPage.getImageComponentEdit(), 'Image Component Edit');
        helper.wait(templateEditorPage.getBackToComponentsButton(), 'Back to Components Button');
        helper.clickWhenClickable(templateEditorPage.getBackToComponentsButton(), 'Back to Components Button');
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        browser.sleep(500); // Wait for transition to finish
        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
      });
    });
  });
};

module.exports = TemplateAddScenarios;
