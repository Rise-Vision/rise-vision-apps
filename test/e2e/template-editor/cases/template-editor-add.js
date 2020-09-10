'use strict';
var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../pages/presentationListPage.js');
var TemplateEditorPage = require('./../pages/templateEditorPage.js');
var helper = require('rv-common-e2e').helper;

var TemplateAddScenarios = function() {
  describe('Template Editor Add', function () {
    var testStartTime = Date.now();
    var presentationName = 'Example Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
    });

    describe('basic operations', function () {
      before(function() {
        presentationsListPage.loadCurrentCompanyPresentationList();
        presentationsListPage.createNewPresentationFromTemplate('Example Financial Template V4', 'example-financial-template-v4');
        templateEditorPage.dismissFinancialDataLicenseMessage();
      });

      it('should auto-save the Presentation after it has been created', function () {
        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();

        expect(templateEditorPage.getSavedText().isDisplayed()).to.eventually.be.true;
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
        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
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

    describe('remove',function(){
      before(function(){
        presentationsListPage.loadCurrentCompanyPresentationList();
        presentationsListPage.createNewPresentationFromTemplate('Example Financial Template V4', 'example-financial-template-v4');
        templateEditorPage.dismissFinancialDataLicenseMessage();
      });

      it('should delete the Presentation', function () {
        browser.sleep(500);
        helper.clickWhenClickable(templateEditorPage.getDeleteButton(), 'Template Delete Button');

        browser.sleep(500);
        helper.wait(templateEditorPage.getDeleteForeverButton(), 'Template Delete Forever Button');      
        helper.clickOverIFrame(templateEditorPage.getDeleteForeverButton());

        helper.wait(presentationsListPage.getTitle(), 'Presentation List');
      });

      it('should not show any errors', function() {
        browser.sleep(3000);

        expect(templateEditorPage.getErrorModal().isPresent()).to.eventually.be.false;
      });

    });    

  });
};

module.exports = TemplateAddScenarios;
