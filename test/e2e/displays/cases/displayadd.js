'use strict';
var expect = require('rv-common-e2e').expect;
var url = require('url');
var https = require('https');
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var DisplaysListPage = require('./../pages/displaysListPage.js');
var DisplayManagePage = require('./../pages/displayManagePage.js');
var DownloadPlayerModalPage = require('./../pages/downloadPlayerModalPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayAddScenarios = function() {

  browser.driver.manage().window().setSize(1280, 960);
  describe('Display Add', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var displaysListPage;
    var downloadPlayerModalPage;
    var displayManagePage;

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

      displaysListPage.deleteDisplayIfExists();

      displaysListPage.getDisplayAddButton().click();
    });

    it('should show display add page', function () {
      helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
      expect(displayManagePage.getDisplayNameField().isPresent()).to.eventually.be.true;
      expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal('New Display');
    });

    it('should rename the display', function() {
      var displayName = 'TEST_E2E_DISPLAY ' + commonHeaderPage.getStageEnv();

      expect(displayManagePage.getDisplayNameEditButton().isPresent()).to.eventually.be.true;
      expect(displayManagePage.getDisplayNameField().isEnabled()).to.eventually.be.false;

      displayManagePage.getDisplayNameEditButton().click();
      expect(displayManagePage.getDisplayNameField().isEnabled()).to.eventually.be.true;

      displayManagePage.getDisplayNameField().sendKeys(displayName + protractor.Key.ENTER);
      expect(displayManagePage.getDisplayNameField().isEnabled()).to.eventually.be.false;
      expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.equal(displayName);
    });
    
    it('should show Save Button', function () {
      expect(displayManagePage.getSaveButton().isPresent()).to.eventually.be.true;
    });

    it('should show Cancel Button', function () {
      expect(displayManagePage.getCancelButton().isPresent()).to.eventually.be.true;
    });

    it('should add display', function () {
      displayManagePage.getSaveButton().click();

      helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');
      expect(displayManagePage.getSaveButton().getText()).to.eventually.equal('Save');
    });

    it('should show the delete button', function() {
      helper.wait(displayManagePage.getDeleteButton(), 'Display Delete Button');

      expect(displayManagePage.getDeleteButton().isPresent()).to.eventually.be.true;
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
        
        expect(downloadPlayerModalPage.getDownloadWindows32Link().isDisplayed()).to.eventually.be.true;
      });

      it('should provide HTTPS download links to prevent browsers block',function() {
        expect(downloadPlayerModalPage.getDownloadWindows32Link().getAttribute('href')).to.eventually.match(/^https:/);
        expect(downloadPlayerModalPage.getDownloadWindows64Link().getAttribute('href')).to.eventually.match(/^https:/);

        expect(downloadPlayerModalPage.getDownloadUbuntu32Link().getAttribute('href')).to.eventually.match(/^https:/);
        expect(downloadPlayerModalPage.getDownloadUbuntu64Link().getAttribute('href')).to.eventually.match(/^https:/);

        expect(downloadPlayerModalPage.getDownloadRaspberryLink().getAttribute('href')).to.eventually.match(/^https:/);
      });

      it('should provide working download links',function() {
        downloadPlayerModalPage.getDownloadWindows32Link().getAttribute('href').then(function(href) {
          var httpHeadRequest = function() {
            var defer = protractor.promise.defer();
            const options = {
              hostname: url.parse(href).hostname,
              port: 443,
              path: url.parse(href).path,
              method: 'HEAD',
            }
            https.request(options, function(response) {
              defer.fulfill(response.statusCode);
            }).on('error', function(e) {
              defer.reject('Request failed: ' + e.message);
            }).end();
            return defer.promise;
          };

          protractor.promise.controlFlow().execute(httpHeadRequest).then(function (statusCode) {
              expect(statusCode).to.equal(200);
          });
        });

      });

      it('should close modal',function() {
        helper.clickWhenClickable(downloadPlayerModalPage.getDismissButton(), 'Dismiss Button');

        helper.waitDisappear(downloadPlayerModalPage.getDownloadPlayerModal(), 'Download Player Modal');
        expect(downloadPlayerModalPage.getDownloadPlayerModal().isPresent()).to.eventually.be.false;
      });

    });

  });
};

module.exports = DisplayAddScenarios;
