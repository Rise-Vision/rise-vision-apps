'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;
var StorageHomePage = require('./../pages/storageHomePage.js');
var FilesListPage = require('./../pages/filesListPage.js');
var StorageSelectorModalPage = require('./../pages/storageSelectorModalPage.js');

var TrashScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Trash', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var storageHomePage;
    var filesListPage;
    var storageSelectorModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      storageHomePage = new StorageHomePage();
      filesListPage = new FilesListPage();
      storageSelectorModalPage = new StorageSelectorModalPage();
    });

    describe('Given a user who wants to delete a file forever', function () {

      before(function () {
        homepage.getStorage();
        signInPage.signIn();

        helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');

        //upload sample file       
        var uploadFilePath = process.cwd() + '/bower.json';
        storageHomePage.getUploadInput().sendKeys(uploadFilePath);

        storageSelectorModalPage.getOverwriteConfirmationModal().isPresent().then(function(isDisplayed) {
          if (isDisplayed) {
            helper.clickWhenClickable(storageSelectorModalPage.getOverwriteFilesButton(),'Keep Files button');
            helper.waitDisappear(storageSelectorModalPage.getOverwriteConfirmationModal(), 'Overwrite Confirmation');            
          }
        });

        //wait upload to finish        
        helper.waitDisappear(storageHomePage.getUploadPanel(), 'Storage Upload Panel');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
      });

      it('should show Trash button', function () {
        expect(storageHomePage.getMoveToTrashButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getMoveToTrashButton().isEnabled()).to.eventually.be.false;

        expect(storageHomePage.getRestoreFromTrashButton().isDisplayed()).to.eventually.be.false;
      });

      it('should enable Trash after file is selected',function(){
        filesListPage.filterFileList('bower.json');

        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);

        filesListPage.getFileItems().get(0).click();
        
        expect(filesListPage.getFileItems().get(0).getAttribute('class')).to.eventually.contain('list-item--selected');
        expect(storageHomePage.getMoveToTrashButton().isEnabled()).to.eventually.be.true;
      });

      it('should show break file link warning',function(){
        storageHomePage.getMoveToTrashButton().click();

        helper.wait(storageHomePage.getConfirmBreakLinkModal(), 'Confirm Break Link Modal');

        expect(storageHomePage.getConfirmBreakLinkModal().isDisplayed()).to.eventually.be.true;
      });

      it('should delete the file',function(){
        storageHomePage.getConfirmBreakLinkButton().click();

        helper.waitDisappear(storageHomePage.getConfirmBreakLinkModal(), 'Confirm Break Link Modal');

        helper.waitDisappear(storageHomePage.getPendingOperationsPanel(), 'Pending Operations Panel');

        expect(filesListPage.getFileItems().count()).to.eventually.equal(0);
      });

      it('should show deleted file in Trash folder',function(){
        filesListPage.filterFileList('Trash');

        browser.actions()
        .click(filesListPage.getFileItems().get(0))
        .click(filesListPage.getFileItems().get(0))
        .perform();

        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Files Loader');
        
        filesListPage.filterFileList('bower.json');
        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);
      });


      it('should restore file from Trash',function(){
        expect(storageHomePage.getRestoreFromTrashButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getRestoreFromTrashButton().isEnabled()).to.eventually.be.false;

        filesListPage.getFileItems().get(0).click();
        expect(storageHomePage.getRestoreFromTrashButton().isEnabled()).to.eventually.be.true;

        storageHomePage.getRestoreFromTrashButton().click();

        helper.waitDisappear(storageHomePage.getPendingOperationsPanel(), 'Pending Operations Panel');
        filesListPage.filterFileList('bower.json');
        expect(filesListPage.getFileItems().count()).to.eventually.equal(0);
      });

      it('should show restored file in files list',function(){
        filesListPage.getSearchInput().clear();
        // go back to root folder
        storageHomePage.getBreadcrumbs().get(0).click();

        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Files Loader');

        filesListPage.filterFileList('bower.json');
        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);
      });

      it('should delete the file forever',function(done){
        //delete file
        filesListPage.getFileItems().get(0).click();
        storageHomePage.getMoveToTrashButton().click();

        helper.wait(storageHomePage.getConfirmBreakLinkModal(), 'Confirm Break Link Modal');
        storageHomePage.getConfirmBreakLinkButton().click();
        helper.waitDisappear(storageHomePage.getConfirmBreakLinkModal(), 'Confirm Break Link Modal');

        helper.waitDisappear(storageHomePage.getPendingOperationsPanel(), 'Pending Operations Panel');

        //open Trash
        filesListPage.filterFileList('Trash');
        browser.actions()
          .click(filesListPage.getFileItems().get(0))
          .click(filesListPage.getFileItems().get(0))
          .perform();
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Files Loader');
       
        expect(storageHomePage.getDeleteForeverButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getDeleteForeverButton().isEnabled()).to.eventually.be.false;

        //delete forever
        filesListPage.filterFileList('bower.json');
        filesListPage.getFileItems().get(0).click();        
        expect(storageHomePage.getDeleteForeverButton().isEnabled()).to.eventually.be.true;       
        storageHomePage.getDeleteForeverButton().click();
        
        //show confirmation modal
        helper.clickWhenClickable(storageHomePage.getConfirmDeleteButton(), 'Delete Forever Confirm Button').then(function () {          
          helper.waitDisappear(storageHomePage.getPendingOperationsPanel(), 'Pending Operations Panel');
          filesListPage.filterFileList('bower.json');
          //file is deleted
          expect(filesListPage.getFileItems().count()).to.eventually.equal(0);
          done();
        });
      });
    });
  });
};
module.exports = TrashScenarios;
