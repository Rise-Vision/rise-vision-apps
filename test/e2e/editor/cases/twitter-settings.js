'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var PlaceholderPlaylistPage = require('./../pages/placeholderPlaylistPage.js');
var StoreProductsModalPage = require('./../pages/storeProductsModalPage.js');
var PlansModalPage = require('./../../common/pages/plansModalPage.js');
var TwitterSettingsPage = require('./../pages/twitterSettingsPage.js');

var helper = require('rv-common-e2e').helper;

var TwitterSettingsScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Twitter Settings', function () {
    var subCompanyName = 'E2E TEST SUBCOMPANY';
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var placeholderPlaylistPage;
    var storeProductsModalPage;
    var plansModalPage;
    var twitterSettingsPage;

    function loadEditor() {
      homepage.getEditor();
      signInPage.signIn();
    }

    function createSubCompany() {
      commonHeaderPage.createSubCompany(subCompanyName);
    }

    function selectSubCompany() {
      commonHeaderPage.selectSubCompany(subCompanyName);
    }

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholderPlaylistPage = new PlaceholderPlaylistPage();
      storeProductsModalPage = new StoreProductsModalPage();
      plansModalPage = new PlansModalPage();
      twitterSettingsPage = new TwitterSettingsPage();

      loadEditor();
      createSubCompany();
      selectSubCompany();
    });

    after(function() {
      loadEditor();
      commonHeaderPage.deleteAllSubCompanies();
    });

    before('Add Presentation & Placeholder: ', function () {
      presentationsListPage.openNewPresentation();

      helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

      browser.sleep(500);

    });

    describe('Should lock Twitter Widget when not on a Plan: ', function() {
      before(function () {
        placeholderPlaylistPage.getAddContentButton().click();
        helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
      });

      it('should show Professional widgets', function () {
        helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader());

        expect(storeProductsModalPage.getProfessionalWidgets().count()).to.eventually.be.above(0);
      });

      it('should show Locked Widget', function() {
        expect(storeProductsModalPage.getUnlockButton().count()).to.eventually.be.above(0);
        expect(storeProductsModalPage.getAddProfessionalWidgetButton().count()).to.eventually.equal(0);
        expect(storeProductsModalPage.getPromotionTrialButton().count()).to.eventually.be.above(0);
        expect(storeProductsModalPage.getDisplaysListLink().count()).to.eventually.equal(0);
      });

      it('should show Plans Modal', function() {
        storeProductsModalPage.getUnlockButton().get(0).click();

        helper.wait(plansModalPage.getPlansModal(), 'Plans Modal');
        helper.wait(plansModalPage.getStartTrialBasicButton(), 'Basic Plan Start Trial');
      });

      it('should start a Trial',function(){
        plansModalPage.getStartTrialBasicButton().click();

        helper.waitDisappear(plansModalPage.getPlansModal(), 'Plans Modal');
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

      it('should set a twitter screen name and save closes the modal', function() {
        twitterSettingsPage.getTwitterScreenName().sendKeys('risevision');
        twitterSettingsPage.getSaveButton().click();

        helper.waitDisappear(twitterSettingsPage.getTwitterSettingsModal());
      });

      it('should be visible on the placeholder list', function() {
        expect(placeholderPlaylistPage.getPlaylistItems().count()).to.eventually.equal(1);
      });

      it('should display the current screen name', function() {
        placeholderPlaylistPage.getItemNameCells().get(0).click();
        
        helper.wait(twitterSettingsPage.getTwitterSettingsModal(), 'Twitter Settings Modal');

        expect(twitterSettingsPage.getTwitterScreenName().getAttribute('value')).to.eventually.equal('risevision');
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

      it('should revoke user authentication', function() {
        twitterSettingsPage.getRevokeLink().click();

        helper.waitDisappear(twitterSettingsPage.getRevokeLink(), 'Revoke Button');
        helper.wait(twitterSettingsPage.getConnectButton(), 'Connect Button');

        expect(twitterSettingsPage.getConnectButton().isDisplayed()).to.eventually.be.equal(true);
      });
    });

  });
};
module.exports = TwitterSettingsScenarios;
