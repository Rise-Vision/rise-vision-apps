'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationsListPage = require('./../pages/presentationListPage.js');
var WorkspacePage = require('./../pages/workspacePage.js');
var PlaceholdersListPage = require('./../pages/placeholdersListPage.js');
var PresentationPropertiesModalPage = require('./../pages/presentationPropertiesModalPage.js');
var helper = require('rv-common-e2e').helper;

var PlaceholdersListScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe('Add placeholder to presentation: ', function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var presentationsListPage;
    var workspacePage;
    var placeholdersListPage;
    var presentationPropertiesModalPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      presentationsListPage = new PresentationsListPage();
      workspacePage = new WorkspacePage();
      placeholdersListPage = new PlaceholdersListPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();

      homepage.getEditor();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
    });

    describe(' Given a user is adding a new presentation and a few placeholders', function () {
      before(function () {
        presentationsListPage.openNewPresentation();
        presentationPropertiesModalPage.getCancelButton().click();

        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');
        helper.clickWhenClickable(workspacePage.getAddPlaceholderButton(), 'Add Placeholder button');

        browser.sleep(500); //wait for transition
        workspacePage.getBackToListButton().click();
        browser.sleep(500); //wait for transition
      });

      describe('Should manage placeholders', function () {
        it('should have 2 items the list', function () {
          expect(placeholdersListPage.getPlaceholders().count()).to.eventually.equal(2);

          expect(placeholdersListPage.getPlaceholders().get(0).getText()).to.eventually.contain('ph0');
          expect(placeholdersListPage.getPlaceholders().get(1).getText()).to.eventually.contain('ph1');
        });

        it('should remove item', function (done) {
          placeholdersListPage.getRemoveButtons().get(0).click();

          helper.clickWhenClickable(placeholdersListPage.getRemoveItemButton(), "Remove Item Confirm Button").then(function () {
            expect(placeholdersListPage.getPlaceholders().count()).to.eventually.equal(1);

            done();
          });
        });

        it('should duplicate item', function () {
          placeholdersListPage.getDuplicateItemButton().get(0).click();

          expect(placeholdersListPage.getPlaceholders().count()).to.eventually.equal(2);
        });

        xit('should open properties', function () {
          placeholdersListPage.getPlaceholders().get(0).element(by.tagName('td')).click();
        });

        xit('should close properties', function () {

        });

      });
    });
  });
};
module.exports = PlaceholdersListScenarios;
