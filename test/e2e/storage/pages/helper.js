(function (module) {
  'use strict';

  var HomePage = require('./../../common/pages/homepage.js');
  var SignInPage = require('./../../common/pages/signInPage.js');
  var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
  var helper = require('rv-common-e2e').helper;
  var IframePage = require('./iframeStorageSelectorPage.js');
  var StorageSelectorModalPage = require('./storageSelectorModalPage.js');
  var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
  var PresentationPropertiesModalPage = require('./../../editor/pages/presentationPropertiesModalPage.js');
  var WorkspacePage = require('./../../editor/pages/workspacePage.js');
  var StorageHomePage = require('./storageHomePage.js');
  var FilesListPage = require('./filesListPage.js');

  var homepage = new HomePage();
  var signInPage = new SignInPage();
  var commonHeaderPage = new CommonHeaderPage();
  var storageSelectorModalPage = new StorageSelectorModalPage();
  var iframePage = new IframePage();
  var presentationListPage = new PresentationListPage();
  var presentationPropertiesModalPage = new PresentationPropertiesModalPage();
  var workspacePage = new WorkspacePage();
  var storageHomePage = new StorageHomePage();
  var filesListPage = new FilesListPage();

  var factory = {
    setupIframeSingleFolderSelector: function(){
      homepage.getStorage();
      signInPage.signIn();
      iframePage.getSingleFolderSelector();
      helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
      helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
    },

    setupIframeSingleFileSelector: function(){
      homepage.getStorage();
      signInPage.signIn();
      iframePage.getSingleFileSelector();
      helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
      helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
    },

    setupStorageHome: function(){
      homepage.getStorage();
      signInPage.signIn();
      helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
      helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
      browser.driver.executeScript('sessionStorage.setItem("bypass-upload-encoding", true)');
    },

    setupStorageHomeWithEncoding: function() {
      factory.setupStorageHome();
      browser.driver.executeScript('sessionStorage.setItem("bypass-upload-encoding", false)');
    },

    setupAppsSingleFileSelector: function(){
      homepage.getEditor();
      signInPage.signIn();
      presentationListPage.openNewPresentation();
      workspacePage.getPresentationPropertiesButton().click();
      helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
      browser.sleep(500);

      presentationPropertiesModalPage.getBackgroundImageCheckbox().click();
      helper.wait(presentationPropertiesModalPage.getBackgroundImageURLInput(), 'Background Image URL Input');
      presentationPropertiesModalPage.getBackgroundImageStorageButton().click();
      helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
      helper.waitDisappear(filesListPage.getFilesListLoader(), 'Storage Files Loader');
    }
  };

  module.exports = factory;

})(module);
