'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('./../../../../web/bower_components/common-header/test/e2e/pages/commonHeaderPage.js');
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
      displaysListPage.getDisplayAddButton().click();
    });

    it('should show display add page', function () {
      helper.wait(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
      expect(displayAddModalPage.getDisplayAddModal().isDisplayed()).to.eventually.be.true;

      expect(displayAddModalPage.getDisplayNameField().isPresent()).to.eventually.be.true;

      browser.sleep(100);
      expect(displayAddModalPage.getTitle().getText()).to.eventually.equal('Add a Display');
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
      helper.waitDisappear(displayAddModalPage.getNextButton(), 'Next Button');
      expect(displayAddModalPage.getNextButton().isPresent()).to.eventually.be.false;
    });

    it('should show display activation instructions', function() {
      helper.wait(displayAddModalPage.getDisplayAddedPage(), 'Display Added page');

      expect(displayAddModalPage.getDisplayAddedPage().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getPreconfiguredPlayerPanel().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getUserPlayerPanel().isDisplayed()).to.eventually.be.true;
    });

    it('should show instructions on how to configure Own Media Player', function() {
      displayAddModalPage.getUserPlayerPanel().click();

      helper.wait(displayAddModalPage.getUserPlayerPage(), 'User Player page');

      expect(displayAddModalPage.getUserPlayerPage().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getPreconfiguredPlayerLink().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getDownloadWindows64Button().isDisplayed()).to.eventually.be.true;

      expect(displayAddModalPage.getDisplayIdField().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getDisplayIdField().getAttribute('value')).to.eventually.have.length.greaterThan(0);

      expect(displayAddModalPage.getEmailedInstructions().isDisplayed()).to.eventually.be.true;
    });

    it('should show instructions on how order the Preconfigured Media Player', function() {
      displayAddModalPage.getPreconfiguredPlayerLink().click();

      helper.wait(displayAddModalPage.getPreconfiguredPlayerPage(), 'Preconfigured Player page');

      expect(displayAddModalPage.getPreconfiguredPlayerPage().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getPurchasePlayerLink().isDisplayed()).to.eventually.be.true;

      expect(displayAddModalPage.getDisplayIdField().isDisplayed()).to.eventually.be.true;
      expect(displayAddModalPage.getDisplayIdField().getAttribute('value')).to.eventually.have.length.greaterThan(0);

      expect(displayAddModalPage.getEmailedInstructions().isDisplayed()).to.eventually.be.true;
    });
    
    it('should close modal', function() {
      displayAddModalPage.getDismissButton().click();
      
      helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
    })

  });
};

module.exports = DisplayAddScenarios;
