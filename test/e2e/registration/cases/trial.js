'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;
var StorageHomePage = require('./../../storage/pages/storageHomePage.js');
var StorageSelectorModalPage = require('./../../storage/pages/storageSelectorModalPage.js');
var FilesListPage = require('./../../storage/pages/filesListPage.js');

var TrialScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Trial', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var storageHomePage;
    var storageSelectorModalPage;
    var filesListPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      storageHomePage = new StorageHomePage();
      storageSelectorModalPage = new StorageSelectorModalPage();
      filesListPage = new FilesListPage();
    });

    describe('Given a user that just signed up for Rise Vision', function () {

      before(function () {
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');

        helper.clickWhenClickable(homepage.getStorageLink(), 'Storage link');
      });
      
      it('should load Storage Home', function () {
        helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
        
        expect(storageHomePage.getStorageAppContainer().isDisplayed()).to.eventually.be.true;

        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
      });

      it('should show Storage Trial on Storage home', function () {
        helper.wait(storageSelectorModalPage.getActiveTrialBanner(), 'Active Trial Banner');

        expect(storageSelectorModalPage.getActiveTrialBanner().isDisplayed()).to.eventually.be.true;
        expect(storageSelectorModalPage.getStartTrialButton().isDisplayed()).to.eventually.be.false;

        expect(storageHomePage.getNewFolderButton().isDisplayed()).to.eventually.be.true;
      });

      it('should show Strage trial after page refresh', function () {
        var _getTrialWithRetries = function(retries) {
          helper.wait(storageSelectorModalPage.getActiveTrialBanner(), 'Active Trial')
            .catch(function (e) {
              retries = typeof(retries) === 'undefined' ? 3 : retries;

              if (retries > 0) {
                browser.call(()=>console.log("waiting for trial to appear, attempt: " + (4 - retries)));

                browser.driver.navigate().refresh();

                helper.waitDisappear(commonHeaderPage.getLoader(), 'CH Spinner Loader');

                _getTrialWithRetries(retries - 1);
              } else {
                throw e;
              }
            });
        };

        homepage.getStorage();

        _getTrialWithRetries();

        expect(storageSelectorModalPage.getActiveTrialBanner().isDisplayed()).to.eventually.be.true;
        expect(storageSelectorModalPage.getStartTrialButton().isDisplayed()).to.eventually.be.false;

        expect(storageHomePage.getNewFolderButton().isDisplayed()).to.eventually.be.true;
      });

      after(function() {
        commonHeaderPage.signOut(true);
      });

    });
  });
};
module.exports = TrialScenarios;
