'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var ScheduleAddPage = require('./../pages/scheduleAddPage.js');
var PlaylistItemModalPage = require('./../pages/playlistItemModalPage.js');
var ShareSchedulePopoverPage = require('./../pages/shareSchedulePopoverPage.js');
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
    var shareSchedulePopoverPage;
    var playlistItemModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      schedulesListPage = new SchedulesListPage();
      scheduleAddPage = new ScheduleAddPage();
      commonHeaderPage = new CommonHeaderPage();
      shareSchedulePopoverPage = new ShareSchedulePopoverPage();
      playlistItemModalPage = new PlaylistItemModalPage();

      homepage.getSchedules();
      signInPage.signIn();
      helper.waitDisappear(schedulesListPage.getLoader(),'Schedules loader');
      schedulesListPage.getScheduleAddButton().click();
    });

    it('should show schedule add page', function () {
      expect(scheduleAddPage.getScheduleNameField().isPresent()).to.eventually.be.true;
    });

    it('should not show Share Schedule buttons', function () {
      expect(scheduleAddPage.getShareScheduleButton().isDisplayed()).to.eventually.be.false;
    });

    it('should show Save Button', function () {
      expect(scheduleAddPage.getSaveButton().isPresent()).to.eventually.be.true;
    });

    it('should show Cancel Button', function () {
      expect(scheduleAddPage.getCancelButton().isPresent()).to.eventually.be.true;
    });

    // Share button won't show without a Playlist Item
    it('should add a playlist item', function() {
      // wait for transitions
      browser.sleep(500);

      scheduleAddPage.getAddPlaylistItemButton().click();
      scheduleAddPage.getAddUrlItemButton().click();

      playlistItemModalPage.getUrlInput().sendKeys('https://risevision.com/');
      playlistItemModalPage.getSaveButton().click();

      expect(scheduleAddPage.getPlaylistItems().count()).to.eventually.equal(1);
    });

    it('should add schedule', function () {
      scheduleAddPage.getSaveButton().click();
      helper.wait(scheduleAddPage.getDeleteButton(), 'Delete Button');
      helper.wait(scheduleAddPage.getShareScheduleButton(), 'Share Schedule Button');
      
      expect(scheduleAddPage.getDeleteButton().isDisplayed()).to.eventually.be.true;
      expect(scheduleAddPage.getShareScheduleButton().isDisplayed()).to.eventually.be.true;
    });

    it('should rename schedule', function() {
      expect(scheduleAddPage.getScheduleNameField().getAttribute('value')).to.eventually.equal('New Schedule');
      expect(scheduleAddPage.getScheduleNameField().isEnabled()).to.eventually.be.false;
      expect(scheduleAddPage.getScheduleNameEditButton().isPresent()).to.eventually.be.true;

      scheduleAddPage.getScheduleNameEditButton().click();
      expect(scheduleAddPage.getScheduleNameField().isEnabled()).to.eventually.be.true;

      var scheduleName = 'TEST_E2E_SCHEDULE';
      scheduleAddPage.getScheduleNameField().sendKeys(scheduleName + protractor.Key.ENTER);

      expect(scheduleAddPage.getScheduleNameField().isEnabled()).to.eventually.be.false;
      expect(scheduleAddPage.getScheduleNameField().getAttribute('value')).to.eventually.equal(scheduleName);
    });

    it('should save the Schedule', function() {
      scheduleAddPage.getSaveButton().click();
      helper.waitForElementTextToChange(scheduleAddPage.getSaveButton(),'Save', 'Schedules Save Button');
      expect(scheduleAddPage.getSaveButton().getText()).to.eventually.equal('Save');
    });

    describe('Share Schedule cases:', function() {
      before(function(){
        // Workaround as protactor seems to get stuck
        // on waitForAngular
        browser.ignoreSynchronization = true;
      });

      it('should open Share Schedule modal', function() {
        scheduleAddPage.getShareScheduleButton().click();
        helper.wait(shareSchedulePopoverPage.getShareSchedulePopover(), 'Shared Schedule Modal');

        expect(shareSchedulePopoverPage.getShareSchedulePopover().isDisplayed()).to.eventually.be.true;
      });

      it('should show copy link button', function() {
        expect(shareSchedulePopoverPage.getCopyLinkButton().isDisplayed()).to.eventually.be.true;
      });

      it('should provide a link accepted by Rise Chrome Extension', function() {
        //It needs to use widgets.risevision.com subdomain to be accepted by Rise Chrome Extension. In case it ever changes again, we need to update it in both places.
        expect(shareSchedulePopoverPage.getCopyLinkInput().getAttribute('value')).to.eventually.contain('https://widgets.risevision.com/');
      });

      it('should show Social Media sharing buttons', function() {
        expect(shareSchedulePopoverPage.getTwitterShareButton().isDisplayed()).to.eventually.be.true;
      });

      it('should navigate to Embed Code and show Copy Embed Code button', function() {
        shareSchedulePopoverPage.getEmbedCodeTabLink().click();
        expect(shareSchedulePopoverPage.getCopyEmbedCodeButton().isDisplayed()).to.eventually.be.true;
        expect(shareSchedulePopoverPage.getGoBackButton().isDisplayed()).to.eventually.be.true;
      });

      it('should navigate back to main tab', function() {
        shareSchedulePopoverPage.getGoBackButton().click()
        expect(shareSchedulePopoverPage.getCopyLinkButton().isDisplayed()).to.eventually.be.true;
      });

      it('should navigate to Chrome Extension and show Extension link', function() {
        shareSchedulePopoverPage.getChromeExtensionTabLink().click();
        expect(shareSchedulePopoverPage.getChromeExtensionLink().isDisplayed()).to.eventually.be.true;
        expect(shareSchedulePopoverPage.getChromeExtensionLink().getAttribute('href')).to.eventually.equal('https://chrome.google.com/webstore/detail/rise-vision-anywhere/dkoohkdagjpgjheoaaegomjhdccfbcle');
      });

      it('should close Share Schedule modal', function() {
        shareSchedulePopoverPage.getCloseButton().click();

        expect(shareSchedulePopoverPage.getShareSchedulePopover().isPresent()).to.eventually.be.false; 
      });

      after(function(){
        //revert workaround
        browser.ignoreSynchronization = false;
      });
    });

    after(function () {
      helper.clickWhenClickable(scheduleAddPage.getDeleteButton(), 'Schedule Delete Button').then(function () {
        helper.clickWhenClickable(scheduleAddPage.getDeleteForeverButton(), 'Schedule Delete Forever Button').then(function () {
        });
      });
    });
  });
};
module.exports = ScheduleAddScenarios;
