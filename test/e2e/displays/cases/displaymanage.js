'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayManagePage = require('./../pages/displayManagePage.js');
var DisplayAddModalPage = require('./../pages/displayAddModalPage.js');
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
    var displayAddModalPage;
    var displayName;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      displaysListPage = new DisplaysListPage();
      displayManagePage = new DisplayManagePage();
      displayAddModalPage = new DisplayAddModalPage();
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

      it('should show Time Selector', function () {
        expect(displayManagePage.getDisplayHoursField().isPresent()).to.eventually.be.true;
        expect(displayManagePage.getDisplayMinutesField().isPresent()).to.eventually.be.true;
        expect(displayManagePage.getDisplayMeridianButton().isPresent()).to.eventually.be.true;
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
        expect(displayManagePage.getDisplayErrorBox().getText()).to.eventually.contain('We couldn\'t update your address.');
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
      it('should show the Not Activated Display link, which opens the Display Modal', function() {
        helper.wait(displayManagePage.getNotActivatedPlayerLink(), 'Not Activated Display link');
        expect(displayManagePage.getNotActivatedPlayerLink().isDisplayed()).to.eventually.be.true;

        // Display modal and validate download button
        helper.clickWhenClickable(displayManagePage.getNotActivatedPlayerLink(), 'Not Activated Display link');

        helper.wait(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');

        expect(displayAddModalPage.getDisplayAddModal().isDisplayed()).to.eventually.be.true;

        browser.sleep(100);
        expect(displayAddModalPage.getTitle().getText()).to.eventually.equal('Activate your Display');

      });

      it('should allow users to pick Media Player option',function() {
        helper.wait(displayAddModalPage.getDisplayAddedPage(), 'User Player page');

        expect(displayAddModalPage.getDisplayAddedPage().isDisplayed()).to.eventually.be.true;
        expect(displayAddModalPage.getPreconfiguredPlayerButton().isDisplayed()).to.eventually.be.true;
        expect(displayAddModalPage.getOwnPlayerButton().isDisplayed()).to.eventually.be.true;
      });

      it('should show Display Id but hide the Email Instructions', function() {
        displayAddModalPage.getPreconfiguredPlayerButton().click();
        displayAddModalPage.getNextButton().click();

        helper.wait(displayAddModalPage.getPreconfiguredPlayerPage(), 'Preconfigured Player page');

        expect(displayAddModalPage.getDisplayIdField().isDisplayed()).to.eventually.be.true;
        expect(displayAddModalPage.getDisplayIdField().getText()).to.eventually.have.length.greaterThan(0);

        expect(displayAddModalPage.getEmailedInstructions().isPresent()).to.eventually.be.true;      
      });

      it('should close the modal', function() {
        // Close the modal
        helper.wait(displayAddModalPage.getDismissButton(), 'Dismiss Button');
        helper.clickWhenClickable(displayAddModalPage.getDismissButton(), 'Dismiss Button');

        helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
        expect(displayAddModalPage.getDisplayAddModal().isPresent()).to.eventually.be.false;
      });
    });

    describe('install player', function() {
      it('should show the Install Player button, which opens the Display Modal', function() {
        helper.wait(displayManagePage.getInstallPlayerButton(), 'Install Player Button');
        expect(displayManagePage.getInstallPlayerButton().isDisplayed()).to.eventually.be.true;

        // Display modal and validate download button
        helper.clickWhenClickable(displayManagePage.getInstallPlayerButton(), 'Install Player Button');

        helper.wait(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');

        expect(displayAddModalPage.getDisplayAddModal().isDisplayed()).to.eventually.be.true;

        browser.sleep(100);
        expect(displayAddModalPage.getTitle().getText()).to.eventually.equal('Activate your Display');
      });

      it('should close the modal', function() {
        // Close the modal
        helper.wait(displayAddModalPage.getDismissButton(), 'Dismiss Button');
        helper.clickWhenClickable(displayAddModalPage.getDismissButton(), 'Dismiss Button');

        helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
        expect(displayAddModalPage.getDisplayAddModal().isPresent()).to.eventually.be.false;
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
