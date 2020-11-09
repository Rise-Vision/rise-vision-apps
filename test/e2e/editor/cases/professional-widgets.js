'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var PlaceholderPlaylistPage = require('./../pages/placeholderPlaylistPage.js');
var StoreProductsModalPage = require('./../pages/storeProductsModalPage.js');
var PricingPage = require('./../../registration/pages/pricingPage.js');
var PresentationItemModalPage = require('./../pages/presentationItemModalPage.js');
var PresentationModalPage = require('./../../schedules/pages/presentationModalPage.js');
var TwitterSettingsPage = require('./../pages/twitterSettingsPage.js');

var helper = require('rv-common-e2e').helper;

var ProfessionalWidgetsScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  xdescribe('Professional Widgets', function () {
    var subCompanyName = 'E2E TEST SUBCOMPANY - PROFESSIONAL WIDGETS';
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var placeholderPlaylistPage;
    var storeProductsModalPage;
    var pricingPage;
    var presentationItemModalPage;
    var presentationModalPage;
    var twitterSettingsPage;

    function loadEditor() {
      homepage.getEditor();
      signInPage.signIn();
    }

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholderPlaylistPage = new PlaceholderPlaylistPage();
      storeProductsModalPage = new StoreProductsModalPage();
      pricingPage = new PricingPage();
      presentationItemModalPage = new PresentationItemModalPage();
      presentationModalPage = new PresentationModalPage();
      twitterSettingsPage = new TwitterSettingsPage();

      loadEditor();
      commonHeaderPage.createUnsubscribedSubCompany(subCompanyName);
      commonHeaderPage.selectSubCompany(subCompanyName);
    });

    after(function() {
      loadEditor();
      commonHeaderPage.deleteCurrentCompany(subCompanyName);
    });

    before('Add a Blank Presentation: ', function() {
      presentationsListPage.openNewPresentation();

      helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

      browser.sleep(500);

      helper.clickWhenClickable(workspacePage.getSaveButton(), 'Save Button');

      commonHeaderPage.getPresentationsMenuItem().click();
    });

    before('Open New Presentation & Add Placeholder: ', function () {
      presentationsListPage.openNewPresentation();

      helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

      browser.sleep(500);
    });

    describe('Should lock Professional Widgets when not on a Plan: ', function() {
      before(function () {
        placeholderPlaylistPage.getAddContentButton().click();
        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
      });

      it('should show Professional widgets', function () {
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader());

        expect(storeProductsModalPage.getProfessionalWidgets().count()).to.eventually.be.above(0);
        
        expect(storeProductsModalPage.getProfessionalWidgetNames().get(0).getText()).to.eventually.contain('Twitter Widget');
        expect(storeProductsModalPage.getProfessionalWidgetNames().get(1).getText()).to.eventually.contain('Embedded Presentation');
      });

      it('should show Locked Widget', function() {
        expect(storeProductsModalPage.getUnlockButton().count()).to.eventually.be.above(0);
        expect(storeProductsModalPage.getAddProfessionalWidgetButton().count()).to.eventually.equal(0);
        expect(storeProductsModalPage.getPromotionTrialButton().count()).to.eventually.be.above(0);
        expect(storeProductsModalPage.getDisplaysListLink().count()).to.eventually.equal(0);
      });

      it('should show Plans Modal', function() {
        storeProductsModalPage.getUnlockButton().get(0).click();

        helper.wait(pricingPage.getSubscribeButton(), 'Subscribe Button');
      });

      it('should start a Trial',function(){
        pricingPage.getSubscribeButton().click();

        helper.waitDisappear(pricingPage.getSubscribeButton(), 'Subscribe Button Disappear');
      });

      it('should unlock Professional Widgets', function() {
        expect(storeProductsModalPage.getUnlockButton().count()).to.eventually.equal(0);
        expect(storeProductsModalPage.getAddProfessionalWidgetButton().count()).to.eventually.be.above(0);
        expect(storeProductsModalPage.getPromotionTrialButton().count()).to.eventually.equal(0);
        expect(storeProductsModalPage.getDisplaysListLink().count()).to.eventually.be.above(0);
      });
    });
    
    describe('Should Add a Twitter widget: ', function () {

      before('Click Add Twitter Widget: ', function () {
        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');

        storeProductsModalPage.getAddProfessionalWidgetButton().get(0).click();

        helper.wait(twitterSettingsPage.getTwitterSettingsModal(), 'Twitter Settings Modal');
      });

      it('should open the Twitter Settings Modal and show screen name and buttons', function () {
        expect(twitterSettingsPage.getTwitterSettingsModal().isDisplayed()).to.eventually.be.true;

        expect(twitterSettingsPage.getTwitterScreenName().isDisplayed()).to.eventually.be.true;
        expect(twitterSettingsPage.getSaveButton().isDisplayed()).to.eventually.be.true;
        expect(twitterSettingsPage.getCancelButton().isDisplayed()).to.eventually.be.true;
      });

      it('should have save button disabled', function(){
        expect(twitterSettingsPage.getSaveButton().isEnabled()).to.eventually.be.false;
      });
      
    });

    xdescribe('should authenticate user: ', function() {
      var mainWindowHandle, newWindowHandle;
      it('should check if revoke is active', function() {
        twitterSettingsPage.getRevokeLink().click().then(function(present) {
          expect(twitterSettingsPage.getConnectButton().isDisplayed()).to.eventually.be.equal(true);
        }, function(err) {
          expect(twitterSettingsPage.getConnectButton().isDisplayed()).to.eventually.be.equal(true);
        });        
      });

      it('should click connect button', function(done) {
        twitterSettingsPage.getConnectButton().click().then(function () {
          browser.sleep(2000);

          browser.getAllWindowHandles().then(function (handles) {
            expect(handles).to.have.length(2);

            mainWindowHandle = handles[0];
            newWindowHandle = handles[1]; // this is the twitter login window

            done();
          });
        });
      });
      
      it('should wait for window to load', function(done) {
        browser.switchTo().window(newWindowHandle).then(function () {
          
          // this wait until the twitter login window finishs loading completely.
          browser.wait(function(){
            return browser.executeScript('return jQuery.active;').then(function (text) {
              return text === 0;
            });          
          });

          done();
        });
      });

      it('should log in user to Twitter', function(done) {
        browser.driver.findElement(by.id('username_or_email')).sendKeys(browser.params.twitter.user);
        browser.driver.findElement(by.id('password')).sendKeys(browser.params.twitter.pass);
        browser.driver.findElement(by.id('allow')).click();

        // NOTE: Window will not close if 'Verify your Identity' page shows
        browser.wait(function() {
          return browser.getAllWindowHandles().then(function (handles) {
            return handles.length === 1;
          });
        }, 5000);

        browser.switchTo().window(mainWindowHandle).then(done);
      });
      
      it('should show Revoke button', function(done) {
        helper.waitDisappear(twitterSettingsPage.getConnectButton(), 'Connect Button');
        helper.wait(twitterSettingsPage.getRevokeLink(), 'Revoke Button');

        expect(twitterSettingsPage.getRevokeLink().isDisplayed()).to.eventually.be.equal(true);
      });

    });

    xdescribe('Should save twitter settings: ', function() {

      it('should set a twitter screen name and save closes the modal', function() {
        twitterSettingsPage.getTwitterScreenName().sendKeys('risevision');
        twitterSettingsPage.getSaveButton().click();

        helper.waitDisappear(twitterSettingsPage.getTwitterSettingsModal());
      });

      it('should be visible on the placeholder list', function() {
        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(1);
        expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain('Twitter Widget');
      });

      it('should display the current screen name', function() {
        placeholderPlaylistPage.getItemNameCells().get(0).click();
        
        helper.wait(twitterSettingsPage.getTwitterSettingsModal(), 'Twitter Settings Modal');

        expect(twitterSettingsPage.getTwitterScreenName().getAttribute('value')).to.eventually.equal('risevision');
      });

    });

    xdescribe('Should revoke auth: ', function() {

      it('should revoke user authentication', function() {
        twitterSettingsPage.getRevokeLink().click();

        helper.waitDisappear(twitterSettingsPage.getRevokeLink(), 'Revoke Button');
        helper.wait(twitterSettingsPage.getConnectButton(), 'Connect Button');

        expect(twitterSettingsPage.getConnectButton().isDisplayed()).to.eventually.be.equal(true);
      });

    });

    describe('Should close Twitter Settings: ', function() {

      it('Cancel should Close Twitter Settings',function() {
        twitterSettingsPage.getCancelButton().click();

        helper.waitDisappear(twitterSettingsPage.getTwitterSettingsModal());
        
        expect(twitterSettingsPage.getTwitterSettingsModal().isPresent()).to.eventually.be.false;
      });

    });

    describe('Should Add a Embedded Presentation: ', function () {
      var presentationItemName;

      before('Click Add Embedded Presentation: ', function () {
        placeholderPlaylistPage.getAddContentButton().click();
        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');

        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader()).then(function () {
          expect(storeProductsModalPage.getStoreProducts().count()).to.eventually.be.above(0);
        });
      });

      it('should not show Embedded Presentation as a Store Product', function() {
        storeProductsModalPage.getSearchInput().sendKeys('embedded presentation');
        storeProductsModalPage.getSearchInput().sendKeys(protractor.Key.ENTER);
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader());
        
        expect(storeProductsModalPage.getStoreProducts().count()).to.eventually.be.equal(0);
      });

      it('should add Embedded Presentation as a Professional Widget', function() {        
        storeProductsModalPage.getAddProfessionalWidgetButton().get(0).click();

        helper.wait(presentationModalPage.getAddPresentationModal(), 'Add Presentation Modal');
      });

      it('should open the Add Presentation Modal and show presentations', function () {
        expect(presentationModalPage.getAddPresentationModal().isDisplayed()).to.eventually.be.true;

        //wait for spinner to go away.
        browser.wait(function () {
          return presentationModalPage.getPresentationListLoader().isDisplayed().then(function (result) {
            return !result;
          });
        }, 20000);

        expect(presentationModalPage.getPresentationItems().get(0).isPresent()).to.eventually.be.true;
        expect(presentationModalPage.getPresentationItems().count()).to.eventually.be.above(0);
      });

      it('should select the first Presentation and remember the name', function () {
        presentationModalPage.getPresentationNames().get(0).getText().then(function (text) {
          presentationItemName = text;
          presentationModalPage.getPresentationItems().get(0).click();
          
          helper.waitDisappear(presentationModalPage.getAddPresentationModal(), 'Add Presentation Modal');
        });
      });

      it('should show the Presentation item settings dialog', function () {
        helper.wait(presentationItemModalPage.getPresentationItemModal(), 'Presentation Settings Modal').then(function () {
          expect(presentationItemModalPage.getPresentationItemModal().isDisplayed()).to.eventually.be.true;
          expect(presentationItemModalPage.getModalTitle().getText()).to.eventually.equal('Embedded Presentation Settings');
        });
      });
      
      it('should toggle to Presentation Id text box', function() {
        expect(presentationItemModalPage.getPresentationIdTextBox().isDisplayed()).to.eventually.be.false;
        
        presentationItemModalPage.getEnterPresentationIdButton().click().then(function() {
          expect(presentationItemModalPage.getPresentationIdTextBox().isDisplayed()).to.eventually.be.true;
        });
      });

      it('should Close Presentation Settings and add Item',function(){
        helper.clickWhenClickable(presentationItemModalPage.getSaveButton(), 'Presentation Seetings Save Button');

        helper.waitDisappear(presentationItemModalPage.getPresentationItemModal(), 'Presentation Settings Modal');
        
        expect(presentationItemModalPage.getPresentationItemModal().isPresent()).to.eventually.be.false;

        // if we re-enable the Twitter Settings e2e the playListItem count should be 2.
        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(1);
        expect(placeholderPlaylistPage.getItemNameCells().get(0).getText()).to.eventually.contain(presentationItemName);
      });
    });

  });
};
module.exports = ProfessionalWidgetsScenarios;
