'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var ScheduleAddPage = require('./../pages/scheduleAddPage.js');
var SharedScheduleModalPage = require('./../pages/sharedScheduleModalPage.js');
var helper = require('rv-common-e2e').helper;

var ScheduleAddScenarios = function() {
  browser.driver.manage().window().setSize(1920, 1080);

  describe('Schedule Add', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var schedulesListPage;
    var scheduleAddPage;
    var sharedScheduleModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      schedulesListPage = new SchedulesListPage();
      scheduleAddPage = new ScheduleAddPage();
      commonHeaderPage = new CommonHeaderPage();
      sharedScheduleModalPage = new SharedScheduleModalPage();

      homepage.getSchedules();
      signInPage.signIn();
      helper.waitDisappear(schedulesListPage.getLoader(),'Schedules loader');
      schedulesListPage.getScheduleAddButton().click();
    });

    it('should show schedule add page', function () {
      expect(scheduleAddPage.getScheduleNameField().isPresent()).to.eventually.be.true;
    });

    it('should not show Preview and Share Schedule buttons', function () {
      expect(scheduleAddPage.getPreviewButton().isDisplayed()).to.eventually.be.false;
      expect(scheduleAddPage.getShareScheduleButton().isDisplayed()).to.eventually.be.false;
    });

    it('should show Save Button', function () {
      expect(scheduleAddPage.getSaveButton().isPresent()).to.eventually.be.true;
    });

    it('should show Cancel Button', function () {
      expect(scheduleAddPage.getCancelButton().isPresent()).to.eventually.be.true;
    });

    xit('should rename schedule', function() {
      var scheduleName = 'TEST_E2E_SCHEDULE';
      scheduleAddPage.getScheduleNameField().sendKeys(scheduleName);
    });

    it('should add schedule', function () {
      scheduleAddPage.getSaveButton().click();
      helper.wait(scheduleAddPage.getDeleteButton(), 'Delete Button');
      helper.wait(scheduleAddPage.getShareScheduleButton(), 'Share Schedule Button');
      
      expect(scheduleAddPage.getDeleteButton().isDisplayed()).to.eventually.be.true;
      expect(scheduleAddPage.getPreviewButton().isDisplayed()).to.eventually.be.true;
      expect(scheduleAddPage.getShareScheduleButton().isDisplayed()).to.eventually.be.true;
    });

    xit('should save the Schedule on Enter pressed', function() {
      scheduleAddPage.getScheduleNameField().sendKeys(protractor.Key.ENTER);
      helper.waitForElementTextToChange(scheduleAddPage.getSaveButton(),'Save', 'Schedules Suve Button');
      expect(scheduleAddPage.getSaveButton().getText()).to.eventually.equal('Save');
    });

    describe('Share Schedule cases:', function() {
      it('should open Share Schedule modal', function() {
        scheduleAddPage.getShareScheduleButton().click();
        helper.wait(sharedScheduleModalPage.getSharedScheduleModal(), 'Shared Schedule Modal');

        expect(sharedScheduleModalPage.getSharedScheduleModal().isDisplayed()).to.eventually.be.true;
      });

      it('should show copy link button', function() {
        expect(sharedScheduleModalPage.getCopyLinkButton().isDisplayed()).to.eventually.be.true;
      });

      it('should navigate to Embed Code and show Copy Embed Code button', function() {
        sharedScheduleModalPage.getEmbedCodeTabLink().click();
        expect(sharedScheduleModalPage.getCopyEmbedCodeButton().isDisplayed()).to.eventually.be.true;
      });

      it('should navigate to Social Media and show sharing buttons', function() {
        sharedScheduleModalPage.getSocialMediaTabLink().click();
        expect(sharedScheduleModalPage.getTwitterShareButton().isDisplayed()).to.eventually.be.true;
      });

      it('should navigate to Chrome Extension and show Extension link', function() {
        sharedScheduleModalPage.getChromeExtensionTabLink().click();
        expect(sharedScheduleModalPage.getChromeExtensionLink().isDisplayed()).to.eventually.be.true;
        expect(sharedScheduleModalPage.getChromeExtensionLink().getAttribute('href')).to.eventually.equal('https://chrome.google.com/webstore/detail/rise-vision-anywhere/dkoohkdagjpgjheoaaegomjhdccfbcle');
      });

      it('should close Share Schedule modal', function() {
        sharedScheduleModalPage.getCloseButton().click();

        expect(sharedScheduleModalPage.getSharedScheduleModal().isPresent()).to.eventually.be.false; 
      });
    });

    after(function () {
      helper.clickWhenClickable(scheduleAddPage.getDeleteButton(), 'Display Delete Button').then(function () {
        helper.clickWhenClickable(scheduleAddPage.getDeleteForeverButton(), 'Display Delete Forever Button').then(function () {
        });
      });
    });
  });
};
module.exports = ScheduleAddScenarios;
