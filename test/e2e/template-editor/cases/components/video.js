'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var VideoComponentPage = require('./../../pages/components/videoComponentPage.js');
var helper = require('rv-common-e2e').helper;

var VideoComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Video Component', function () {
    var testStartTime = Date.now();
    var presentationName = 'Video Component Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;
    var videoComponentPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      videoComponentPage = new VideoComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();
      presentationsListPage.createNewPresentationFromTemplate('Example Video Component', 'example-video-component');
    });

    describe('basic operations', function () {
      it('should auto-save the Presentation after it has been created', function () {
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.waitDisappear(templateEditorPage.getSavingText());
        helper.wait(templateEditorPage.getSavedText(), 'Video component auto-saved');
      });

      it('should list the volume and videos for the first Video Component', function () {
        templateEditorPage.selectComponent('Video - ');
        helper.wait(videoComponentPage.getVolumeComponent(), 'Volume');
        expect(videoComponentPage.getSelectedVideosMain().count()).to.eventually.equal(2);
      });
    });

    describe('upload', function () {
      it('should upload a file and show the corresponding upload panel', function () {
        var uploadFilePath = process.cwd() + '/web/videos/e2e-upload-video-1.mp4';
        videoComponentPage.getUploadInputMain().sendKeys(uploadFilePath);

        expect(videoComponentPage.getUploadPanelMain().isDisplayed()).to.eventually.be.true;
      });

      it('should hide upload panel when finished', function() {
        helper.waitDisappear(videoComponentPage.getUploadPanelMain(), 'Main Upload Panel');
        expect(videoComponentPage.getUploadPanelMain().isDisplayed()).to.eventually.be.false;
      });

      it('should list uploaded file only, with sample files removed', function() {
        expect(videoComponentPage.getSelectedVideosMain().count()).to.eventually.equal(1);
      });

      it('should auto-save the Presentation after updating the video list', function () {
        helper.wait(templateEditorPage.getSavingText(), 'Video component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Video component auto-saved');
      });
    });

    describe('storage', function () {
      describe('basic operations', function () {
        it('should load Storage page', function () {
          helper.wait(videoComponentPage.getStorageButtonMain(), 'Storage Button Main');
          helper.clickWhenClickable(videoComponentPage.getStorageButtonMain(), 'Storage Button Main');
          browser.sleep(1000);
          helper.waitDisappear(videoComponentPage.getStorageSpinner(), 'Storage Spinner');
          expect(videoComponentPage.getStorageItems().count()).to.eventually.equal(1);
        });
      });

      describe('upload', function () {
        it('should upload a file and show the corresponding upload panel', function () {
          var uploadFilePath = process.cwd() + '/web/videos/e2e-upload-video-2.webm';
          videoComponentPage.getUploadInputStorage().sendKeys(uploadFilePath);

          expect(videoComponentPage.getUploadPanelStorage().isDisplayed()).to.eventually.be.true;
        });

        it('should hide upload panel when finished', function() {
          helper.waitDisappear(videoComponentPage.getUploadPanelStorage(), 'Storage Upload Panel');
          expect(videoComponentPage.getUploadPanelStorage().isDisplayed()).to.eventually.be.false;
        });

        it('should list the uploaded file', function() {
          expect(videoComponentPage.getStorageItems().count()).to.eventually.equal(2);
        });

        it('should select one file and add it to Video List', function() {
          helper.clickWhenClickable(videoComponentPage.getStorageNewFile(), 'Storage New File');
          browser.sleep(500);
          helper.clickWhenClickable(videoComponentPage.getStorageAddSelected(), 'Storage Add Selected');

          helper.wait(videoComponentPage.getVolumeComponent(), 'Volume');
          expect(videoComponentPage.getSelectedVideosMain().count()).to.eventually.equal(2);
        });

        it('should auto-save the Presentation after adding file from storage', function () {
          helper.wait(templateEditorPage.getSavingText(), 'Video component auto-saving');
          helper.wait(templateEditorPage.getSavedText(), 'Video component auto-saved');
        });
      });
    });

    describe('save and validations', function () {
      it('should save the Presentation, reload it, and validate changes were saved', function () {
        presentationsListPage.changePresentationName(presentationName);

        helper.wait(templateEditorPage.getSavingText(), 'Video component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Video component auto-saved');

        //log presentation / company URL for troubleshooting
        browser.getCurrentUrl().then(function(actualUrl) {
          console.log(actualUrl);
        });
        browser.sleep(100);

        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent('Video - ');

        expect(videoComponentPage.getSelectedVideosMain().count()).to.eventually.equal(2);
      });
    });

    describe('list and remove videos', function () {
      it('should create a new presentation and open it', function () {
        presentationsListPage.loadCurrentCompanyPresentationList();
        presentationsListPage.createNewPresentationFromTemplate('Example Video Component', 'example-video-component');

        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.waitDisappear(templateEditorPage.getSavingText());
        helper.wait(templateEditorPage.getSavedText(), 'Video component auto-saved');
      });

      it('should list the volume and videos for the first Video Component', function () {
        templateEditorPage.selectComponent('Video - ');
        helper.wait(videoComponentPage.getVolumeComponent(), 'Volume');
        expect(videoComponentPage.getSelectedVideosMain().count()).to.eventually.equal(2);

        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.waitDisappear(templateEditorPage.getSavingText());
        helper.wait(templateEditorPage.getSavedText(), 'Video component auto-saved');
      });

      it('should display video titles', function () {
        var titles = videoComponentPage.getSelectedVideosTitles();

        expect(titles.count()).to.eventually.equal(2);

        titles.each(function(title) {
          expect(title.getText()).to.eventually.match(/[\w ]+[.](mp4|webm)$/);
        });
      });

      it('should display broken links', function () {
        // the test environment does not get the thumbnail for permission reasons,
        // so we just test the existence of the broken link
        var brokenLinks = videoComponentPage.getBrokenLinks();

        expect(brokenLinks.count()).to.eventually.equal(2);

        brokenLinks.each(function(brokenLink) {
          expect(brokenLink.isDisplayed()).to.eventually.be.true;
        });
      });

      it('should display volume settings', function () {
        expect(videoComponentPage.getVolumeComponent().isDisplayed()).to.eventually.be.true;

        expect(videoComponentPage.getVolumeValue().getText()).to.eventually.equal('0');
      });

      it('should update volume', function () {
        videoComponentPage.getVolumeInput().sendKeys(protractor.Key.RIGHT);

        expect(videoComponentPage.getVolumeValue().getText()).to.eventually.equal('1');
      });

      it('should auto-save the Presentation after updating volume', function () {
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.wait(templateEditorPage.getSavingText(), 'Video component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Video component auto-saved');
      });

      it('should remove a video row', function () {
        var removeLink = videoComponentPage.getRemoveLinkFor('Beach-Ball.mp4');

        helper.wait(removeLink, 'Video Row Remove');
        helper.clickWhenClickable(removeLink, 'Video Row Remove');

        expect(videoComponentPage.getSelectedVideosMain().count()).to.eventually.equal(1);
        expect(videoComponentPage.getVolumeComponent().isDisplayed()).to.eventually.be.true;
      });

      it('should auto-save the Presentation after removing a row', function () {
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.wait(templateEditorPage.getSavingText(), 'Video component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Video component auto-saved');
      });

      it('should remove another video row and hide volume', function () {
        var removeLink = videoComponentPage.getRemoveLinkFor('Under.mp4');

        helper.wait(removeLink, 'Video Row Remove');
        helper.clickWhenClickable(removeLink, 'Video Row Remove');

        expect(videoComponentPage.getSelectedVideosMain().count()).to.eventually.equal(0);
        expect(videoComponentPage.getVolumeComponent().isDisplayed()).to.eventually.be.false;
      });

      it('should auto-save the Presentation after removing another row', function () {
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.wait(templateEditorPage.getSavingText(), 'Video component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Video component auto-saved');
      });
    });

  });
};

module.exports = VideoComponentScenarios;
