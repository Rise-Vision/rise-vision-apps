'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var helper = require('rv-common-e2e').helper;
var StorageHomePage = require('./../pages/storageHomePage.js');
var FilesListPage = require('./../pages/filesListPage.js');

var HomeScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe("Storage Home", function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var storageHomePage;
    var filesListPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      storageHomePage = new StorageHomePage();
      filesListPage = new FilesListPage();
    });

    describe("Given a user who want see a list of her files", function () {

      before(function () {
        homepage.getStorage();
        //wait for spinner to go away.
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
          loginPage.signIn();
        });
      });

      it('should load Storage Home', function () {
        helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
        
        expect(storageHomePage.getStorageAppContainer().isDisplayed()).to.eventually.be.true;
      });

      it('should load files grid',function(){
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
        expect(filesListPage.getFilesGrid().isDisplayed()).to.eventually.be.true;
      });

      it('should show action buttons',function(){
        expect(storageHomePage.getNewFolderButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getUploadButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getUploadFolderButton().isDisplayed()).to.eventually.be.true;
      });

      it('should show search input',function(){
        expect(filesListPage.getSearchInput().isDisplayed()).to.eventually.be.true;       
      });

      // it('should show grid and list selectors',function(){
      //   expect(filesListPage.getGridViewSelector().isDisplayed()).to.eventually.be.true;
      //   expect(filesListPage.getListViewSelector().isDisplayed()).to.eventually.be.true;
      // });

      // it('should switcch between grid and list views',function(){
      //   expect(filesListPage.getFilesGrid().isDisplayed()).to.eventually.be.true;

      //   filesListPage.getListViewSelector().click();
      //   expect(filesListPage.getFilesListTable().isDisplayed()).to.eventually.be.true;

      //   filesListPage.getGridViewSelector().click();
      //   expect(filesListPage.getFilesGrid().isDisplayed()).to.eventually.be.true;
      // });

      it('should show thumbnails',function(){
        filesListPage.filterFileList("logo.gif");
        expect(filesListPage.getFileItems().get(0).element(by.css('img')).isDisplayed()).to.eventually.be.true;
      });

      it('should navigate to subfolders',function(){
        filesListPage.getSearchInput().clear();
        filesListPage.filterFileList("Trash");

        browser.actions()
          .click(filesListPage.getFileItems().get(0))
          .click(filesListPage.getFileItems().get(0))
          .perform();

        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Files Loader');
        
        filesListPage.filterFileList("bower.json");
        expect(filesListPage.getFileItems().count()).to.eventually.be.equal(0);
        filesListPage.getSearchInput().clear();
      });

      it('should show breadcrumbs',function(){
        expect(storageHomePage.getBreadcrumbs().count()).to.eventually.be.equal(1);
      });

      it('should navigate with breadcrumbs',function(){
        storageHomePage.getBreadcrumbs().get(0).click();

        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Files Loader');

        filesListPage.filterFileList("package.json");
        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);
      })

    });
  });
};
module.exports = HomeScenarios;
