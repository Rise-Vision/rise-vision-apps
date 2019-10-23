'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;
var StorageHomePage = require('./../pages/storageHomePage.js');
var FilesListPage = require('./../pages/filesListPage.js');
var CopyUrlModalPage = require('./../pages/copyUrlModalPage.js');

var HomeScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Copy Url', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var storageHomePage;
    var filesListPage;
    var copyUrlModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      storageHomePage = new StorageHomePage();
      filesListPage = new FilesListPage();
      copyUrlModalPage = new CopyUrlModalPage();
    });

    describe('Given a user who want see a list of her files', function () {

      before(function () {
        homepage.getStorage();
        signInPage.signIn();
      });

      it('should show copy url button', function() {
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');

        filesListPage.getGridViewSelector().click();

        expect(storageHomePage.getCopyUrlButton().isDisplayed()).to.eventually.be.true;
        expect(storageHomePage.getCopyUrlButton().isEnabled()).to.eventually.be.false;
      });

      it('should enable button when a file is clicked',function(){
        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);

        filesListPage.filterFileList('package.json');

        filesListPage.getFileItems().get(0).click();

        expect(filesListPage.getFileItems().get(0).getAttribute('class')).to.eventually.contain('active');

        expect(storageHomePage.getCopyUrlButton().isEnabled()).to.eventually.be.true;
      });

      it('should show copy url modal',function(){
        storageHomePage.getCopyUrlButton().click();

        helper.wait(copyUrlModalPage.getCopyUrlModal(), 'Copy URL Modal');

        expect(copyUrlModalPage.getCopyUrlModal().isDisplayed()).to.eventually.be.true;
        expect(copyUrlModalPage.getCopyUrlInput().isDisplayed()).to.eventually.be.true;

        expect(copyUrlModalPage.getCopyUrlInput().getAttribute('value')).to.eventually.match(
          /https:\/\/storage\.googleapis\.com\/risemedialibrary\-(.+)\/package\.json/);
      });

      it('should close modal', function() {
        expect(copyUrlModalPage.getCloseButton().isDisplayed()).to.eventually.be.true;

        copyUrlModalPage.getCloseButton().click();

        helper.waitDisappear(copyUrlModalPage.getCopyUrlModal(), 'Copy URL Modal');

        expect(copyUrlModalPage.getCopyUrlModal().isPresent()).to.eventually.be.false;
      });

    });
  });
};
module.exports = HomeScenarios;
