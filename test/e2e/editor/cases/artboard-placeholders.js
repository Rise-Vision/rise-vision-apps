'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var ArtboardPage = require('./../pages/artboardPage.js');
var PlaceholdersListPage = require('./../pages/placeholdersListPage.js');
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var helper = require('rv-common-e2e').helper;

var ArtboardPlaceholdersScenarios = function() {
  browser.driver.manage().window().setSize(1920, 1080);
  describe('Select placeholders in artboard: ', function () {
    this.timeout(10000);// to allow for protactor to load the seperate page
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var artboardPage;
    var placeholdersListPage;
    var presentationPropertiesModalPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      artboardPage = new ArtboardPage();
      placeholdersListPage = new PlaceholdersListPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
    });

    describe(' Given a user is adding a new presentation and a new placeholder', function () {
      before(function () {
        homepage.getEditor();
        //wait for spinner to go away.
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
          loginPage.signIn();
        });
        presentationsListPage.openNewPresentation();
        presentationPropertiesModalPage.getCancelButton().click();

        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');
      });

        it('should show the placeholder', function () {
          expect(artboardPage.getPlaceholderContainer().isDisplayed()).to.eventually.be.true;
        });

        it('should select placeholder after adding it', function () {
          expect(artboardPage.getPlaceholderContainer().getAttribute('class')).to.eventually.contain('edit-mode');
        });

        it('should deselect by clicking outside the placeholder', function (done) {
          artboardPage.getPlaceholderContainer().getSize().then(function (size) {
            browser.actions().mouseMove(artboardPage.getPlaceholderContainer(), {x: size.width - 10, y: size.height + 20}).click().perform();
            expect(artboardPage.getPlaceholderContainer().getAttribute('class')).to.eventually.not.contain('edit-mode');
            done();
          });
        });

        it('should not deselect by clicking the placeholder', function (done) {
          artboardPage.getPlaceholderContainer().getSize().then(function (size) {
            browser.actions().mouseMove(artboardPage.getPlaceholderContainer(), {x: size.width - 10, y: size.height - 10}).click().perform();
            expect(artboardPage.getPlaceholderContainer().getAttribute('class')).to.eventually.contain('edit-mode');
            browser.actions().mouseMove(artboardPage.getPlaceholderContainer(), {x: size.width - 10, y: size.height - 10}).click().perform();
            expect(artboardPage.getPlaceholderContainer().getAttribute('class')).to.eventually.contain('edit-mode');
            done();
          });
        });

        it('should move placeholder', function () {
          artboardPage.getPlaceholderContainer().getLocation().then(function (initialLocation) {
            artboardPage.getPlaceholderContainer().getSize().then(function (size) {
              browser.actions().mouseMove(artboardPage.getPlaceholderContainer(), {x: size.width - 100, y: size.height - 100})
                .mouseDown()
                .mouseMove(artboardPage.getPlaceholderContainer(), {x: size.width - 50, y: size.height - 50})
                .mouseUp()
                .perform();
              expect(artboardPage.getPlaceholderContainer().getLocation()).to.eventually.include({x: initialLocation.x + 50, y: initialLocation.y + 50});
            });
          });
        });

        it('should resize placeholder', function () {
          artboardPage.getPlaceholderContainer().getSize().then(function (initialSize) {
            browser.actions().mouseMove(artboardPage.getPlaceholderContainer(), {x: initialSize.width, y: initialSize.height / 2})
              .mouseDown()
              .mouseMove(artboardPage.getPlaceholderContainer(), {x: initialSize.width - 50, y: initialSize.height / 2})
              .mouseUp()
              .perform();
            expect(artboardPage.getPlaceholderContainer().getSize()).to.eventually.include({width: initialSize.width - 50, height: initialSize.height});
          });
        });

        it('should resize placeholder from the corner', function () {
          artboardPage.getPlaceholderContainer().getSize().then(function (initialSize) {
            browser.actions().mouseMove(artboardPage.getPlaceholderContainer(), {x: initialSize.width, y: initialSize.height})
              .mouseDown()
              .mouseMove(artboardPage.getPlaceholderContainer(), {x: initialSize.width + 20, y: initialSize.height + 20})
              .mouseUp()
              .perform();
            expect(artboardPage.getPlaceholderContainer().getSize()).to.eventually.include({width: initialSize.width + 20, height: initialSize.height + 20});
          });
        });

        it('should reveal hidden sidebar when selecting placeholder', function () {
          workspacePage.getExpandArtboardButton().click();
          artboardPage.getPlaceholderContainer().getSize().then(function (size) {
            browser.actions().mouseMove(artboardPage.getPlaceholderContainer(), {x: size.width - 100, y: size.height - 100}).click().perform();
            expect(workspacePage.getWorkspaceContainer().getAttribute('class')).to.not.eventually.contain('hide-sidebar');
          });
        });
      });
  });
};
module.exports = ArtboardPlaceholdersScenarios;
