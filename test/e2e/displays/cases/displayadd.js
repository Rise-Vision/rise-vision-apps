'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../pages/homepage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayAddPage = require('./../pages/displayAddPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayAddScenarios = function() {

  browser.driver.manage().window().setSize(1280, 960);
  describe("In order to manage displays " +
    "As a user signed in " +
    "I would like to add displays", function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var commonHeaderPage;
    var displaysListPage;
    var displayAddPage;

    before(function () {
      homepage = new HomePage();
      displaysListPage = new DisplaysListPage();
      displayAddPage = new DisplayAddPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.get();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        commonHeaderPage.signin();
      });
      displaysListPage.getDisplayAddButton().click();
    });

    it('should show display add page', function () {
      expect(displayAddPage.getDisplayNameField().isPresent()).to.eventually.be.true;
    });

    it('should show Status Select button', function () {
      expect(displayAddPage.getDisplayStatusSelect().isPresent()).to.eventually.be.true;
    });

    it('should show User Company Address Checkbox', function () {
      expect(displayAddPage.getDisplayUseCompanyAddressCheckbox().isPresent()).to.eventually.be.true;
    });

    it('should show Reboot Checkbox', function () {
      expect(displayAddPage.getDisplayRebootCheckbox().isPresent()).to.eventually.be.true;
    });

    it('should show Time Selector', function () {
      expect(displayAddPage.getDisplayHoursField().isPresent()).to.eventually.be.true;
      expect(displayAddPage.getDisplayMinutesField().isPresent()).to.eventually.be.true;
      expect(displayAddPage.getDisplayMeridianButton().isPresent()).to.eventually.be.true;
    });

    it('should show Save Button', function () {
      expect(displayAddPage.getSaveButton().isPresent()).to.eventually.be.true;
    });

    it('should show Cancel Button', function () {
      expect(displayAddPage.getCancelButton().isPresent()).to.eventually.be.true;
    });

    it('should add display', function () {
      var displayName = 'TEST_E2E_DISPLAY';
      displayAddPage.getDisplayNameField().sendKeys(displayName);
      displayAddPage.getSaveButton().click();
      helper.wait(displayAddPage.getDeleteButton(), 'Delete Button');
      expect(displayAddPage.getDeleteButton().isDisplayed()).to.eventually.be.true;
    });

    after(function () {
      helper.clickWhenClickable(displayAddPage.getDeleteButton(), "Display Delete Button").then(function () {
        helper.clickWhenClickable(displayAddPage.getDeleteForeverButton(), "Display Delete Forever Button").then(function () {
        });
      });
    });
  });
};

module.exports = DisplayAddScenarios;
