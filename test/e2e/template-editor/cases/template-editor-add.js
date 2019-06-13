'use strict';
var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../pages/presentationListPage.js');
var TemplateEditorPage = require('./../pages/templateEditorPage.js');
var AutoScheduleModalPage = require('./../../schedules/pages/autoScheduleModalPage.js');
var helper = require('rv-common-e2e').helper;

var TemplateAddScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Template Editor Add', function () {
    var testStartTime = Date.now();
    var presentationName = 'Example Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;
    var autoScheduleModalPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      autoScheduleModalPage = new AutoScheduleModalPage();

      presentationsListPage.createNewPresentationFromTemplate('"Example Financial Template V3"', 'example-financial-template-v3');
      templateEditorPage.dismissFinancialDataLicenseMessage();
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

      it('should auto create Schedule when saving Presentation', function () {
        browser.sleep(500);

        helper.wait(autoScheduleModalPage.getAutoScheduleModal(), 'Auto Schedule Modal');

        expect(autoScheduleModalPage.getAutoScheduleModal().isDisplayed()).to.eventually.be.true;

        helper.clickWhenClickable(autoScheduleModalPage.getCloseButton(), 'Auto Schedule Modal - Close Button');

        helper.waitDisappear(autoScheduleModalPage.getAutoScheduleModal(), 'Auto Schedule Modal');
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
    });
  });
};

module.exports = TemplateAddScenarios;
