'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var ImageComponentPage = require('./../../pages/components/imageComponentPage.js');
var helper = require('rv-common-e2e').helper;

var ImageComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Image Component', function () {
    var testStartTime = Date.now();
    var presentationName = 'Image Component Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;
    var imageComponentPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      imageComponentPage = new ImageComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();
      presentationsListPage.createNewPresentationFromTemplate('"Example Financial Template V3"', 'example-financial-template-v3');
    });

    describe('basic operations', function () {
      it('should select the first Image Component', function () {
        templateEditorPage.selectComponent('Image - ');
        helper.wait(imageComponentPage.getListDurationComponent(), 'List Duration');
        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(4);
      });
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

      it('should list uploaded file only, with sample files removed', function() {
        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(1);
      });
    });

    describe('storage', function () {
      describe('basic operations', function () {
        it('should load Storage page', function () {
          helper.wait(imageComponentPage.getStorageButtonMain(), 'Storage Button Main');
          helper.clickWhenClickable(imageComponentPage.getStorageButtonMain(), 'Storage Button Main');
          browser.sleep(500);
          helper.waitDisappear(imageComponentPage.getStorageSpinner(), 'Storage Spinner');
          expect(imageComponentPage.getStorageItems().count()).to.eventually.equal(1);
        });
      });

      describe('upload', function () {
        it('should upload a file and show the corresponding upload panel', function () {
          var uploadFilePath = process.cwd() + '/web/images/e2e-upload-image-2.png';
          imageComponentPage.getUploadInputStorage().sendKeys(uploadFilePath);

          expect(imageComponentPage.getUploadPanelStorage().isDisplayed()).to.eventually.be.true;
        });

        it('should hide upload panel when finished', function() {
          helper.waitDisappear(imageComponentPage.getUploadPanelStorage(), 'Storage Upload Panel');
          expect(imageComponentPage.getUploadPanelStorage().isDisplayed()).to.eventually.be.false;
        });

        it('should list uploaded file only, with sample files removed', function() {
          expect(imageComponentPage.getStorageItems().count()).to.eventually.equal(2);
        });

        it('should select one file and add it to Image List', function() {
          helper.clickWhenClickable(imageComponentPage.getStorageNewFile(), 'Storage New File');
          browser.sleep(500);
          helper.clickWhenClickable(imageComponentPage.getStorageAddSelected(), 'Storage Add Selected');

          helper.wait(imageComponentPage.getListDurationComponent(), 'List Duration');
          expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(2);
        });
      });
    });

    describe('save and validations', function () {
      it('should save the Presentation, reload it, and validate changes were saved', function () {
        presentationsListPage.changePresentationName(presentationName);
        presentationsListPage.savePresentation();

        //log presentation / company URL for troubleshooting
        browser.getCurrentUrl().then(function(actualUrl) {
          console.log(actualUrl);
        });
        browser.sleep(100);

        expect(templateEditorPage.getSaveButton().isEnabled()).to.eventually.be.true;

        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent('Image - ');

        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(2);
      });
    });
  });
};

module.exports = ImageComponentScenarios;
