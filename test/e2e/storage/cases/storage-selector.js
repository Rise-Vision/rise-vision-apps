'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var helper = require('rv-common-e2e').helper;
var WorkspacePage = require('./../../editor/pages/workspacePage.js');
var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
var PresentationPropertiesModalPage = require('./../../editor/pages/presentationPropertiesModalPage.js');
var StorageSelectorModalPage = require('./../pages/storageSelectorModalPage.js');

var StorageSelectorScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe('Storage Selector', function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var workspacePage;
    var presentationListPage;
    var presentationPropertiesModalPage;
    var storageSelectorModalPage;
    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      workspacePage = new WorkspacePage();
      presentationListPage = new PresentationListPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      storageSelectorModalPage = new StorageSelectorModalPage();
    });

    describe('Given a user who wants to set a Background image', function () {

      before(function () {
        homepage.getEditor();
        loginPage.signIn();
        presentationListPage.openNewPresentation();
      });

      it('should load the properties modal', function () {
        workspacePage.getPresentationPropertiesButton().click();
        helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
        browser.sleep(500);
        expect(presentationPropertiesModalPage.getBackgroundImageCheckbox().isDisplayed()).to.eventually.be.true;
      });

      describe('Presentation properties modal ', function () {
        it('should show storage button', function() {
          presentationPropertiesModalPage.getBackgroundImageCheckbox().click();
          
          helper.wait(presentationPropertiesModalPage.getBackgroundImageURLInput(), 'Background Image URL Input');

          expect(presentationPropertiesModalPage.getBackgroundImageURLInput().isDisplayed()).to.eventually.be.true;
          expect(presentationPropertiesModalPage.getBackgroundImageStorageButton().isDisplayed()).to.eventually.be.true;
        });
        
        it('should show storage selector', function() {
          presentationPropertiesModalPage.getBackgroundImageStorageButton().click();
          
          helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');

          expect(storageSelectorModalPage.getStorageSelectorModal().isDisplayed()).to.eventually.be.true;
          expect(storageSelectorModalPage.getCloseButton().isDisplayed()).to.eventually.be.true;
        });

        it('should close selector', function () {
          storageSelectorModalPage.getCloseButton().click();
          
          helper.waitDisappear(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');

          expect(storageSelectorModalPage.getStorageSelectorModal().isPresent()).to.eventually.be.false;
        });

      });
    });
  });
};
module.exports = StorageSelectorScenarios;
