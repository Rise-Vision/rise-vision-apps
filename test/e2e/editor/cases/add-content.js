'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
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
  xdescribe('Add Content', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var placeholdersListPage;
    var placeholderSettingsPage;
    var placeholderPlaylistPage;
    var playlistItemModalPage;
    var widgetSettingsPage;
    var storageSelectorModalPage;
    var filesListPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholdersListPage = new PlaceholdersListPage();
      placeholderSettingsPage = new PlaceholderSettingsPage();
      commonHeaderPage = new CommonHeaderPage();
      placeholderPlaylistPage = new PlaceholderPlaylistPage();
      playlistItemModalPage = new PlaylistItemModalPage();
      widgetSettingsPage = new WidgetSettingsPage();
      storageSelectorModalPage = new StorageSelectorModalPage();
      filesListPage = new FilesListPage();

      homepage.getEditor();
      signInPage.signIn();
    });

    before('Add Presentation & Placeholder: ', function () {
      presentationsListPage.openNewPresentation();

      helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

      browser.sleep(500);
      
    });
    
    describe('Should Add an Image item: ', function () {
      before('Click Add Image: ', function () {
        placeholderPlaylistPage.getAddImageButton().click();
      });
      
      it('should open Storage Selector modal', function() {
        helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');

        expect(storageSelectorModalPage.getModalTitle().getText()).to.eventually.equal('Select Images and/or Folders of Images');
      });
      
      it('should only allow user to select images', function() {
        filesListPage.filterFileList('package.json');

        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);

        expect(filesListPage.getFileItems().get(0).getAttribute('class')).to.eventually.contain('list-item--disabled');
      })
      
      it('should select the file and add to the playlist', function() {
        filesListPage.filterFileList('logo.gif');

        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);

        filesListPage.getFileItems().get(0).click();
        
        storageSelectorModalPage.getSelectFilesButton().click();
        
        helper.waitDisappear(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
      });
      
    });
    
    describe('Should Add an Image Item by URL', function() {
      before('Click Add Image: ', function () {
        placeholderPlaylistPage.getAddImageButton().click();
      });
      
      it('should open Storage Selector modal', function() {
        helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');

        storageSelectorModalPage.getByURLButton().click();
        
        helper.waitDisappear(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
      });
      
      it('should open Widget Settings', function () {
        helper.wait(widgetSettingsPage.getWidgetModal(), 'Widget Settings Modal');
        helper.waitDisappear(widgetSettingsPage.getWidgetLoader(), 'Widget Settings Loader');

        browser.switchTo().frame('widget-modal-frame');
        
        expect(widgetSettingsPage.getCloseButton().isDisplayed()).to.eventually.be.true;
        expect(widgetSettingsPage.getTitle().getText()).to.eventually.equal('Image Settings');        
      });

      it('should select Custom URL Option and update URL',function(){
        expect(widgetSettingsPage.getImageWidgetCustomButton().getAttribute('class')).to.eventually.contain('active');
        
        expect(widgetSettingsPage.getImageWidgetURLTextbox().isDisplayed()).to.eventually.be.true;
        
        widgetSettingsPage.getImageWidgetURLTextbox().clear();
        widgetSettingsPage.getImageWidgetURLTextbox().sendKeys('https://s3.amazonaws.com/Rise-Images/UI/logo.svg');
      });

      it('should add Image Widget to playlist', function() {
        helper.clickWhenClickable(widgetSettingsPage.getSaveButton(), 'Widget Save Button');
        browser.switchTo().defaultContent();
        browser.waitForAngular();

        expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
      });
      
      it('Should not add Image Widget if cancelled: ', function () {
        placeholderPlaylistPage.getAddImageButton().click();

        helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');

        storageSelectorModalPage.getByURLButton().click();
        
        helper.waitDisappear(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');

        helper.wait(widgetSettingsPage.getWidgetModal(), 'Widget Settings Modal');
        helper.waitDisappear(widgetSettingsPage.getWidgetLoader(), 'Widget Settings Loader');

        browser.switchTo().frame('widget-modal-frame');

        helper.clickWhenClickable(widgetSettingsPage.getCloseButton(), 'Widget Close Button');
        browser.switchTo().defaultContent();
        browser.waitForAngular();
      });
    });
    
    describe('Should Add a Video item: ', function () {
      before('Click Add Video: ', function () {
        placeholderPlaylistPage.getAddVideoButton().click();
      });
      
      it('should open Storage Selector modal', function() {
        helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
        helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
        
        expect(storageSelectorModalPage.getModalTitle().getText()).to.eventually.equal('Select Videos and/or Folders of Videos');
      });
      
      it('should only allow user to select images', function() {
        filesListPage.filterFileList('package.json');

        expect(filesListPage.getFileItems().count()).to.eventually.be.greaterThan(0);

        expect(filesListPage.getFileItems().get(0).getAttribute('class')).to.eventually.contain('list-item--disabled');
      })

      it('should select the file and add to the playlist', function() {
        filesListPage.filterFileList('samplevideo.mp4');

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
        helper.waitDisappear(widgetSettingsPage.getWidgetLoader(), 'Widget Settings Loader');

        browser.switchTo().frame('widget-modal-frame');
        
        expect(widgetSettingsPage.getCloseButton().isDisplayed()).to.eventually.be.true;
        expect(widgetSettingsPage.getTitle().getText()).to.eventually.equal('Text Settings');        
      });

      it('should not display Playlist Item Settings Page after Saving Widget Settings',function(){
        helper.clickWhenClickable(widgetSettingsPage.getSaveButton(), 'Widget Save Button');
        browser.switchTo().defaultContent();
        browser.waitForAngular();

        expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
        
        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(4);
      });
      
      it('should not add Text Item if user Cancels Widget Settings', function() {
        placeholderPlaylistPage.getAddTextButton().click();

        helper.wait(widgetSettingsPage.getWidgetModal(), 'Widget Settings Modal');
        helper.waitDisappear(widgetSettingsPage.getWidgetLoader(), 'Widget Settings Loader');

        browser.switchTo().frame('widget-modal-frame');

        helper.clickWhenClickable(widgetSettingsPage.getCloseButton(), 'Widget Close Button');
        browser.switchTo().defaultContent();
        browser.waitForAngular();

        expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
      });
    });
    
    describe('Playlist: ', function() {
      it('Should have 3 items in the playlist', function() {
        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(4);
        expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain('logo.gif');
        expect(placeholderPlaylistPage.getItemNameCells().get(1).getText()).to.eventually.contain('Image');
        expect(placeholderPlaylistPage.getItemNameCells().get(2).getText()).to.eventually.contain('samplevideo.mp4');
        expect(placeholderPlaylistPage.getItemNameCells().get(3).getText()).to.eventually.contain('Text Widget');
      });
    });
    

  });
};
module.exports = AddContentScenarios;
