'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayAddModalPage = require('./../pages/displayAddModalPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayAddScenarios = function() {

  browser.driver.manage().window().setSize(1280, 960);
  describe('Display Add', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var displaysListPage;
    var displayAddModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      displaysListPage = new DisplaysListPage();
      displayAddModalPage = new DisplayAddModalPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getDisplays();
      signInPage.signIn();
      helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');

      displaysListPage.deleteDisplayIfExists();

      displaysListPage.getDisplayAddButton().click();
    });

    it('should show display add page', function () {
      helper.wait(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
      expect(displayAddModalPage.getDisplayAddModal().isDisplayed()).to.eventually.be.true;

      expect(displayAddModalPage.getDisplayNameField().isPresent()).to.eventually.be.true;

      browser.sleep(100);
      expect(displayAddModalPage.getTitle().getText()).to.eventually.equal('Create New Display');
    });

    it('should show Next Button', function () {
      expect(displayAddModalPage.getNextButton().isPresent()).to.eventually.be.true;
      expect(displayAddModalPage.getNextButton().isEnabled()).to.eventually.be.false;
    });

    it('should show Dismiss Button', function () {
      expect(displayAddModalPage.getDismissButton().isPresent()).to.eventually.be.true;
    });

    it('should add display', function () {
      var displayName = 'TEST_E2E_DISPLAY ' + commonHeaderPage.getStageEnv();
      displayAddModalPage.getDisplayNameField().sendKeys(displayName);
      expect(displayAddModalPage.getNextButton().isEnabled()).to.eventually.be.true;
      displayAddModalPage.getNextButton().click();
    });

    it('should show display activation instructions', function() {
      helper.wait(displayAddModalPage.getDisplayAddedPage(), 'Display Added page');

      expect(displayAddModalPage.getDisplayAddedPage().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getPreconfiguredPlayerButton().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getOwnPlayerButton().isDisplayed()).to.eventually.be.true;
    });

    it('should show instructions on how to configure Own Media Player', function() {
      displayAddModalPage.getOwnPlayerButton().click();
      displayAddModalPage.getNextButton().click();

      helper.wait(displayAddModalPage.getUserPlayerPage(), 'User Player page');      
      expect(displayAddModalPage.getUserPlayerPage().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getPickWindowsLink().isDisplayed()).to.eventually.be.true;
    });

    it('should show activation instructions', function() {
      displayAddModalPage.getPickWindowsLink().click();

      helper.wait(displayAddModalPage.getDownloadWindows64Button(), 'Download Windoes 64 link'); 

      expect(displayAddModalPage.getDownloadWindows64Button().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getDisplayIdField().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getDisplayIdField().getText()).to.eventually.have.length.greaterThan(0);

      expect(displayAddModalPage.getEmailedInstructions().isDisplayed()).to.eventually.be.true;
    });

    it('should show instructions on how order the Preconfigured Media Player', function() {
      displayAddModalPage.getPreviousButton().click();
      displayAddModalPage.getPreviousButton().click();

      helper.wait(displayAddModalPage.getDisplayAddedPage(), 'Display Added page');
      
      displayAddModalPage.getPreconfiguredPlayerButton().click();
      displayAddModalPage.getNextButton().click();

      helper.wait(displayAddModalPage.getPreconfiguredPlayerPage(), 'Preconfigured Player page');

      expect(displayAddModalPage.getPreconfiguredPlayerPage().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getPurchasePlayerLink().isDisplayed()).to.eventually.be.true;

      expect(displayAddModalPage.getDisplayIdField().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getDisplayIdField().getText()).to.eventually.have.length.greaterThan(0);

      expect(displayAddModalPage.getEmailedInstructions().isDisplayed()).to.eventually.be.true;
    });
    
    it('should close modal', function() {
      displayAddModalPage.getDismissButton().click();
      
      helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
    })

  });
};

module.exports = DisplayAddScenarios;
