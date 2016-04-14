'use strict';
var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var StorageSelectorModalPage = require('./../pages/storageSelectorModalPage.js');
var NewFolderModalPage = require('./../pages/newFolderModalPage.js');
var StorageHelper = require('./../pages/helper.js');

var NewFolderScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe("Given a user who wants to add a folder to Storage", function () {
    var storageSelectorModalPage = new StorageSelectorModalPage();
    var newFolderModalPage = new NewFolderModalPage();

    var describeNewFolder = function() {

      it('should open New Folder modal', function(){
        storageSelectorModalPage.getNewFolderButton().click();
        helper.wait(newFolderModalPage.getNewFolderModal(), 'New Folder Modal');

        expect(newFolderModalPage.getNewFolderModal().isDisplayed()).to.eventually.be.true;
        expect(newFolderModalPage.getModalTitle().getText()).to.eventually.equal('Add Folder');
      });

      it('should contain new folder form', function(){
        expect(newFolderModalPage.getNewFolderInput().isDisplayed()).to.eventually.be.true;
        expect(newFolderModalPage.getSaveButton().isDisplayed()).to.eventually.be.true;
        expect(newFolderModalPage.getCancelButton().isDisplayed()).to.eventually.be.true;
      });

      it('should enable save after enterign folder name',function(){
        expect(newFolderModalPage.getSaveButton().isEnabled()).to.eventually.be.false;

        newFolderModalPage.getNewFolderInput().sendKeys("newFolder");

        expect(newFolderModalPage.getSaveButton().isEnabled()).to.eventually.be.true;
      });

      it('should close modal', function () {
        newFolderModalPage.getCancelButton().click();
        
        helper.waitDisappear(newFolderModalPage.getNewFolderModal(), 'New Folder Modal');

        expect(newFolderModalPage.getNewFolderModal().isPresent()).to.eventually.be.false;
      });
    };

    describe("And he is using Iframe Single File Selector:",function(){
      before(function () { StorageHelper.setupIframeSingleFileSelector(); });
      describe("New Folder:", describeNewFolder);
    });

    describe("And he is using Storage Home:",function(){
      before(function () { StorageHelper.setupStorageHome(); });
      describe("New Folder:", describeNewFolder);
    });

    describe("And he is using Apps Single File Selector:",function(){
      before(function () { StorageHelper.setupAppsSingleFileSelector(); });
      describe("New Folder:", describeNewFolder);
    });
  });
};
module.exports = NewFolderScenarios;
