'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayManagePage = require('./../pages/displayManagePage.js');
var helper = require('rv-common-e2e').helper;

var DisplayAddScenarios = function() {

  browser.driver.manage().window().setSize(1280, 960);
  describe("As a user signed in " +
    "I would like to manage a display", function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var displaysListPage;
    var displayManagePage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      displaysListPage = new DisplaysListPage();
      displayManagePage = new DisplayManagePage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getDisplays();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      helper.waitDisappear(displaysListPage.getDisplaysLoader(), 'Displays loader');
      displaysListPage.getDisplayItems().get(0).click();
    });

    it('should load display', function () {
      helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
      expect(displayManagePage.getDisplayNameField().isPresent()).to.eventually.be.true;
      expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal('TEST_E2E_DISPLAY');
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
    
    it('should show download buttons', function() {
      helper.wait(displayManagePage.getDownloadWindows64Button(), 'Download Button');
      expect(displayManagePage.getDownloadWindows64Button().isDisplayed()).to.eventually.be.true;
    });
    
    it('should show address options', function(done) {
      displayManagePage.getDisplayUseCompanyAddressCheckbox().click();
      displayManagePage.getDisplayTimeZoneSelect().isDisplayed().then(function (isDisplayed) {
        if (!isDisplayed) {
          displayManagePage.getDisplayUseCompanyAddressCheckbox().click();
        }
        
        expect(displayManagePage.getDisplayTimeZoneSelect().isDisplayed()).to.eventually.be.true;
        
        done();
      });      

    });
    
    it('should select timezone',function(done){
      browser.driver.executeScript('window.scrollTo(0,500);').then(function() {
        displayManagePage.getDisplayTimeZoneSelect().element(by.cssContainingText('option', 'Buenos Aires')).click();
        expect(displayManagePage.getDisplayTimeZoneSelect().$('option:checked').getText()).to.eventually.contain('Buenos Aires');
        
        done();        
      })
    });

    it('should show Save Button', function () {
      expect(displayManagePage.getSaveButton().isPresent()).to.eventually.be.true;
    });

    it('should show Cancel Button', function () {
      expect(displayManagePage.getCancelButton().isPresent()).to.eventually.be.true;
    });

    it('should save the display', function () {
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

    it('should delete the display', function (done) {
      helper.clickWhenClickable(displayManagePage.getDeleteButton(), "Display Delete Button").then(function () {
        helper.clickWhenClickable(displayManagePage.getDeleteForeverButton(), "Display Delete Forever Button").then(function () {
          helper.wait(displaysListPage.getDisplaysAppContainer(), 'Displays List');
          
          done();
        });
      });
    });
  });
};

module.exports = DisplayAddScenarios;
