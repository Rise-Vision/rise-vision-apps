'use strict';
var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var HomePage = require('./../pages/homepage.js');
var StorageSelectorModalPage = require('./../../storage/pages/storageSelectorModalPage.js');
var NewFolderModalPage = require('./../../storage/pages/newFolderModalPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var UserSettingsModalPage = require('./../../common-header/pages/userSettingsModalPage.js');
var StorageHelper = require('./../../storage/pages/helper.js');
var StorageHomePage = require('./../../storage/pages/storageHomePage.js');
var FilesListPage = require('./../../storage/pages/filesListPage.js');

var DismissModalScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Dismiss Modal', function () {
    var homepage = new HomePage();

    var storageSelectorModalPage = new StorageSelectorModalPage();
    var newFolderModalPage = new NewFolderModalPage();

    var commonHeaderPage = new CommonHeaderPage();
    var userSettingsModalPage = new UserSettingsModalPage();
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
        commonHeaderPage.getPresentationsMenuItem().click(); //Editor
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        commonHeaderPage.getStorageMenuItem().click(); //Storage
        helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
      });
      describe('Dismiss Modal:', describeNewFolder);
    });

    describe('User Add', function() {
      before(function () {        
        homepage.getUsersAdd();
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      });
      
      it('should show the user add modal', function() {
        helper.wait(userSettingsModalPage.getUserSettingsModal(), 'User Settings Modal');

        expect(userSettingsModalPage.getUserSettingsModal().isPresent()).to.eventually.be.true;
      });
    });

  });
};
module.exports = DismissModalScenarios;
