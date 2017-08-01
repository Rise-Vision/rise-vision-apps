'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayManagePage = require('./../pages/displayManagePage.js');
var DisplayAddModalPage = require('./../pages/displayAddModalPage.js');
var PlayerProTrialModalPage = require('./../pages/playerProTrialModalPage.js');
var helper = require('rv-common-e2e').helper;

var FirstSigninScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe("Rise Player Professional", function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var displayAddModalPage;
    var displaysListPage;
    var displayManagePage;
    var playerProTrialModalPage;
    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      displayAddModalPage = new DisplayAddModalPage();
      displaysListPage = new DisplaysListPage();
      displayManagePage = new DisplayManagePage();
      playerProTrialModalPage = new PlayerProTrialModalPage();
    });

    describe("Given a user that just signed up for Rise Vision", function () {

      before(function () {
        homepage.getDisplays();
        loginPage.signIn();
        var subCompanyName = 'E2E TEST SUBCOMPANY';
        commonHeaderPage.createSubCompany(subCompanyName);
        commonHeaderPage.selectSubCompany(subCompanyName);
        helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');
        displaysListPage.getDisplayAddButton().click();   
      });

      it('should add display', function () {
        var displayName = 'TEST_E2E_DISPLAY';
        displayAddModalPage.getDisplayNameField().sendKeys(displayName);
        expect(displayAddModalPage.getNextButton().isEnabled()).to.eventually.be.true;
        displayAddModalPage.getNextButton().click();
        helper.waitDisappear(displayAddModalPage.getNextButton(), 'Next Button');
        expect(displayAddModalPage.getNextButton().isDisplayed()).to.eventually.be.false;
      });

      it('should show install instructions and close modal', function() {
        helper.wait(displayAddModalPage.getDownloadWindows64Button(), 'Download Button');
        expect(displayAddModalPage.getDownloadWindows64Button().isDisplayed()).to.eventually.be.true;
        displayAddModalPage.getDismissButton().click();
        
        helper.waitDisappear(displayAddModalPage.getDisplayAddModal(), 'Display Add Modal');
      });
      
      it('should select the display',function(){
        helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');
        displaysListPage.getDisplayItems().first().element(by.tagName("td")).click();
        helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
        expect(displayManagePage.getDisplayNameField().isPresent()).to.eventually.be.true;
        expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal('TEST_E2E_DISPLAY');
      });

      it('should show Start Player Pro Trial button',function(){
        helper.wait(displayManagePage.getPlayerProTrialButton(), 'Player Pro Trial Button');
        expect(displayManagePage.getPlayerProTrialButton().isDisplayed()).to.eventually.be.true;
      });

      it('should show start trial modal',function(){
        displayManagePage.getPlayerProTrialButton().click();
        helper.wait(playerProTrialModalPage.getPlayerProTrialModal(), 'Player Pro Trial Modal');
        expect(playerProTrialModalPage.getPlayerProTrialModal().isDisplayed()).to.eventually.be.true;
        expect(playerProTrialModalPage.getStartTrialButton().isDisplayed()).to.eventually.be.true;
      });

      it('should start trial and show subscribe button',function(){
        playerProTrialModalPage.getStartTrialButton().click();
        helper.waitDisappear(playerProTrialModalPage.getPlayerProTrialModal(), 'Player Pro Trial Modal');

        helper.wait(displayManagePage.getSubscribePlayerProButton(), 'Subscribe Player Pro Button');
        expect(displayManagePage.getSubscribePlayerProButton().isDisplayed()).to.eventually.be.true;
        expect(displayManagePage.getSubscribePlayerProButton().getAttribute('href')).to.eventually.contain('https://store.risevision.com/product/2048/?cid=');
      });

      it('should show correct subscription status',function(){
        expect(displayManagePage.getSubscriptionStatusBar().isDisplayed()).to.eventually.be.true;
        expect(displayManagePage.getSubscriptionStatusBar().getText()).to.eventually.equal('29 days remaining on your trial Subscribe Now!');
      });

      it('removes current SubCompany',function(){
        commonHeaderPage.deleteCurrentCompany();
      });

      after(function() {
        commonHeaderPage.deleteAllSubCompanies();
      });
    });
  });
};
module.exports = FirstSigninScenarios;
