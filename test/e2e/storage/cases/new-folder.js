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
var NewFolderModalPage = require('./../pages/newFolderModalPage.js');

var NewFolderScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe("Storage Selector", function () {
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var workspacePage;
    var presentationListPage;
    var presentationPropertiesModalPage;
    var storageSelectorModalPage;
    var newFolderModalPage;
    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      workspacePage = new WorkspacePage();
      presentationListPage = new PresentationListPage();
      presentationPropertiesModalPage = new PresentationPropertiesModalPage();
      storageSelectorModalPage = new StorageSelectorModalPage();
      newFolderModalPage = new NewFolderModalPage();
    });

    describe("Given a user who wants to add a folder to Storage", function () {

      before(function () {
        homepage.getEditor();
        //wait for spinner to go away.
        helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
          loginPage.signIn();
        });
        presentationListPage.openNewPresentation();
      });

      it('should load the properties modal', function () {
        helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
        
        expect(presentationPropertiesModalPage.getBackgroundImageCheckbox().isDisplayed()).to.eventually.be.true;
      });

      describe("Presentation properties modal ", function () {
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

        it('should open New Folder modal', function(){
          storageSelectorModalPage.getNewFolderButton().click();
          helper.wait(newFolderModalPage.getNewFolderModal(), 'New Folder Modal');

          expect(newFolderModalPage.getNewFolderModal().isDisplayed()).to.eventually.be.true;
          expect(newFolderModalPage.getModalTitle().getText()).to.eventually.equal('Add Folder');
        });

        it('should contain new folder form', function(){
          expect(newFolderModalPage.getNewFolderInput().isDisplayed()).to.eventually.be.true;
          expect(newFolderModalPage.getSaveButton().isDisplayed()).to.eventually.be.true;
          expect(newFolderModalPage.getCancelButton().isDisplayed()).to.eventually.be.true;
        });

        it('should enable save after enterign folder name',function(){
          expect(newFolderModalPage.getSaveButton().isEnabled()).to.eventually.be.false;

          newFolderModalPage.getNewFolderInput().sendKeys("newFolder");

          expect(newFolderModalPage.getSaveButton().isEnabled()).to.eventually.be.true;
        });

        it('should close modal', function () {
          newFolderModalPage.getCancelButton().click();
          
          helper.waitDisappear(newFolderModalPage.getNewFolderModal(), 'New Folder Modal');

          expect(newFolderModalPage.getNewFolderModal().isPresent()).to.eventually.be.false;
        });

      });
    });
  });
};
module.exports = NewFolderScenarios;
