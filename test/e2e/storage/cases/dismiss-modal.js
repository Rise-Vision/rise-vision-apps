'use strict';
var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var StorageSelectorModalPage = require('./../pages/storageSelectorModalPage.js');
var NewFolderModalPage = require('./../pages/newFolderModalPage.js');
var HomePage = require('./../../common/pages/homepage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var StorageHelper = require('./../pages/helper.js');
var StorageHomePage = require('./../pages/storageHomePage.js');
var FilesListPage = require('./../pages/filesListPage.js');


var DismissModalScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Dismiss Modal', function () {
    var storageSelectorModalPage = new StorageSelectorModalPage();
    var newFolderModalPage = new NewFolderModalPage();
    var homePage = new HomePage();
    var commonHeaderPage = new CommonHeaderPage();
    var storageHomePage = new StorageHomePage();
    var filesListPage = new FilesListPage();

    var describeNewFolder = function() {

      it('should open New Folder modal', function(){
        storageSelectorModalPage.getNewFolderButton().click();
        helper.wait(newFolderModalPage.getNewFolderModal(), 'New Folder Modal');

        expect(newFolderModalPage.getNewFolderModal().isDisplayed()).to.eventually.be.true;
        expect(newFolderModalPage.getModalTitle().getText()).to.eventually.equal('Create Folder');
      });

      it('should dismiss modal when back in history', function(){
        browser.navigate().back();
        expect(newFolderModalPage.getNewFolderModal().isPresent()).to.eventually.be.false;
      });
    };

    describe('From Storage Home:',function(){
      before(function () {        
        StorageHelper.setupStorageHome();
        commonHeaderPage.getCommonHeaderMenuItems().get(0).click(); //Launcher
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        helper.wait(homePage.getShareTooltipDismiss(), 'Feature Tour');
        helper.clickOverIFrame(homePage.getShareTooltipDismiss(), 'Tooltip Dismiss');

        commonHeaderPage.getCommonHeaderMenuItems().get(4).click(); //Storage
        helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
      });
      describe('Dismiss Modal:', describeNewFolder);
    });

  });
};
module.exports = DismissModalScenarios;
