'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var ScheduleAddPage = require('./../pages/scheduleAddPage.js');
var helper = require('rv-common-e2e').helper;
var PlaylistItemModalPage = require('./../pages/playlistItemModalPage.js');

var AddUrlScenarios = function() {


  describe("Add URL to a schedule " +
    "As a user signed in " +
    "I would like to add URLs to a schedule ", function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var schedulesListPage;
    var scheduleAddPage;
    var playlistItemModalPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      schedulesListPage = new SchedulesListPage();
      scheduleAddPage = new ScheduleAddPage();
      commonHeaderPage = new CommonHeaderPage();
      playlistItemModalPage = new PlaylistItemModalPage();

      homepage.getSchedules();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      helper.waitDisappear(schedulesListPage.getLoader(),'Schedules loader');
    });

    describe(" Given a user is adding a new schedule ", function () {
      before(function () {
        schedulesListPage.getScheduleAddButton().click();
      });

      describe('Given a user clicks on the Add Playlist Item Button', function () {
        before(function () {
          scheduleAddPage.getAddPlaylistItemButton().click();
        });
        it('should show url on the Add Playlist Item list', function () {
          expect(scheduleAddPage.getAddUrlItemButton().isDisplayed()).to.eventually.be.true;
        });

        it('should presentation button have a url text', function () {
          expect(scheduleAddPage.getAddUrlItemButton().getText()).to.eventually.equal('URL');
        });

        describe('Given a user clicks on the url button', function () {
          before(function () {
            scheduleAddPage.getAddUrlItemButton().click();
            helper.wait(playlistItemModalPage.getPlaylistItemModal(), 'Add URL Item');
          });

          it('should open the Add URL Modal', function () {
            expect(playlistItemModalPage.getPlaylistItemModal().isDisplayed()).to.eventually.be.true;
          });

          it('should show modal title', function () {
            expect(playlistItemModalPage.getModalTitle().getText()).to.eventually.equal('Add Playlist Item');
          });

          it('should show a URL text box', function () {
            expect(playlistItemModalPage.getUrlInput().isDisplayed()).to.eventually.be.true;
          });

          it('should show the Storage selector', function () {
            expect(playlistItemModalPage.getStorageSelectorIcon().isDisplayed()).to.eventually.be.true;
          });

          it('Save button should be disabled', function () {
            expect(playlistItemModalPage.getSaveButton().isEnabled()).to.eventually.be.false;
          });

          describe('Given the user enters a URL', function () {
            before(function () {
              playlistItemModalPage.getUrlInput().sendKeys('http://risevision.com/content.html');
            });
            it('Save button should be enabled', function () {
              expect(playlistItemModalPage.getSaveButton().isEnabled()).to.eventually.be.true;
            });
            it('should add the url item to the Playlist', function () {
              playlistItemModalPage.getSaveButton().click();

              expect(scheduleAddPage.getPlaylistItems().get(0).isDisplayed()).to.eventually.be.true;
            });
          });

        });
      });
    });
  });
};
module.exports = AddUrlScenarios;