'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var ScheduleAddPage = require('./../pages/scheduleAddPage.js');
var helper = require('rv-common-e2e').helper;
var PlaylistItemModalPage = require('./../pages/playlistItemModalPage.js');

var AddUrlScenarios = function() {
  browser.driver.manage().window().setSize(1920, 1080);

  describe('Add URL', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var schedulesListPage;
    var scheduleAddPage;
    var playlistItemModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      schedulesListPage = new SchedulesListPage();
      scheduleAddPage = new ScheduleAddPage();
      commonHeaderPage = new CommonHeaderPage();
      playlistItemModalPage = new PlaylistItemModalPage();

      homepage.getSchedules();
      signInPage.signIn();
      helper.waitDisappear(schedulesListPage.getLoader(),'Schedules loader');
    });

    describe(' Given a user is adding a new schedule ', function () {
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
            browser.sleep(500);
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

          describe('Given the user enters an invalid URL', function () {
            it('should show an invalid URL error',function(){
              playlistItemModalPage.getUrlInput().sendKeys('http://');
              browser.sleep(500); //wait for input debounce
              expect(playlistItemModalPage.getInvalidUrlMessage().isDisplayed()).to.eventually.be.true;
            });

            it('Save button should be disabled', function () {
              expect(playlistItemModalPage.getSaveButton().isEnabled()).to.eventually.be.false;
            });
          });

          describe('Given the user enters a blank URL', function () {
            it('should show a required field error',function(){
              playlistItemModalPage.getUrlInput().clear();
              browser.sleep(500);
              expect(playlistItemModalPage.getRequiredFieldMessage().isDisplayed()).to.eventually.be.true;
              expect(playlistItemModalPage.getInvalidUrlMessage().isPresent()).to.eventually.be.false;
            });

            it('Save button should be disabled', function () {
              expect(playlistItemModalPage.getSaveButton().isEnabled()).to.eventually.be.false;
            });
          });

          describe('Given the user enters an insecure url', function () {
            it('should show an insecure URL message',function(){
              playlistItemModalPage.getUrlInput().sendKeys('http://risevision.com/');
              browser.sleep(500);
              expect(playlistItemModalPage.getInsecureUrlMessage().isDisplayed()).to.eventually.be.true;
            });

            xit('Save button should be disabled', function () {
              expect(playlistItemModalPage.getSaveButton().isEnabled()).to.eventually.be.false;
            });
          });

          describe('Given the user enters a non-reachable URL', function () {
            it('should show a non-reachable error',function(){
              playlistItemModalPage.getUrlInput().clear();
              playlistItemModalPage.getUrlInput().sendKeys('https://risevision.com/non-existing-content.html');
              helper.wait(playlistItemModalPage.getNonReacheableUrlMessage());
              expect(playlistItemModalPage.getNonReacheableUrlMessage().isDisplayed()).to.eventually.be.true;
            });

            it('Save button should be disabled', function () {
              expect(playlistItemModalPage.getSaveButton().isEnabled()).to.eventually.be.false;
            });
          });

          describe('Given the user enters a valid URL', function () {
            before(function () {
              playlistItemModalPage.getUrlInput().clear();
              playlistItemModalPage.getUrlInput().sendKeys('https://risevision.com/');
              browser.sleep(500);
            });
            it('Save button should be enabled', function () {
              expect(playlistItemModalPage.getSaveButton().isEnabled()).to.eventually.be.true;
              expect(playlistItemModalPage.getRequiredFieldMessage().isPresent()).to.eventually.be.false;
              expect(playlistItemModalPage.getInvalidUrlMessage().isPresent()).to.eventually.be.false;
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
