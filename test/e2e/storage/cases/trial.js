'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var helper = require('rv-common-e2e').helper;
var WorkspacePage = require('./../../editor/pages/workspacePage.js');
var StoreProductsModalPage = require('./../../editor/pages/storeProductsModalPage.js');
var PlaceholderPlaylistPage = require('./../../editor/pages/placeholderPlaylistPage.js');
var StorageSelectorModalPage = require('./../pages/storageSelectorModalPage.js');
var FilesListPage = require('./../pages/filesListPage.js');

var FirstSigninScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Trial', function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var workspacePage;
    var storeProductsModalPage;
    var placeholderPlaylistPage;
    var storageSelectorModalPage;
    var filesListPage;
    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      workspacePage = new WorkspacePage();
      storeProductsModalPage = new StoreProductsModalPage()
      placeholderPlaylistPage = new PlaceholderPlaylistPage();
      storageSelectorModalPage = new StorageSelectorModalPage();
      filesListPage = new FilesListPage();
    });

    describe('Given a user that just signed up for Rise Vision', function () {

      before(function () {
        homepage.getStorage();
        loginPage.signIn();
        var subCompanyName = 'E2E TEST SUBCOMPANY';
        commonHeaderPage.createSubCompany(subCompanyName);
        commonHeaderPage.selectSubCompany(subCompanyName);   
      });

      it('should show Storage Trial on Storage home', function () {
        helper.wait(storageSelectorModalPage.getStartTrialButton(), 'Start Trial Button');
        
        expect(storageSelectorModalPage.getStartTrialButton().isDisplayed()).to.eventually.be.true;
        expect(filesListPage.getSearchInput().isDisplayed()).to.eventually.be.false;
      });

      it('should show navigate to launcher page', function () {
        commonHeaderPage.getCommonHeaderMenuItems().get(0).click();
        helper.wait(homepage.getPresentationCTA(), 'Presentation Call to Action');

        expect(homepage.getPresentationCTA().isDisplayed()).to.eventually.be.true;
        expect(homepage.getPresentationCTAButton().isDisplayed()).to.eventually.be.true;
      });

      it('should start a new presentation', function () {
        homepage.getPresentationCTAButton().click();

        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader());
        storeProductsModalPage.getAddBlankPresentation().click();
        
        helper.wait(workspacePage.getWorkspaceContainer(), 'Workspace Container');
        expect(workspacePage.getWorkspaceContainer().isDisplayed()).to.eventually.be.true;
        browser.sleep(500);
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

      after(function(){
        commonHeaderPage.deleteCurrentCompany();
      });

    });
  });
};
module.exports = FirstSigninScenarios;
