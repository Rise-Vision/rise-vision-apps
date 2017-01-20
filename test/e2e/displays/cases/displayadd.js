'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayAddModalPage = require('./../pages/displayAddModalPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayAddScenarios = function() {

  browser.driver.manage().window().setSize(1280, 960);
  describe("As a user signed in " +
    "I would like to add a display", function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var displaysListPage;
    var displayAddModalPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      displaysListPage = new DisplaysListPage();
      displayAddModalPage = new DisplayAddModalPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getDisplays();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');
      displaysListPage.getDisplayAddButton().click();
    });

    it('should show display add page', function () {
      helper.wait(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
      expect(displayAddModalPage.getDisplayNameField().isPresent()).to.eventually.be.true;
    });

    it('should show Next Button', function () {
      expect(displayAddModalPage.getNextButton().isPresent()).to.eventually.be.true;
      expect(displayAddModalPage.getNextButton().isEnabled()).to.eventually.be.false;
    });

    it('should show Dismiss Button', function () {
      expect(displayAddModalPage.getDismissButton().isPresent()).to.eventually.be.true;
    });

    it('should add display', function () {
      var displayName = 'TEST_E2E_DISPLAY';
      displayAddModalPage.getDisplayNameField().sendKeys(displayName);
      expect(displayAddModalPage.getNextButton().isEnabled()).to.eventually.be.true;
      displayAddModalPage.getNextButton().click();
      helper.waitDisappear(displayAddModalPage.getNextButton(), 'Next Button');
      expect(displayAddModalPage.getNextButton().isDisplayed()).to.eventually.be.false;
    });
    
    it('should show install instructions', function() {
      helper.wait(displayAddModalPage.getDownloadWindows64Button(), 'Download Button');
      expect(displayAddModalPage.getDownloadWindows64Button().isDisplayed()).to.eventually.be.true;
    });
    
    it('should close modal', function() {
      displayAddModalPage.getDismissButton().click();
      
      helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
    })

  });
};

module.exports = DisplayAddScenarios;
