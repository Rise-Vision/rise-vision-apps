(function (module) {
  "use strict";

  var HomePage = require('./../../launcher/pages/homepage.js');
  var LoginPage = require('./../../launcher/pages/loginPage.js');
  var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
  var helper = require('rv-common-e2e').helper;
  var IframePage = require('./iframeStorageSelectorPage.js');
  var StorageSelectorModalPage = require('./storageSelectorModalPage.js');
  var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
  var PresentationPropertiesModalPage = require('./../../editor/pages/presentationPropertiesModalPage.js');
  var StorageHomePage = require('./storageHomePage.js');

  var homepage = new HomePage();
  var loginPage = new LoginPage();
  var commonHeaderPage = new CommonHeaderPage();
  var storageSelectorModalPage = new StorageSelectorModalPage();
  var iframePage = new IframePage();
  var presentationListPage = new PresentationListPage();
  var presentationPropertiesModalPage = new PresentationPropertiesModalPage();
  var storageHomePage = new StorageHomePage();

  var factory = {
    setupIframeSingleFolderSelector: function(){
      homepage.getStorage();
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      iframePage.getSingleFolderSelector();
      helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
    },

    setupIframeSingleFileSelector: function(){
      homepage.getStorage();
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      iframePage.getSingleFileSelector();
      helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
      helper.waitDisappear(storageSelectorModalPage.getLoader(), 'Storage Files Loader');
    },

    setupStorageHome: function(){
      homepage.getStorage();
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      helper.wait(storageHomePage.getStorageAppContainer(), 'Storage Apps Container');
      helper.waitDisappear(storageHomePage.getLoader(), 'Storage Files Loader');
    },

    setupAppsSingleFileSelector: function(){
      homepage.getEditor();
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
      presentationListPage.openNewPresentation();
      helper.wait(presentationPropertiesModalPage.getPresentationPropertiesModal(), 'Presentation Properties Modal');
      presentationPropertiesModalPage.getBackgroundImageCheckbox().click();
      helper.wait(presentationPropertiesModalPage.getBackgroundImageURLInput(), 'Background Image URL Input');
      presentationPropertiesModalPage.getBackgroundImageStorageButton().click();
      helper.wait(storageSelectorModalPage.getStorageSelectorModal(), 'Storage Selector Modal');
    }
  };

  module.exports = factory;

})(module);

