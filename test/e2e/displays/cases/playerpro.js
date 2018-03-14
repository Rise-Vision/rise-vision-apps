'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var SignInPage = require('./../../launcher/pages/signInPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayManagePage = require('./../pages/displayManagePage.js');
var DisplayAddModalPage = require('./../pages/displayAddModalPage.js');
var PlayerProInfoModalPage = require('./../pages/playerProInfoModalPage.js');
var helper = require('rv-common-e2e').helper;

var FirstSigninScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Player Professional', function () {
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var displayAddModalPage;
    var displaysListPage;
    var displayManagePage;
    var playerProInfoModalPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      displayAddModalPage = new DisplayAddModalPage();
      displaysListPage = new DisplaysListPage();
      displayManagePage = new DisplayManagePage();
      playerProInfoModalPage = new PlayerProInfoModalPage();
    });

    describe('Given a user that just signed up for Rise Vision', function () {

      before(function () {
        homepage.getDisplays();
        signInPage.signIn();
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
        displaysListPage.getDisplayItems().first().element(by.tagName('td')).click();
        helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
        expect(displayManagePage.getDisplayNameField().isPresent()).to.eventually.be.true;
        expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal('TEST_E2E_DISPLAY');
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
