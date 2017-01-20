'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var ScheduleAddPage = require('./../pages/scheduleAddPage.js');
var helper = require('rv-common-e2e').helper;
var PresentationModalPage = require('./../pages/presentationModalPage.js');
var PlaylistItemModalPage = require('./../pages/playlistItemModalPage.js');
var PlaylistPage = require('./../pages/playlistPage.js');

var AddPresentationScenarios = function() {


  describe("In order to have presentation on a schedule " +
    "As a user signed in " +
    "I would like to add presentations to a schedule ", function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var schedulesListPage;
    var scheduleAddPage;
    var presentationModalPage;
    var playlistItemModalPage;
    var playlistPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      schedulesListPage = new SchedulesListPage();
      scheduleAddPage = new ScheduleAddPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationModalPage = new PresentationModalPage();
      playlistItemModalPage = new PlaylistItemModalPage();
      playlistPage = new PlaylistPage();

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
        it('should show presentation on the Add Playlist Item list', function () {
          expect(scheduleAddPage.getAddPresentationItemButton().isDisplayed()).to.eventually.be.true;
        });

        it('should presentation button have a Presentation text', function () {
          expect(scheduleAddPage.getAddPresentationItemButton().getText()).to.eventually.equal('Presentation');
        });

        describe('Given a user clicks on the Presentation button', function () {
          before(function () {
            scheduleAddPage.getAddPresentationItemButton().click();
            helper.wait(presentationModalPage.getAddPresentationModal(), 'Add Presentation Modal');
          });

          it('should open the Add Presentation Modal', function () {
            expect(presentationModalPage.getAddPresentationModal().isDisplayed()).to.eventually.be.true;
          });

          it('should show modal title', function () {

            expect(presentationModalPage.getModalTitle().getText()).to.eventually.equal('Select Presentation');
          });

          it('should show a search box', function () {
            expect(presentationModalPage.getPresentationSearchInput().isDisplayed()).to.eventually.be.true;
          });

          it('should show a table for listing presentations', function () {
            expect(presentationModalPage.getPresentationListTable().isDisplayed()).to.eventually.be.true;
          });

          it('should show presentations', function () {
            //wait for spinner to go away.
            browser.wait(function () {
              return presentationModalPage.getPresentationListLoader().isDisplayed().then(function (result) {
                return !result
              });
            }, 20000);

            expect(presentationModalPage.getPresentationItems().get(0).isPresent()).to.eventually.be.true;
            expect(presentationModalPage.getPresentationItems().count()).to.eventually.be.above(0);

          });

          describe('Given the user chooses a presentation', function () {
            var presentationItemName;
            before(function () {
              presentationModalPage.getPresentationNames().get(0).getText().then(function (text) {
                presentationItemName = text;
                presentationModalPage.getPresentationItems().get(0).click();
              });
            });
            it('should show the playlist item dialog', function () {
              helper.wait(playlistItemModalPage.getPlaylistItemModal(), 'Playlist Item Modal').then(function () {
                expect(playlistItemModalPage.getPlaylistItemModal().isDisplayed()).to.eventually.be.true;
                expect(playlistItemModalPage.getModalTitle().getText()).to.eventually.equal('Add Playlist Item');
                expect(playlistItemModalPage.getNameTextbox().getAttribute('value')).to.eventually.equal(presentationItemName);
                helper.wait(playlistItemModalPage.getPresentationNameField(), 'Playlist Item Modal').then(function () {
                  expect(playlistItemModalPage.getPresentationNameField().getText()).to.eventually.equal(presentationItemName);
                });
              });
            });

            it('should add the playlist item', function () {
              playlistItemModalPage.getSaveButton().click();

              expect(scheduleAddPage.getPlaylistItems().get(0).isDisplayed()).to.eventually.be.true;
              expect(playlistPage.getPresentationNameCell().get(0).getText()).to.eventually.equal(presentationItemName);
            });
          });

        });
      });
    });
  });
};
module.exports = AddPresentationScenarios;
