'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var PlaceholdersListPage = require('./../pages/placeholdersListPage.js');
var PlaceholderSettingsPage = require('./../pages/placeholderSettingsPage.js');
var PlaceholderPlaylistPage = require('./../pages/placeholderPlaylistPage.js');
var PlaylistItemModalPage = require('./../pages/playlistItemModalPage.js');
var WidgetSettingsPage = require('./../pages/widgetSettingsPage.js');
var StorageSelectorModalPage = require('./../../storage/pages/storageSelectorModalPage.js');
var FilesListPage = require('./../../storage/pages/filesListPage.js');
var helper = require('rv-common-e2e').helper;

var AddContentScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Add Image/Video/Text Scenarios: ', function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var placeholdersListPage;
    var placeholderSettingsPage;
    var presentationPropertiesModalPage;
    var placeholderPlaylistPage;
    var playlistItemModalPage;
    var widgetSettingsPage;
    var storageSelectorModalPage;
    var filesListPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholdersListPage = new PlaceholdersListPage();
      placeholderSettingsPage = new PlaceholderSettingsPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      placeholderPlaylistPage = new PlaceholderPlaylistPage();
      playlistItemModalPage = new PlaylistItemModalPage();
      widgetSettingsPage = new WidgetSettingsPage();
      storageSelectorModalPage = new StorageSelectorModalPage();
      filesListPage = new FilesListPage();

      homepage.getEditor();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
    });

    before('Add Presentation & Placeholder: ', function () {
      presentationsListPage.openNewPresentation();
      presentationPropertiesModalPage.getCancelButton().click();

      workspacePage.getAddPlaceholderButton().click();
      browser.sleep(500);
      
    });
    
    describe('Should Add an Image item: ', function () {
      before('Click Add Image: ', function () {
        placeholderPlaylistPage.getAddImageButton().click();
      });
      
      it('should open Storage Selector modal', function() {
        helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');

        filesListPage.filterFileList("package.json");

        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);

        filesListPage.getFileItems().get(0).click();
        
        storageSelectorModalPage.getSelectFilesButton().click();
        
        helper.waitDisappear(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
      });
      
    });
    
    describe('Should Add a Video item: ', function () {
      before('Click Add Video: ', function () {
        placeholderPlaylistPage.getAddVideoButton().click();
      });
      
      it('should open Storage Selector modal', function() {
        helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');

        filesListPage.filterFileList("package.json");

        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);

        filesListPage.getFileItems().get(0).click();
        
        storageSelectorModalPage.getSelectFilesButton().click();
        
        helper.waitDisappear(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
      });
      
    });

    describe('Should Add a text item: ', function () {
      before('Click Add Text: ', function () {
        placeholderPlaylistPage.getAddTextButton().click();
      });

      it('should open Widget Settings', function () {
        helper.wait(widgetSettingsPage.getWidgetModal(), 'Widget Settings Modal');
        browser.switchTo().frame('widget-modal-frame');
        
        expect(widgetSettingsPage.getCloseButton().isDisplayed()).to.eventually.be.true;
        expect(widgetSettingsPage.getTitle().getText()).to.eventually.equal('Text Settings');        
      });

      it('should not display Playlist Item Settings Page after closing Widget Settings',function(){
        widgetSettingsPage.getCloseButton().click();
        browser.switchTo().defaultContent();
        browser.waitForAngular();

        expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
      });

    });
    
    describe('Playlist: ', function() {
      it('Should have 3 items in the playlist', function() {
        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(3);
        expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain('package.json');
        expect(placeholderPlaylistPage.getItemNameCells().get(1).getText()).to.eventually.contain('package.json');
        expect(placeholderPlaylistPage.getItemNameCells().get(2).getText()).to.eventually.contain('Text Widget');
      });
    });
    

  });
};
module.exports = AddContentScenarios;
