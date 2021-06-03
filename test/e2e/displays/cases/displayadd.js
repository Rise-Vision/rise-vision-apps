'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayManagePage = require('./../pages/displayManagePage.js');
var DownloadPlayerModalPage = require('./../pages/downloadPlayerModalPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayAddScenarios = function() {

  browser.driver.manage().window().setSize(1280, 960);
  describe('Display Add', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var displaysListPage;
    var downloadPlayerModalPage;
    var displayManagePage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      displaysListPage = new DisplaysListPage();
      displayManagePage = new DisplayManagePage();
      downloadPlayerModalPage = new DownloadPlayerModalPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getDisplays();
      signInPage.signIn();
      helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');

      displaysListPage.deleteDisplayIfExists();

      displaysListPage.getDisplayAddButton().click();
    });

    it('should show display add page', function () {
      helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
      expect(displayManagePage.getDisplayNameField().isPresent()).to.eventually.be.true;
      expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal('New Display');
    });

    it('should rename the display', function() {
      var displayName = 'TEST_E2E_DISPLAY ' + commonHeaderPage.getStageEnv();

      expect(displayManagePage.getDisplayNameEditButton().isPresent()).to.eventually.be.true;
      expect(displayManagePage.getDisplayNameField().isEnabled()).to.eventually.be.false;

      displayManagePage.getDisplayNameEditButton().click();
      expect(displayManagePage.getDisplayNameField().isEnabled()).to.eventually.be.true;

      displayManagePage.getDisplayNameField().sendKeys(displayName + protractor.Key.ENTER);
      expect(displayManagePage.getDisplayNameField().isEnabled()).to.eventually.be.false;
      expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal(displayName);
    });
    
    it('should show Save Button', function () {
      expect(displayManagePage.getSaveButton().isPresent()).to.eventually.be.true;
    });

    it('should show Cancel Button', function () {
      expect(displayManagePage.getCancelButton().isPresent()).to.eventually.be.true;
    });

    it('should add display', function () {
      displayManagePage.getSaveButton().click();

      helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
      expect(displayManagePage.getSaveButton().getText()).to.eventually.equal('Save');
    });

    it('should show the delete button', function() {
      helper.wait(displayManagePage.getDeleteButton(), 'Display Delete Button');

      expect(displayManagePage.getDeleteButton().isPresent()).to.eventually.be.true;
    });

    describe('display activation', function() {
      it('should show the Display instructions', function() {
        helper.wait(displayManagePage.getDisplayInstructionsPanel(), 'Display Instructions Panel');
        expect(displayManagePage.getDisplayInstructionsPanel().isDisplayed()).to.eventually.be.true;

        expect(displayManagePage.getPurchasePlayerButton().isDisplayed()).to.eventually.be.true;
        expect(displayManagePage.getInstallPlayerButton().isDisplayed()).to.eventually.be.true;
      });

      it('should show Download options',function() {
        helper.clickWhenClickable(displayManagePage.getInstallPlayerButton(), 'Install Player Button');

        helper.wait(downloadPlayerModalPage.getDownloadPlayerModal(), 'Download Player Modal');
        
        expect(downloadPlayerModalPage.getDownloadPlayerModal().isDisplayed()).to.eventually.be.true;

        expect(downloadPlayerModalPage.getTitle().getText()).to.eventually.equal('Install Rise Player on:');
        
        expect(downloadPlayerModalPage.getInstallWindowsLink().isDisplayed()).to.eventually.be.true;
      });

      it('should close modal',function() {
        helper.clickWhenClickable(downloadPlayerModalPage.getDismissButton(), 'Dismiss Button');

        helper.waitDisappear(downloadPlayerModalPage.getDownloadPlayerModal(), 'Download Player Modal');
        expect(downloadPlayerModalPage.getDownloadPlayerModal().isPresent()).to.eventually.be.false;
      });

    });

  });
};

module.exports = DisplayAddScenarios;
