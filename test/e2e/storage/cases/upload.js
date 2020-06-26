'use strict';
var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var StorageSelectorModalPage = require('./../pages/storageSelectorModalPage.js');
var FilesListPage = require('./../pages/filesListPage.js');
var StorageHelper = require('./../pages/helper.js');

var UploadScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Upload', function () {  
    var storageSelectorModalPage = new StorageSelectorModalPage();
    var filesListPage = new FilesListPage();
    var uploadFilePath;
  
    var describeUpload = function () {

      it('should show upload button', function() {
        expect(storageSelectorModalPage.getUploadButton().isDisplayed()).to.eventually.be.true;
        expect(storageSelectorModalPage.getUploadFolderButton().isDisplayed()).to.eventually.be.true;
      });

      it('should upload file', function(){
        uploadFilePath = uploadFilePath || (process.cwd() + '/package.json');
        storageSelectorModalPage.getUploadInput().sendKeys(uploadFilePath);

        expect(storageSelectorModalPage.getUploadPanel().isDisplayed()).to.eventually.be.true;
      });

      it('should ask for confirmation before overwriting files',function(){
        helper.wait(storageSelectorModalPage.getOverwriteConfirmationModal(),'Overwrite Confirmation');

        expect(storageSelectorModalPage.getOverwriteConfirmationModal().isDisplayed()).to.eventually.be.true;

        helper.clickWhenClickable(storageSelectorModalPage.getOverwriteFilesButton(),'Keep Files button');
        helper.waitDisappear(storageSelectorModalPage.getOverwriteConfirmationModal(), 'Overwrite Confirmation');
      });

      it('should hide Upload panel when finished',function(){
        this.timeout(55000);
        helper.waitDisappear(storageSelectorModalPage.getUploadPanel(), 'Storage Upload Panel');
        expect(storageSelectorModalPage.getUploadPanel().isDisplayed()).to.eventually.be.false;
      });

      it('should list uploaded file',function(){
        filesListPage.filterFileList('package.json');
        expect(filesListPage.getFileItems().count()).to.eventually.be.at.least(1);
      });
    };

    describe('And he is using Iframe Single File Selector:',function(){
      before(function () { StorageHelper.setupIframeSingleFileSelector(); });
      describe('Upload File:', describeUpload);
    });

    describe('And he is using Storage Home:',function(){
      before(function () { StorageHelper.setupStorageHome(); });
      describe('Upload File:', describeUpload);
    });

    describe('And he is using Apps Single File Selector:',function(){
      before(function () { StorageHelper.setupAppsSingleFileSelector(); });
      describe('Upload File:', describeUpload);
    });
    
    describe('And he is using Storage Home with encoding enabled:',function(){
      var intervalHandle;

      before(function () {
        intervalHandle = storageSelectorModalPage.clickRetryOnFailure();
        StorageHelper.setupStorageHomeWithEncoding();
        uploadFilePath = process.cwd() + '/web/videos/e2e-upload-video-1.mp4';
      });

      after(function () {
        uploadFilePath = null;
        clearInterval(intervalHandle);
      });

      describe('Upload File:', describeUpload);
    });
  });
};
module.exports = UploadScenarios;
