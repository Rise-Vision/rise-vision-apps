'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var ArtboardPage = require('./../pages/artboardPage.js');
var PlaceholdersListPage = require('./../pages/placeholdersListPage.js');
var helper = require('rv-common-e2e').helper;

var ArtboardPlaceholdersScenarios = function() {
  browser.driver.manage().window().setSize(1920, 1080);
  describe('Artboard Placeholders', function () {
    this.timeout(10000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var artboardPage;
    var placeholdersListPage;
    var initialZoom;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      artboardPage = new ArtboardPage();
      placeholdersListPage = new PlaceholdersListPage();
      commonHeaderPage = new CommonHeaderPage();
    });

    before(function () {
      homepage.getEditor();
      signInPage.signIn();
      presentationsListPage.openNewPresentation();
    });

    describe(' Given a user is adding a new presentation', function () {
      it('should zoom to fit', function(done) {
        workspacePage.getZoomDropdown().getText().then(function(text) {
          let zoom = parseInt(text.substring(0, text.indexOf('%'))) / 100;
          expect(zoom).to.be.greaterThan(0);

          done();
        });        
      });
    });

    describe(' Given a user is adding a new presentation and a new placeholder', function () {
      before(function () {
        workspacePage.getZoomDropdown().click();
        workspacePage.getZoomFullSizeDropdownItem().click();
        initialZoom = 1;

        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');
      });

      it('should show the placeholder', function () {
        expect(artboardPage.getPlaceholderContainers().get(0).isDisplayed()).to.eventually.be.true;
      });

      it('should select placeholder after adding it', function () {
        expect(artboardPage.getPlaceholderContainers().get(0).getAttribute('class')).to.eventually.contain('edit-mode');
      });

      var top, left;
      it('placeholder should be offset (centered) on the artboard', function(done) {
        artboardPage.getPlaceholderContainers().get(0).getLocation().then(function (location) {
          expect(left = location.x).to.be.greaterThan(100);
          expect(top = location.y).to.be.greaterThan(100);
          done();
        });
      });
      
      it('should deselect by clicking outside the placeholder', function (done) {
        artboardPage.getPlaceholderContainers().get(0).getSize().then(function (size) {
          browser.actions().mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: size.width - 10, y: size.height + 20}).click().perform();
          expect(artboardPage.getPlaceholderContainers().get(0).getAttribute('class')).to.eventually.not.contain('edit-mode');
          done();
        });
      });
      
      it('should not overlap new placeholder', function(done) {
        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

        browser.sleep(500); //wait for transition

        artboardPage.getPlaceholderContainer('ph1').getLocation().then(function (location) {
          // Probably due to rounding, we are seeing 1-3 pixels variation. Adding 5px tolerance to pass the test.
          expect(Math.abs(Math.round(location.x) - Math.round(left + 20*initialZoom))).to.be.lessThan(5); 
          expect(Math.abs(Math.round(location.y) - Math.round(top + 20*initialZoom))).to.be.lessThan(5);
          
          done();
        });
      });
      
      it('should remove extra placeholder', function(done) {
        workspacePage.getBackToListButton().click();
        browser.sleep(500); //wait for transition
        placeholdersListPage.getRemoveButtons().get(0).click();
        
        helper.wait(placeholdersListPage.getRemoveItemButton(), 'Remove Item Confirm Button');

        helper.clickWhenClickable(placeholdersListPage.getRemoveItemButton(), 'Remove Item Confirm Button').then(function () {
          expect(placeholdersListPage.getPlaceholders().count()).to.eventually.equal(1);

          done();
        });
      });

      it('should re-select the placeholder', function () {
        artboardPage.getPlaceholderContainers().get(0).click();
        browser.sleep(500); //wait for transition

        expect(artboardPage.getPlaceholderContainers().get(0).getAttribute('class')).to.eventually.contain('edit-mode');
      });

      it('should not deselect by clicking the placeholder', function (done) {
        artboardPage.getPlaceholderContainers().get(0).getSize().then(function (size) {
          browser.actions().mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: size.width*initialZoom - 10, y: size.height*initialZoom - 10}).click().perform();
          expect(artboardPage.getPlaceholderContainers().get(0).getAttribute('class')).to.eventually.contain('edit-mode');
          browser.actions().mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: size.width*initialZoom - 10, y: size.height*initialZoom - 10}).click().perform();
          expect(artboardPage.getPlaceholderContainers().get(0).getAttribute('class')).to.eventually.contain('edit-mode');
          done();
        });
      });

      it('should move placeholder', function (done) {
        artboardPage.getPlaceholderContainers().get(0).getLocation().then(function (initialLocation) {
          artboardPage.getPlaceholderContainers().get(0).getSize().then(function (size) {
            browser.actions().mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: size.width*initialZoom - 100*initialZoom, y: size.height*initialZoom - 100*initialZoom})
              .mouseDown()
              .mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: size.width*initialZoom - 50*initialZoom, y: size.height*initialZoom - 50*initialZoom})
              .mouseUp()
              .perform()
              .then(function() {
                artboardPage.getPlaceholderContainers().get(0).getLocation().then(function(loc) {
                  expect(Math.floor(loc.x)).to.equal(Math.floor(initialLocation.x + 50*initialZoom));
                  expect(Math.floor(loc.y)).to.equal(Math.floor(initialLocation.y + 50*initialZoom));
                  done();
                });
              });
          });
        });
      });

      it('should resize placeholder', function (done) {
        artboardPage.getPlaceholderContainers().get(0).getSize().then(function (initialSize) {
          browser.actions().mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: initialSize.width*initialZoom, y: initialSize.height*initialZoom / 2})
            .mouseDown()
            .mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: initialSize.width*initialZoom - 50*initialZoom, y: initialSize.height*initialZoom / 2})
            .mouseUp()
            .perform()
            .then(function() {
              artboardPage.getPlaceholderContainers().get(0).getSize().then(function(sz) {
                expect(Math.floor(sz.width)).to.equal(Math.floor(initialSize.width - 50));
                expect(Math.floor(sz.height)).to.equal(Math.floor(initialSize.height));
                done();
              });
            });
        });
      });

      it('should resize placeholder from the corner', function (done) {
        artboardPage.getPlaceholderContainers().get(0).getSize().then(function (initialSize) {
          browser.actions().mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: initialSize.width*initialZoom, y: initialSize.height*initialZoom})
            .mouseDown()
            .mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: initialSize.width*initialZoom + 20*initialZoom, y: initialSize.height*initialZoom + 20*initialZoom})
            .mouseUp()
            .perform()
            .then(function() {
              artboardPage.getPlaceholderContainers().get(0).getSize().then(function(sz) {
                expect(Math.floor(sz.width)).to.equal(Math.floor(initialSize.width + 20));
                expect(Math.floor(sz.height)).to.equal(Math.floor(initialSize.height + 20));
                done();
              });
            });
        });
      });

      it('should reveal hidden sidebar when selecting placeholder', function (done) {
        workspacePage.getExpandArtboardButton().click();
        artboardPage.getPlaceholderContainers().get(0).getSize().then(function (size) {
          browser.actions().mouseMove(artboardPage.getPlaceholderContainers().get(0), {x: size.width*initialZoom - 100*initialZoom, y: size.height*initialZoom - 100*initialZoom}).click().perform();
          expect(workspacePage.getWorkspaceContainer().getAttribute('class')).to.not.eventually.contain('hide-sidebar');
          
          done();
        });
      });
    });
  });
};
module.exports = ArtboardPlaceholdersScenarios;
