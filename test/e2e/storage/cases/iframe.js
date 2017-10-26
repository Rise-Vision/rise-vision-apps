'use strict';
var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var StorageSelectorModalPage = require('./../pages/storageSelectorModalPage.js');
var StorageHelper = require('./../pages/helper.js');
var FilesListPage = require('./../pages/filesListPage.js');

var IframeScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('IFrame', function () {
    var storageSelectorModalPage = new StorageSelectorModalPage();
    var filesListPage = new FilesListPage();

    describe('And he is using Iframe Single File Selector:',function(){
      
      before(function () { StorageHelper.setupIframeSingleFileSelector(); });

      describe('Show Iframe:', function () {

        it('should load Storage Single File Selector', function () {
          expect(storageSelectorModalPage.getStorageSelectorModal().isDisplayed()).to.eventually.be.true;
          expect(storageSelectorModalPage.getCloseButton().isDisplayed()).to.eventually.be.true;
          expect(storageSelectorModalPage.getModalTitle().getText()).to.eventually.equal('Select a File');
        });

        it('should list files',function(){
          helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
          expect(filesListPage.getFilesGrid().isDisplayed()).to.eventually.be.true;
          filesListPage.getGridViewSelector().click();
          expect(filesListPage.getFilesListTable().isDisplayed()).to.eventually.be.true;
        });

        it('should filter files',function(){
          filesListPage.filterFileList('package.json');
          expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);
        });
      });
    });

    describe('And he is using Iframe Single Folder Selector:',function(){

      before(function () { StorageHelper.setupIframeSingleFolderSelector(); });

      describe('Show Iframe:', function(){

        it('should load Storage Single Folder Selector', function () {
          helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');

          expect(storageSelectorModalPage.getStorageSelectorModal().isDisplayed()).to.eventually.be.true;
          expect(storageSelectorModalPage.getCloseButton().isDisplayed()).to.eventually.be.true;
          expect(storageSelectorModalPage.getModalTitle().getText()).to.eventually.equal('Select a Folder');
        });

        it('should list folders',function(){
          helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
          expect(filesListPage.getFilesGrid().isDisplayed()).to.eventually.be.true;
          filesListPage.getGridViewSelector().click();
          expect(filesListPage.getFilesListTable().isDisplayed()).to.eventually.be.true;
        });

        it('should filter folders',function(){
          filesListPage.filterFileList('E2E_TEST_FOLDER');
          expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);
        });
      });
    });

  });
};
module.exports = IframeScenarios;
