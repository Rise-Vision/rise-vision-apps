'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayManagePage = require('./../pages/displayManagePage.js');
var helper = require('rv-common-e2e').helper;

var DisplayListScenarios = function() {

  browser.driver.manage().window().setSize(1024, 768);
  describe('Display Bulk Delete', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var displaysListPage;
    var displayManagePage;
    var displayName;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      displaysListPage = new DisplaysListPage();
      displayManagePage = new DisplayManagePage();
    });

    describe('Given user sign in', function () {

      before(function () {
        homepage.getDisplays();
        signInPage.signIn();
        helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');

        displayName = 'TEST_E2E_DISPLAY ' + commonHeaderPage.getStageEnv();

        displaysListPage.deleteDisplayIfExists();

        helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');
        displaysListPage.getDisplayAddButton().click();
        displayManagePage.addTestDisplay();

        homepage.getDisplays();
        helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');
      });

      it('should show test display', function () {
        displaysListPage.searchDisplay(displayName);

        expect(displaysListPage.getDisplayItems().count()).to.eventually.equal(1);
      });

      it('should allow selecting test display', function() {
        expect(displaysListPage.getFirstRowCheckbox().isDisplayed()).to.eventually.be.true;
      });

      it('should show bulk actions bar when display is selected', function() {
        //double check display name before deleting to prevent e2e issues
        expect(displaysListPage.getFirstRowName().getText()).to.eventually.equal(displayName);

        expect(displaysListPage.getBulkActionsDropdown().isDisplayed()).to.eventually.be.false;
        helper.clickWhenClickable(displaysListPage.getFirstRowCheckbox());

        helper.wait(displaysListPage.getBulkActionsDropdown(),'Bulk Actions Dropdown');

        expect(displaysListPage.getBulkActionsDropdown().isDisplayed()).to.eventually.be.true;
      });

      it('should show click delete action', function() {
        helper.clickWhenClickable(displaysListPage.getBulkActionsDropdown());
        browser.sleep(500);

        helper.wait(displaysListPage.getDeleteDisplayBulkAction(),'Bulk Delete Action');

        expect(displaysListPage.getDeleteDisplayBulkAction().isDisplayed()).to.eventually.be.true;

        helper.clickWhenClickable(displaysListPage.getDeleteDisplayBulkAction());
      });

      it('should show bulk delete confirmation modal', function() {
        helper.wait(displaysListPage.getDeleteDisplayFailsafeField(), 'Bulk Delete Confirmation');

        expect(displaysListPage.getDeleteDisplayConfirmButton().isDisplayed()).to.eventually.be.true;
        expect(displaysListPage.getDeleteDisplayConfirmButton().isEnabled()).to.eventually.be.false;
        expect(displaysListPage.getDeleteDisplayFailsafeField().isDisplayed()).to.eventually.be.true;
      });

      it('should receive failsafe input and enter key and trigger delete', function() {
        displaysListPage.getDeleteDisplayFailsafeField().sendKeys('1' + protractor.Key.ENTER);

        helper.wait(displaysListPage.getBulkActionsProgressBar(),'Bulk Actions Progress Bar');
        expect(displaysListPage.getBulkActionsProgressBar().isDisplayed()).to.eventually.be.true;
      });

      it('should hide bulk actions progress bar when finished', function() {
        helper.waitDisappear(displaysListPage.getBulkActionsProgressBar(),'Bulk Actions Progress Bar');
        expect(displaysListPage.getBulkActionsProgressBar().isDisplayed()).to.eventually.be.false;
      });

      it('should no longer show the deleted display', function() {
        browser.sleep(500);

        expect(displaysListPage.getDisplayItems().count()).to.eventually.equal(0);
      });
    });
  });
};

module.exports = DisplayListScenarios;
