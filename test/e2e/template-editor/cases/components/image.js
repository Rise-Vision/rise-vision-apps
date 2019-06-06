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
        var uploadFilePath = process.cwd() + '/web/images/e2e-upload-image.png';
        imageComponentPage.getUploadInputMain().sendKeys(uploadFilePath);

        expect(imageComponentPage.getUploadPanelMain().isDisplayed()).to.eventually.be.true;
      });

      it('should hide upload panel when finished', function() {
        helper.waitDisappear(imageComponentPage.getUploadPanelMain(), 'Storage Upload Panel');
        expect(imageComponentPage.getUploadPanelMain().isDisplayed()).to.eventually.be.false;
      });

      it('should list uploaded file only, with sample files removed', function() {
        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(1);
      });

      it('should have a thumbnail', function() {
        expect(imageComponentPage.getThumbnails().count()).to.eventually.equal(1);
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

        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(1);
      });
    });

    describe('list and remove images', function () {
      it('should create a new presentation and open it', function () {
        presentationsListPage.loadCurrentCompanyPresentationList();
        presentationsListPage.createNewPresentationFromTemplate('"Example Financial Template V3"', 'example-financial-template-v3');

        templateEditorPage.selectComponent('Image - ');
        helper.wait(imageComponentPage.getListDurationComponent(), 'List Duration');
        expect(imageComponentPage.getSelectedImagesMain().count()).to.eventually.equal(4);
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

      it('should save the Presentation', function () {
        presentationsListPage.savePresentation();

        browser.sleep(100);

        expect(templateEditorPage.getSaveButton().isEnabled()).to.eventually.be.true;
      });
    });

  });
};

module.exports = ImageComponentScenarios;
