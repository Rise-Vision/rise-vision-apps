'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var BrandingComponentPage = require('./../../pages/components/brandingComponentPage.js');
var ImageComponentPage = require('./../../pages/components/imageComponentPage.js');
var helper = require('rv-common-e2e').helper;

var WeatherComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Branding Component', function () {
    var testStartTime = Date.now();
    var presentationName = 'Branding Component Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;
    var brandingComponentPage;
    var imageComponentPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      brandingComponentPage = new BrandingComponentPage();
      imageComponentPage = new ImageComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Example Branding Template', 'example-branding-template');
    });

    describe('Branding list', function () {

      it('should auto-save the Presentation after it has been created', function () {
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.waitDisappear(templateEditorPage.getSavingText());
        helper.wait(templateEditorPage.getSavedText(), 'Branding Template auto-saved');
      });

      it('should list Branding Settings link', function () {
        expect(templateEditorPage.getBrandingContainer().isDisplayed()).to.eventually.be.true;
        expect(templateEditorPage.getBrandingEditLink().isDisplayed()).to.eventually.be.true;
      });

      it('should open Branding Settings', function () {
        helper.clickWhenClickable(templateEditorPage.getBrandingEditLink(),'Edit Branding Link');
        browser.sleep(1000);

        expect(brandingComponentPage.getBrandingPanel().isDisplayed()).to.eventually.be.true;        
      });

      it('should liat Edit Logo and Colors links', function () {
        expect(brandingComponentPage.getEditLogoLink().isDisplayed()).to.eventually.be.true;
        expect(brandingComponentPage.getEditColorsLink().isDisplayed()).to.eventually.be.true;
      });

    });

    describe('Edit Branding Logo',function(){
      it('should edit logo and have logo by default',function() {
        helper.clickWhenClickable(brandingComponentPage.getEditLogoLink(),'Edit Logo Link')
        browser.sleep(1000);

        expect(imageComponentPage.getEmptyListContainer().isDisplayed()).to.eventually.be.true;
      });

      describe('upload', function () {
        it('should upload a file and show the corresponding upload panel', function () {
          var uploadFilePath = process.cwd() + '/web/images/e2e-upload-image-1.png';
          imageComponentPage.getUploadInputMain().sendKeys(uploadFilePath);

          expect(imageComponentPage.getUploadPanelMain().isDisplayed()).to.eventually.be.true;
        });

        it('should hide upload panel when finished', function() {
          helper.waitDisappear(imageComponentPage.getUploadPanelMain(), 'Main Upload Panel');
          expect(imageComponentPage.getUploadPanelMain().isDisplayed()).to.eventually.be.false;
        });

        it('should list uploaded file', function() {
          expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(1);
        });

        it('should have a thumbnail', function() {
          expect(imageComponentPage.getThumbnails().count()).to.eventually.equal(1);
        });
      });

      describe('subsequent upload - should list a single file', function () {
        it('should upload a file and show the corresponding upload panel', function () {
          var uploadFilePath = process.cwd() + '/web/images/e2e-upload-image-2.png';
          imageComponentPage.getUploadInputMain().sendKeys(uploadFilePath);

          expect(imageComponentPage.getUploadPanelMain().isDisplayed()).to.eventually.be.true;
        });

        it('should hide upload panel when finished', function() {
          helper.waitDisappear(imageComponentPage.getUploadPanelMain(), 'Main Upload Panel');
          expect(imageComponentPage.getUploadPanelMain().isDisplayed()).to.eventually.be.false;
        });

        it('should list only the uploaded file', function() {
          expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(1);
        });
      });
    });

    describe('remove',function(){
      before(function(){
        //workaround as protactor can't click on top of iframes
        //decrease window size to hide template preview        
        browser.driver.manage().window().setSize(500, 800); 
      });

      it('should aks for confirmation before removing logo', function () {
        var removeLink = imageComponentPage.getRemoveLinkFor('e2e-upload-image-2.png');
        helper.wait(removeLink, 'Image Row Remove');
        helper.clickWhenClickable(removeLink, 'Image Row Remove');
        browser.sleep(5000);

        helper.wait(brandingComponentPage.getLogoRemovalConfirmationModal(),'Confirm Logo Removal');
        expect(brandingComponentPage.getLogoRemovalConfirmationModal().isDisplayed()).to.eventually.be.true;
      });

      it('should remove logo',function() {
        helper.clickWhenClickable(brandingComponentPage.getConfirmButton(),'Confirm Logo Removal');
        helper.wait(imageComponentPage.getEmptyListContainer(),'Empt Image List');
        expect(imageComponentPage.getEmptyListContainer().isDisplayed()).to.eventually.be.true;
      });

      after(function(){
        //revert workaround
        browser.driver.manage().window().setSize(1920, 1080); 
      });
    });    

  });
};

module.exports = WeatherComponentScenarios;
