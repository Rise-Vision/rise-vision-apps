'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;
var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
var WorkspacePage = require('./../../editor/pages/workspacePage.js');
var PlaceholderPlaylistPage = require('./../../editor/pages/placeholderPlaylistPage.js');
var StorageSelectorModalPage = require('./../pages/storageSelectorModalPage.js');
var FilesListPage = require('./../pages/filesListPage.js');

var StorageTrialScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Trial', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationListPage;
    var workspacePage;
    var placeholderPlaylistPage;
    var storageSelectorModalPage;
    var filesListPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationListPage = new PresentationListPage();
      workspacePage = new WorkspacePage();
      placeholderPlaylistPage = new PlaceholderPlaylistPage();
      storageSelectorModalPage = new StorageSelectorModalPage();
      filesListPage = new FilesListPage();
    });

    describe('Given a user that just signed up for Rise Vision', function () {

      before(function () {
        homepage.getStorage();
        signInPage.signIn();
        commonHeaderPage.selectUnsubscribedSubCompany();
      });

      it('should show Storage Trial on Storage home', function () {
        helper.wait(storageSelectorModalPage.getStartTrialButton(), 'Start Trial Button');
        
        expect(storageSelectorModalPage.getStartTrialButton().isDisplayed()).to.eventually.be.true;
        expect(filesListPage.getSearchInput().isDisplayed()).to.eventually.be.false;
      });

      it('should open a new Presentation', function () {
        commonHeaderPage.getPresentationsMenuItem().click();

        presentationListPage.openNewPresentation(true);
      });

      it('should show Storage Trial when adding an Image', function () {
        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');
        browser.sleep(500);
        placeholderPlaylistPage.getAddImageButton().click();

        helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');

        expect(storageSelectorModalPage.getModalTitle().getText()).to.eventually.equal('Select Images and/or Folders of Images');
        expect(storageSelectorModalPage.getStartTrialButton().isDisplayed()).to.eventually.be.true;

        expect(filesListPage.getSearchInput().isDisplayed()).to.eventually.be.false;

        storageSelectorModalPage.getCloseButton().click();
      });

    });
  });
};
module.exports = StorageTrialScenarios;
