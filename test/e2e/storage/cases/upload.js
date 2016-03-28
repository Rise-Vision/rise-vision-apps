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

var UploadScenarios = function() {

  browser.driver.manage().window().setSize(1400, 900);
  describe("Storage Selector", function () {
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

    describe("Given a user who wants to upload a file to Storage", function () {

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
        
        it('should show upload dropdown', function() {
          storageSelectorModalPage.getUploadDropdown().click();
          
          helper.wait(storageSelectorModalPage.getUploadButton(), 'Upload Button');
          
          expect(storageSelectorModalPage.getUploadButton().isDisplayed()).to.eventually.be.true;
          expect(storageSelectorModalPage.getUploadFolderButton().isDisplayed()).to.eventually.be.true;
          
          storageSelectorModalPage.getUploadDropdown().click();
        });

        it('should upload file', function(){
          var uploadFilePath = process.cwd() + "/package.json";
          storageSelectorModalPage.getUploadInput().sendKeys(uploadFilePath);

          expect(storageSelectorModalPage.getUploadPanel().isDisplayed()).to.eventually.be.true;
        });

        it('should hide Uplaod panel when finished',function(){
          helper.waitDisappear(storageSelectorModalPage.getUploadPanel(), 'Storage Upload Panel');
          expect(storageSelectorModalPage.getUploadPanel().isDisplayed()).to.eventually.be.false;
        });

        it('should list uploaded file',function(){
          storageSelectorModalPage.getSearchInput().sendKeys('package.json');
          expect(storageSelectorModalPage.getFileListRows().count()).to.eventually.be.at.least(1);
        });

      });
    });
  });
};
module.exports = UploadScenarios;
