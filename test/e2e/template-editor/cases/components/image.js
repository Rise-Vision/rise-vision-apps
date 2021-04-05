'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var ImageComponentPage = require('./../../pages/components/imageComponentPage.js');
var helper = require('rv-common-e2e').helper;

var ImageComponentScenarios = function () {
  describe('Image Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var imageComponentPage;
    var componentLabel = 'Test Instance';

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      imageComponentPage = new ImageComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();
      presentationsListPage.createNewPresentationFromTemplate('Example Financial Template V4', 'example-financial-template-v4');
      templateEditorPage.dismissFinancialDataLicenseMessage();

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name;
      });
    });

    describe('basic operations', function () {
      it('should list the duration and images for the first Image Component', function () {
        templateEditorPage.selectComponent(componentLabel);
        helper.wait(imageComponentPage.getListDurationComponent(), 'List Duration');
        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(4);
      });
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

      it('should list uploaded file only, with sample files removed', function() {
        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(1);
      });

      it('should have a thumbnail', function() {
        expect(imageComponentPage.getThumbnails().count()).to.eventually.equal(1);
      });
    });

    describe('storage', function () {
      describe('basic operations', function () {
        it('should load Storage page', function () {
          helper.wait(imageComponentPage.getStorageButtonMain(), 'Storage Button Main');
          helper.clickWhenClickable(imageComponentPage.getStorageButtonMain(), 'Storage Button Main');
          browser.sleep(1000);
          helper.waitDisappear(imageComponentPage.getStorageSpinner(), 'Storage Spinner');
          expect(imageComponentPage.getStorageItems().count()).to.eventually.equal(1);
        });
      });

      describe('upload', function () {
        it('should upload a file and show the corresponding upload panel', function () {
          var uploadFilePath = process.cwd() + '/src/images/e2e-upload-image-2.png';
          imageComponentPage.getUploadInputStorage().sendKeys(uploadFilePath);

          expect(imageComponentPage.getUploadPanelStorage().isDisplayed()).to.eventually.be.true;
        });

        it('should hide upload panel when finished', function() {
          helper.waitDisappear(imageComponentPage.getUploadPanelStorage(), 'Storage Upload Panel');
          expect(imageComponentPage.getUploadPanelStorage().isDisplayed()).to.eventually.be.false;
        });

        it('should list the uploaded file', function() {
          expect(imageComponentPage.getStorageItems().count()).to.eventually.equal(2);
        });

        it('should search and filter results',function() {
          imageComponentPage.getStorageSearchInput().sendKeys('e2e-upload-image-2');
          expect(imageComponentPage.getStorageItems().count()).to.eventually.equal(1);
        });

        it('should show message when no results',function() {
          imageComponentPage.getStorageSearchInput().sendKeys('non-existing-file');
          expect(imageComponentPage.getNoSearchResultContainer().isDisplayed()).to.eventually.be.true;
          expect(imageComponentPage.getStorageItems().count()).to.eventually.equal(0);
        });

        it('should clear search',function() {
          imageComponentPage.getStorageSearchInput().clear();
          expect(imageComponentPage.getStorageItems().count()).to.eventually.equal(2);
        });

        it('should select one file and add it to Image List', function() {
          helper.clickWhenClickable(imageComponentPage.getStorageNewFile(), 'Storage New File');
          browser.sleep(500);
          helper.clickWhenClickable(imageComponentPage.getStorageAddSelected(), 'Storage Add Selected');

          helper.wait(imageComponentPage.getListDurationComponent(), 'List Duration');
          expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(2);
        });

        it('should auto-save the Presentation after adding file from storage', function () {
          //wait for presentation to be auto-saved
          templateEditorPage.waitForAutosave();
        });
      });
    });

    describe('save and validations', function () {
      it('should save the Presentation, reload it, and validate changes were saved', function () {
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent(componentLabel);

        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(2);
      });
    });

    describe('list and remove images', function () {
      it('should create a new presentation and open it', function () {
        presentationsListPage.loadCurrentCompanyPresentationList();
        presentationsListPage.createNewPresentationFromTemplate('Example Financial Template V4', 'example-financial-template-v4');
        templateEditorPage.dismissFinancialDataLicenseMessage();
      });

      it('should list the duration and images for the first Image Component', function () {
        templateEditorPage.selectComponent(componentLabel);
        helper.wait(imageComponentPage.getListDurationComponent(), 'List Duration');
        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(4);

        //wait for presentation to be auto-saved
        helper.wait(templateEditorPage.getSavedText(), 'Image component auto-saved');
      });

      it('should display image titles', function () {
        var titles = imageComponentPage.getSelectedImagesTitles();

        expect(titles.count()).to.eventually.equal(4);

        titles.each(function(title) {
          expect(title.getText()).to.eventually.match(/[\w ]+[.](jpg|png)$/);
        });
      });

      it('should display broken links', function () {
        // the test environment does not get the thumbnail for permission reasons,
        // so we just test the existence of the broken link
        var brokenLinks = imageComponentPage.getBrokenLinks();

        expect(brokenLinks.count()).to.eventually.equal(4);

        brokenLinks.each(function(brokenLink) {
          expect(brokenLink.isDisplayed()).to.eventually.be.true;
        });
      });

      it('should remove an image row', function () {
        var removeLink = imageComponentPage.getRemoveLinkFor('raptors_logo.png');

        helper.wait(removeLink, 'Image Row Remove');
        helper.clickWhenClickable(removeLink, 'Image Row Remove');

        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(3);
      });
    });

  });
};

module.exports = ImageComponentScenarios;
