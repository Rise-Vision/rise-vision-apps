'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayManagePage = require('./../pages/displayManagePage.js');
var DownloadPlayerModalPage = require('./../pages/downloadPlayerModalPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayManageScenarios = function() {

  browser.driver.manage().window().setSize(1280, 960);
  describe('Display Manage', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var displaysListPage;
    var displayManagePage;
    var downloadPlayerModalPage;
    var displayName;

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

      // Search for recently created Display
      displayName = 'TEST_E2E_DISPLAY ' + commonHeaderPage.getStageEnv();

      displaysListPage.searchDisplay(displayName);

      displaysListPage.getDisplayItems().first().element(by.tagName('td')).click();
    });

    describe('load', function() {
      it('should load display', function () {
        helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
        expect(displayManagePage.getDisplayNameField().isPresent()).to.eventually.be.true;
        expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal(displayName);
      });

      it('should show User Company Address Checkbox', function () {
        expect(displayManagePage.getDisplayUseCompanyAddressCheckbox().isPresent()).to.eventually.be.true;
      });

      it('should show Reboot Checkbox', function () {
        expect(displayManagePage.getDisplayRebootCheckbox().isPresent()).to.eventually.be.true;
      });

      it('should show the schedule link', function() {
        helper.wait(displayManagePage.getViewScheduleLink(), 'View Schedule Link');
        expect(displayManagePage.getViewScheduleLink().isDisplayed()).to.eventually.be.true;
      });
    });

    describe('display address', function() {
      it('should show address options', function(done) {
        displayManagePage.getDisplayUseCompanyAddressCheckbox().click();
        displayManagePage.getDisplayTimeZoneSelect().isDisplayed().then(function (isDisplayed) {
          if (!isDisplayed) {
            displayManagePage.getDisplayUseCompanyAddressCheckbox().click();
          }

          expect(displayManagePage.getDisplayCountrySelect().isDisplayed()).to.eventually.be.true;
          expect(displayManagePage.getDisplayTimeZoneSelect().isDisplayed()).to.eventually.be.true;

          done();
        });

      });

      it('should select country',function(done){
        browser.driver.executeScript('window.scrollTo(0,500);').then(function() {
          displayManagePage.getDisplayCountrySelect().element(by.cssContainingText('option', 'Canada')).click();
          expect(displayManagePage.getDisplayCountrySelect().$('option:checked').getText()).to.eventually.contain('Canada');

          done();
        });
      });

      it('should select timezone',function(){
        displayManagePage.getDisplayTimeZoneSelect().element(by.cssContainingText('option', 'Buenos Aires')).click();
        expect(displayManagePage.getDisplayTimeZoneSelect().$('option:checked').getText()).to.eventually.contain('Buenos Aires');
      });      
    });

    describe('update display', function() {
      it('should show Save Button', function () {
        expect(displayManagePage.getSaveButton().isPresent()).to.eventually.be.true;
      });

      it('should show Cancel Button', function () {
        expect(displayManagePage.getCancelButton().isPresent()).to.eventually.be.true;
      });

      it('should fail to save the display and show validation error', function () {
        helper.clickWhenClickable(displayManagePage.getSaveButton(), 'Save Button');
        helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
        expect(displayManagePage.getDisplayErrorBox().getText()).to.eventually.contain('Are you having problems validating your address?');
      });

      it('should select another country',function(){
        displayManagePage.getDisplayCountrySelect().element(by.cssContainingText('option', 'Argentina')).click();
        expect(displayManagePage.getDisplayCountrySelect().$('option:checked').getText()).to.eventually.contain('Argentina');
      });

      it('should rename the display', function() {
        expect(displayManagePage.getDisplayNameEditButton().isPresent()).to.eventually.be.true;
        expect(displayManagePage.getDisplayNameField().isEnabled()).to.eventually.be.false;

        displayManagePage.getDisplayNameEditButton().click();
        expect(displayManagePage.getDisplayNameField().isEnabled()).to.eventually.be.true;

        displayManagePage.getDisplayNameField().sendKeys('E2E DSIPLAY NEW NAME' + protractor.Key.ENTER);
        expect(displayManagePage.getDisplayNameField().isEnabled()).to.eventually.be.false;
        expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal('E2E DSIPLAY NEW NAME');

        displayManagePage.getDisplayNameEditButton().click();
        displayManagePage.getDisplayNameField().sendKeys(displayName + protractor.Key.ENTER);
        expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal(displayName);
      });

      it('should save the display and skip address validation', function () {
        displayManagePage.getSaveButton().click();
        helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
        expect(displayManagePage.getSaveButton().getText()).to.eventually.equal('Save');
      });

      it('should show correct timezone after reload',function(done){
        browser.refresh();
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
        helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');

        browser.driver.executeScript('window.scrollTo(0,500);').then(function() {
          expect(displayManagePage.getDisplayTimeZoneSelect().$('option:checked').getText()).to.eventually.contain('Buenos Aires');

          done();
        });
      });
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

        expect(downloadPlayerModalPage.getTitle().getText()).to.eventually.equal('Install Rise Player');
        
        expect(downloadPlayerModalPage.getDownloadWindows64Button().isDisplayed()).to.eventually.be.true;
      });

      it('should close modal',function() {
        helper.clickWhenClickable(downloadPlayerModalPage.getDismissButton(), 'Dismiss Button');

        helper.waitDisappear(downloadPlayerModalPage.getDownloadPlayerModal(), 'Download Player Modal');
        expect(downloadPlayerModalPage.getDownloadPlayerModal().isPresent()).to.eventually.be.false;
      });

    });

    describe('display actions', function() {
      it('should show the Player Actions button, which opens the Dropdown', function() {
        helper.wait(displayManagePage.getDisplayActionsButton(), 'Display Actions Button');

        expect(displayManagePage.getDisplayActionsButton().isDisplayed()).to.eventually.be.true;

        helper.clickWhenClickable(displayManagePage.getDisplayActionsButton(), 'Display Actions Button');
      });

      it('should show the Install Player button, which opens the Install Modal', function() {
        helper.wait(displayManagePage.getPurchasePlayerActionButton(), 'Purchase Player Action Button');
        
        expect(displayManagePage.getPurchasePlayerActionButton().isDisplayed()).to.eventually.be.true;
        expect(displayManagePage.getInstallPlayerActionButton().isDisplayed()).to.eventually.be.true;

        // Display modal and validate download button
        helper.clickWhenClickable(displayManagePage.getInstallPlayerActionButton(), 'Install Player Button');

        helper.wait(downloadPlayerModalPage.getDownloadPlayerModal(), 'Download Player Modal');

        expect(downloadPlayerModalPage.getDownloadPlayerModal().isDisplayed()).to.eventually.be.true;
      });

      it('should close the modal', function() {
        // Close the modal
        helper.wait(downloadPlayerModalPage.getDismissButton(), 'Dismiss Button');
        helper.clickWhenClickable(downloadPlayerModalPage.getDismissButton(), 'Dismiss Button');

        helper.waitDisappear(downloadPlayerModalPage.getDownloadPlayerModal(), 'Display Add Modal');
        expect(downloadPlayerModalPage.getDownloadPlayerModal().isPresent()).to.eventually.be.false;
      });
    });

    describe('delete', function() {
      it('should delete the display', function () {
        helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
        helper.wait(displayManagePage.getDeleteButton(), 'Display Delete Button');

        expect(displayManagePage.getDeleteButton().isPresent()).to.eventually.be.true;

        helper.clickWhenClickable(displayManagePage.getDeleteButton(), 'Display Delete Button');
      });

      it('should confirm deletion', function () {
        helper.wait(displayManagePage.getDeleteForeverButton(), 'Display Delete Forever Button');

        expect(displayManagePage.getDeleteForeverButton().isPresent()).to.eventually.be.true;
        helper.clickWhenClickable(displayManagePage.getDeleteForeverButton(), 'Display Delete Forever Button');

        helper.waitDisappear(displayManagePage.getDeleteForeverButton(), 'Display Delete Forever Button');
      });

      it('should return to displays page', function() {
        helper.wait(displaysListPage.getDisplaysListTable(), 'Displays List');

        expect(displaysListPage.getDisplaysListTable().isPresent()).to.eventually.be.true;
      });
    });
  });
};

module.exports = DisplayManageScenarios;
