'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var BrandingComponentPage = require('./../../pages/components/brandingComponentPage.js');
var ImageComponentPage = require('./../../pages/components/imageComponentPage.js');
var helper = require('rv-common-e2e').helper;

var BrandingComponentScenarios = function () {
  describe('Branding Component', function () {
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

      it('should list Branding Settings link', function () {
        expect(templateEditorPage.getBrandingContainer().isDisplayed()).to.eventually.be.true;
        expect(templateEditorPage.getBrandingEditLink().isDisplayed()).to.eventually.be.true;
      });

      it('should open Branding Settings', function () {
        helper.clickWhenClickable(templateEditorPage.getBrandingEditLink(),'Edit Branding Link');
        browser.sleep(1000);

        expect(brandingComponentPage.getBrandingPanel().isDisplayed()).to.eventually.be.true;        
      });

      it('should list Edit Logo and Colors links', function () {
        expect(brandingComponentPage.getEditLogoLink().isDisplayed()).to.eventually.be.true;
        expect(brandingComponentPage.getEditColorsLink().isDisplayed()).to.eventually.be.true;
      });

    });

    describe('Edit Colors', function(){
      it('should open Colors panel', function() {
        helper.clickWhenClickable(brandingComponentPage.getEditColorsLink(),'Edit Colors Link')
        browser.sleep(1000);

        expect(brandingComponentPage.getColorsPanel().isDisplayed()).to.eventually.be.true;
        expect(brandingComponentPage.getBaseColorInput().isDisplayed()).to.eventually.be.true;
        expect(brandingComponentPage.getAccentColorInput().isDisplayed()).to.eventually.be.true;

        expect(brandingComponentPage.getBaseColorInput().isEnabled()).to.eventually.be.true;
        expect(brandingComponentPage.getAccentColorInput().isEnabled()).to.eventually.be.true;
      });

      it('should set colors', function() {
        brandingComponentPage.getBaseColorInput().sendKeys("red");
        brandingComponentPage.getAccentColorInput().sendKeys("yellow");

        expect(brandingComponentPage.getBaseColorInput().getAttribute('value')).to.eventually.equal("red");
        expect(brandingComponentPage.getAccentColorInput().getAttribute('value')).to.eventually.equal("yellow");

        //return to branding
        helper.clickWhenClickable(templateEditorPage.getBackToComponentsButton(),'Back to Branding Settings');
        browser.sleep(1000);
      });

      it('should persist colors', function() {
        helper.clickWhenClickable(brandingComponentPage.getEditColorsLink(),'Edit Colors Link')
        browser.sleep(1000);

        helper.wait(brandingComponentPage.getColorsPanel(), 'Colors Settings');
        expect(brandingComponentPage.getColorsPanel().isDisplayed()).to.eventually.be.true;
        expect(brandingComponentPage.getBaseColorInput().isDisplayed()).to.eventually.be.true;
        expect(brandingComponentPage.getAccentColorInput().isDisplayed()).to.eventually.be.true;

        expect(brandingComponentPage.getBaseColorInput().getAttribute('value')).to.eventually.equal("red");
        expect(brandingComponentPage.getAccentColorInput().getAttribute('value')).to.eventually.equal("yellow");

        // return to branding
        helper.clickWhenClickable(templateEditorPage.getBackToComponentsButton(),'Back to Branding Settings');
        browser.sleep(1000);
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
          var uploadFilePath = process.cwd() + '/src/images/e2e-upload-image-1.png';
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
          var uploadFilePath = process.cwd() + '/src/images/e2e-upload-image-2.png';
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

      describe('storage',function(){
        it('should load Storage page', function () {
          helper.waitDisappear(imageComponentPage.getImageFileLoader(), 'Image File Loader');

          helper.wait(imageComponentPage.getStorageButtonMain(), 'Storage Button Main');
          helper.clickWhenClickable(imageComponentPage.getStorageButtonMain(), 'Storage Button Main');
          browser.sleep(1000);
          helper.waitDisappear(imageComponentPage.getStorageSpinner(), 'Storage Spinner');
          expect(imageComponentPage.getStorageItems().count()).to.eventually.above(0);
        });

        it('should select a file as logo', function() {
          helper.clickWhenClickable(imageComponentPage.getStorageNewFile(), 'Storage New File');
          browser.sleep(500);
          helper.clickWhenClickable(imageComponentPage.getStorageAddSelected(), 'Storage Add Selected');
          browser.sleep(1000);
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

      it('should asks for confirmation before removing logo', function () {
        var removeLink = imageComponentPage.getRemoveLinkFor('e2e-upload-image-2.png');
        helper.wait(removeLink, 'Image Row Remove');
        helper.clickWhenClickable(removeLink, 'Image Row Remove');

        helper.wait(brandingComponentPage.getLogoRemovalConfirmationModal(),'Confirm Logo Removal');
        expect(brandingComponentPage.getLogoRemovalConfirmationModal().isDisplayed()).to.eventually.be.true;
      });

      it('should remove logo',function() {
        helper.clickWhenClickable(brandingComponentPage.getConfirmButton(),'Confirm Logo Removal');
        browser.sleep(1000);
        
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

module.exports = BrandingComponentScenarios;
