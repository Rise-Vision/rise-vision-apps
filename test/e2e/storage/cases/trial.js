'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('./../../../../web/bower_components/common-header/test/e2e/pages/commonHeaderPage.js');
var helper = require('rv-common-e2e').helper;
var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
var WorkspacePage = require('./../../editor/pages/workspacePage.js');
var StoreProductsModalPage = require('./../../editor/pages/storeProductsModalPage.js');
var PlaceholderPlaylistPage = require('./../../editor/pages/placeholderPlaylistPage.js');
var StorageSelectorModalPage = require('./../pages/storageSelectorModalPage.js');
var FilesListPage = require('./../pages/filesListPage.js');

var FirstSigninScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Trial', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationListPage;
    var workspacePage;
    var storeProductsModalPage;
    var placeholderPlaylistPage;
    var storageSelectorModalPage;
    var filesListPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationListPage = new PresentationListPage();
      workspacePage = new WorkspacePage();
      storeProductsModalPage = new StoreProductsModalPage()
      placeholderPlaylistPage = new PlaceholderPlaylistPage();
      storageSelectorModalPage = new StorageSelectorModalPage();
      filesListPage = new FilesListPage();
    });

    describe('Given a user that just signed up for Rise Vision', function () {

      before(function () {
        homepage.getStorage();
        signInPage.signIn();
        var subCompanyName = 'E2E TEST SUBCOMPANY - STORAGE TRIAL';
        commonHeaderPage.createSubCompany(subCompanyName);
        commonHeaderPage.selectSubCompany(subCompanyName);   
      });

      it('should show Storage Trial on Storage home', function () {
        helper.wait(storageSelectorModalPage.getStartTrialButton(), 'Start Trial Button');
        
        expect(storageSelectorModalPage.getStartTrialButton().isDisplayed()).to.eventually.be.true;
        expect(filesListPage.getSearchInput().isDisplayed()).to.eventually.be.false;
      });

      it('should open a new Presentation', function () {
        commonHeaderPage.getCommonHeaderMenuItems().get(1).click();

        presentationListPage.openNewPresentation();
      });

      xit('should start a new presentation', function () {
        helper.clickWhenClickable(homepage.getPresentationCTAButton(), 'Presentation CTA button');

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
