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

      it('should publish the Presentation', function () {
        helper.clickWhenClickable(templateEditorPage.getPublishButton(), 'Publish Button');

        helper.wait(templateEditorPage.getSavingText(), 'Component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Component auto-saved');
      });

      it('should load the newly created Presentation', function () {
        presentationsListPage.loadPresentation(presentationName);

        expect(templateEditorPage.getComponentItems().count()).to.eventually.be.above(1);
        expect(templateEditorPage.getImageComponentEdit().isPresent()).to.eventually.be.true;
      });

      describe('remove',function(){
        before(function(){
          //workaround as protactor can't click on top of iframes
          //decrease window size to hide template preview        
          browser.driver.manage().window().setSize(500, 800); 
        });

        it('should delete the Presentation', function () {
          browser.sleep(500);
          helper.clickWhenClickable(templateEditorPage.getDeleteButton(), 'Template Delete Button');

          browser.sleep(500);
          helper.wait(templateEditorPage.getDeleteForeverButton(), 'Template Delete Forever Button');      
          helper.clickWhenClickable(templateEditorPage.getDeleteForeverButton(), 'Template Delete Forever Button');

          helper.wait(presentationsListPage.getTitle(), 'Presentation List');
        });

        it('should not show any errors', function() {
          browser.sleep(3000);

          expect(templateEditorPage.getErrorModal().isPresent()).to.eventually.be.false;
        });

        after(function(){
          //revert workaround
          browser.driver.manage().window().setSize(1920, 1080); 
        });
      });    

    });
  });
};

module.exports = TemplateAddScenarios;
