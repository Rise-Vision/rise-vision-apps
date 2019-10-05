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

      presentationsListPage.loadCurrentCompanyPresentationList();
      presentationsListPage.createNewPresentationFromTemplate('Example Financial Template V4', 'example-financial-template-v4');
      templateEditorPage.dismissFinancialDataLicenseMessage();
    });

    describe('basic operations', function () {
      it('should auto-save the Presentation after it has been created', function () {
        browser.sleep(3000);
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.waitDisappear(templateEditorPage.getSavingText());
        helper.wait(templateEditorPage.getSavedText(), 'Component auto-saved');
      });

      it('should set presentation name', function(done) {
        templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
          expect(name).to.contain('Copy of');

          done();
        });
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

      it('should show more than one component', function () {
        helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
      });

      it('should edit the Presentation name', function () {
        presentationsListPage.changePresentationName(presentationName);
        expect(templateEditorPage.getPresentationName().getAttribute('value')).to.eventually.equal(presentationName);
      });

      it('should auto-save the Presentation after the name has changed', function () {
        helper.wait(templateEditorPage.getSavingText(), 'Component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Component auto-saved');
      });

      it('should load the newly created Presentation', function () {
        presentationsListPage.loadPresentation(presentationName);

        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
        expect(templateEditorPage.getImageComponentEdit().isPresent()).to.eventually.be.true;
      });

      it('should not have auto-published the Presentation when navigating', function () {
        // prevents reoccurrence of issue 1186
        expect(templateEditorPage.getPublishButton().isEnabled()).to.eventually.be.true;
      });

    });
  });
};

module.exports = TemplateAddScenarios;
