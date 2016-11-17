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
var StoreProductsModalPage = require('./../pages/storeProductsModalPage.js');
var WidgetByUrlModalPage = require('./../pages/widgetByUrlModalPage.js');
var WidgetSettingsPage = require('./../pages/widgetSettingsPage.js');
var helper = require('rv-common-e2e').helper;

var PlaylistScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Playlist Scenarios: ', function () {
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
    var storeProductsModalPage;
    var widgetByUrlModalPage;
    var widgetSettingsPage;

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
      storeProductsModalPage = new StoreProductsModalPage();
      widgetByUrlModalPage = new WidgetByUrlModalPage();
      widgetSettingsPage = new WidgetSettingsPage();

      homepage.getEditor();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
    });

    before('Add Presentation & Placeholder: ', function () {
      presentationsListPage.openNewPresentation();
      presentationPropertiesModalPage.getCancelButton().click();

      helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

      browser.sleep(500);

    });

    describe('Show Playlist by default',function(){
      it('should show Playlist',function(){
        helper.wait(placeholderPlaylistPage.getAddContentButton(), 'Placeholder Playlist Page');
        expect(placeholderPlaylistPage.getAddContentButton().isDisplayed()).to.eventually.be.true;
      });

      it('should not remember selecting Settings tab',function(){
        placeholderSettingsPage.getEditPropertiesButton().click();
        workspacePage.getBackToListButton().click();
        browser.sleep(500);

        helper.wait(placeholdersListPage.getManageLinks().get(0), 'Placeholders List');
        placeholdersListPage.getManageLinks().get(0).click();
        browser.sleep(500);

        helper.wait(placeholderPlaylistPage.getAddContentButton(), 'Placeholder Playlist Page');
        expect(placeholderPlaylistPage.getAddContentButton().isDisplayed()).to.eventually.be.true;
      })

    });

    describe('Should Add a content playlist item: ', function () {
      before('Click Add Widget: ', function () {
        placeholderPlaylistPage.getAddContentButton().click();
        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
      });

      it('should open the Store Products Modal', function () {
        expect(storeProductsModalPage.getStoreProductsModal().isDisplayed()).to.eventually.be.true;
      });

      it('should show modal title', function () {
        expect(storeProductsModalPage.getModalTitle().getText()).to.eventually.equal('Add Widget');
      });

      it('should show a search box', function () {
        expect(storeProductsModalPage.getSearchFilter().isDisplayed()).to.eventually.be.true;
        expect(storeProductsModalPage.getSearchInput().getAttribute('placeholder')).to.eventually.equal('Search for Widget');
      });

      it('should show a list of products', function () {
        expect(storeProductsModalPage.getStoreProductsList().isDisplayed()).to.eventually.be.true;
      });

      it('should show products', function () {
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader()).then(function () {
          expect(storeProductsModalPage.getStoreProducts().count()).to.eventually.be.above(0);
        });
      });

      it('should search products',function(){
        storeProductsModalPage.getSearchInput().sendKeys('image widget');
        storeProductsModalPage.getSearchInput().sendKeys(protractor.Key.ENTER);
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader()).then(function () {
          expect(storeProductsModalPage.getStoreProducts().count()).to.eventually.be.above(0);
        });
      });

      it('first products should be Image Widget', function () {
        expect(storeProductsModalPage.getProductNameFields().get(0).getText()).to.eventually.equal('Image Widget');

      });

      it('should display store status in catalogue', function () {
        expect(storeProductsModalPage.getStatusFields().get(0).getText()).to.eventually.equal('Free');
      });

      it('should add a Product and open Widget Settings', function () {
        storeProductsModalPage.getStoreProducts().get(0).click();
        helper.wait(widgetSettingsPage.getWidgetModal(), 'Widget Settings Modal');
        browser.switchTo().frame('widget-modal-frame');

        expect(widgetSettingsPage.getCloseButton().isDisplayed()).to.eventually.be.true;
        expect(widgetSettingsPage.getTitle().getText()).to.eventually.equal('Image Settings');
      });

      it('should select Custom URL Option and update URL',function(){
        helper.clickWhenClickable(widgetSettingsPage.getImageWidgetCustomButton(), 'Custom URL');
        expect(widgetSettingsPage.getImageWidgetCustomButton().getAttribute('class')).to.eventually.contain('active');

        expect(widgetSettingsPage.getImageWidgetURLTextbox().isDisplayed()).to.eventually.be.true;

        widgetSettingsPage.getImageWidgetURLTextbox().clear();
        widgetSettingsPage.getImageWidgetURLTextbox().sendKeys('https://s3.amazonaws.com/Rise-Images/UI/logo.svg');
      });

      it('should save Item and add it to the list', function () {
        helper.clickWhenClickable(widgetSettingsPage.getSaveButton(), 'Widget Save Button');
        browser.switchTo().defaultContent();
        browser.waitForAngular();

        helper.waitDisappear(widgetSettingsPage.getWidgetModal(), 'Widget Settings Modal');

        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(1);
      });

      it('should not display store status for Free items', function () {
        expect(placeholderPlaylistPage.getItemStatusCells().count()).to.eventually.equal(0);
      });

    });

    describe('Should not Add a content playlist item if the user Cancels: ', function () {
      before('Click Add Widget: ', function () {
        placeholderPlaylistPage.getAddContentButton().click();
        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');

        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader()).then(function () {
          expect(storeProductsModalPage.getStoreProducts().count()).to.eventually.be.above(0);
        });
        storeProductsModalPage.getSearchInput().sendKeys('image widget');
        storeProductsModalPage.getSearchInput().sendKeys(protractor.Key.ENTER);
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader()).then(function () {
          expect(storeProductsModalPage.getStoreProducts().count()).to.eventually.be.above(0);
        });

        storeProductsModalPage.getStoreProducts().get(0).click();
        helper.wait(widgetSettingsPage.getWidgetModal(), 'Widget Settings Modal');
        browser.switchTo().frame('widget-modal-frame');
      });

      it('should Close Widget Settings',function(){
        helper.clickWhenClickable(widgetSettingsPage.getCloseButton(), 'Widget Close Button');
        browser.switchTo().defaultContent();
        browser.waitForAngular();

        helper.waitDisappear(widgetSettingsPage.getWidgetModal(), 'Widget Settings Modal');
      });

      it('should not add item to playlist', function () {
        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(1);
      });

    });

    describe('Should Add Widget by URL: ', function () {
      before('Click Add Widget by URL: ', function () {
        helper.wait(placeholderPlaylistPage.getAddContentButton(), 'Placeholder Playlist Page');

        placeholderPlaylistPage.getAddContentButton().click();
        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader());

        storeProductsModalPage.getAddWidgetByUrlButton().click();

        helper.wait(widgetByUrlModalPage.getAddWidgetByUrlModal(), 'Add Widget By URL Modal');
      });

      it('should close Store Products Modal', function () {
        expect(storeProductsModalPage.getStoreProductsModal().isPresent()).to.eventually.be.false;
      });

      it('should open the Add Widget By URL Modal', function () {
        expect(widgetByUrlModalPage.getAddWidgetByUrlModal().isDisplayed()).to.eventually.be.true;
      });

      it('should show modal title', function () {
        expect(widgetByUrlModalPage.getModalTitle().getText()).to.eventually.equal('Add Widget by URL');
      });

      it('should show input fields', function () {
        expect(widgetByUrlModalPage.getUrlInput().isDisplayed()).to.eventually.be.true;
        expect(widgetByUrlModalPage.getSettingsUrlInput().isDisplayed()).to.eventually.be.true;
      });

      it('should disable Apply', function () {
        expect(widgetByUrlModalPage.getApplyButton().isEnabled()).to.eventually.be.false;
      });

      it('should warn invalid url',function(){
        widgetByUrlModalPage.getUrlInput().sendKeys('abc');
        expect(widgetByUrlModalPage.getWarningInvalidUrl().isDisplayed()).to.eventually.be.true;
        expect(widgetByUrlModalPage.getApplyButton().isEnabled()).to.eventually.be.false;
      });

      it('should warn required',function(){
        widgetByUrlModalPage.getUrlInput().clear();
        expect(widgetByUrlModalPage.getWarningRequired().isDisplayed()).to.eventually.be.true;
        expect(widgetByUrlModalPage.getApplyButton().isEnabled()).to.eventually.be.false;
      });

      it('should enable Apply when url is present',function(){
        widgetByUrlModalPage.getUrlInput().sendKeys('http://www.risevision.com/');
        expect(widgetByUrlModalPage.getWarningRequired().isDisplayed()).to.eventually.be.false;
        expect(widgetByUrlModalPage.getWarningInvalidUrl().isDisplayed()).to.eventually.be.false;
        expect(widgetByUrlModalPage.getApplyButton().isEnabled()).to.eventually.be.true;
      });

      describe('Given the user adds a widget by url', function () {
        before(function () {
          widgetByUrlModalPage.getApplyButton().click();
        });
        it('should show the playlist item dialog', function () {
          helper.wait(playlistItemModalPage.getPlaylistItemModal(), 'Playlist Item Modal').then(function () {
            expect(widgetByUrlModalPage.getAddWidgetByUrlModal().isPresent()).to.eventually.be.false;

            expect(playlistItemModalPage.getPlaylistItemModal().isDisplayed()).to.eventually.be.true;
            expect(playlistItemModalPage.getModalTitle().getText()).to.eventually.equal('Edit Playlist Item');
            expect(playlistItemModalPage.getNameTextbox().getAttribute('value')).to.eventually.equal('Widget from URL');
          });
        });

        it('should save Item and add it to the list', function () {
          playlistItemModalPage.getSaveButton().click();

          expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
          expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(2);
        });
      });

    });

    describe('Should manage playlist items: ', function () {
      it('should duplicate first item', function() {
        placeholderPlaylistPage.getDuplicateButtons().get(0).click();

        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(3);
        expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain('Image Widget');
        expect(placeholderPlaylistPage.getItemNameCells().get(1).getText()).to.eventually.contain('Image Widget (1)');
      });

      it('items should move up and down by dragging', function() {
        expect(placeholderPlaylistPage.getItemDragHandles().get(0).isDisplayed()).to.eventually.be.true;
        expect(placeholderPlaylistPage.getItemDragHandles().get(1).isDisplayed()).to.eventually.be.true;

        //TODO: drag and drop simulation not working
        //Likely due to an issue logged here:
        //https://bugs.chromium.org/p/chromedriver/issues/detail?id=841
        // browser.actions()
        //   .click(placeholderPlaylistPage.getItemDragHandles().get(1).getWebElement())
        //   .dragAndDrop(
        //     placeholderPlaylistPage.getItemDragHandles().get(1).getWebElement(),
        //     { x: 0, y: -260 })
        //   .mouseUp()
        //   .perform();
        //
        // expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain('Image Widget (1)');
        // expect(placeholderPlaylistPage.getItemNameCells().get(1).getText()).to.eventually.contain('Image Widget');
        //
        // browser.actions()
        //   .click(placeholderPlaylistPage.getItemDragHandles().get(1).getWebElement())
        //   .dragAndDrop(
        //     placeholderPlaylistPage.getItemDragHandles().get(1).getWebElement(),
        //     { x: 0, y: -260 })
        //   .mouseUp()
        //   .perform();
        //
        // expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain('Image Widget');
        // expect(placeholderPlaylistPage.getItemNameCells().get(1).getText()).to.eventually.contain('Image Widget (1)');
      });

      it('should remove item', function (done) {
        placeholderPlaylistPage.getRemoveButtons().get(0).click();

        helper.clickWhenClickable(placeholderPlaylistPage.getRemoveItemButton(), "Remove Item Confirm Button").then(function () {
          expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(2);

          done();
        });
      });

      it('should open playlist item properties', function () {
        placeholderPlaylistPage.getEditPlaylistItemButtons().get(0).click();

        helper.wait(playlistItemModalPage.getPlaylistItemModal(), 'Playlist Item Settings Page');

        expect(playlistItemModalPage.getPlaylistItemModal().isDisplayed()).to.eventually.be.true;
        expect(playlistItemModalPage.getModalTitle().getText()).to.eventually.equal('Edit Playlist Item');
        expect(playlistItemModalPage.getNameTextbox().getAttribute('value')).to.eventually.contain('Image Widget');
      });

      it('should display store status in modal', function () {
        helper.wait(playlistItemModalPage.getStatusMessage(), 'Free');
        expect(playlistItemModalPage.getStatusMessage().getText()).to.eventually.equal('Free');
      });

      it('should close properties', function () {
        playlistItemModalPage.getSaveButton().click();

        // wait for transitions
        browser.sleep(500);

        expect(playlistItemModalPage.getPlaylistItemModal().isPresent()).to.eventually.be.false;
      });

    });
  });
};
module.exports = PlaylistScenarios;
