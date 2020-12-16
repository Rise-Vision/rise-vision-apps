(function () {
  'use strict';

  var HomepageScenarios = require('./common/cases/homepage.js');
  var SigninGoogleScenarios = require('./common/cases/signin-google.js');
  var SigninCustomScenarios = require('./common/cases/signin-custom.js');
  var WeeklyTemplatesScenarios = require('./common/cases/weekly-templates.js');

  var CompanySettingsScenarios = require("./common-header/cases/company-settings.js");
  var CompanySubcompaniesScenarios = require("./common-header/cases/company-subcompanies.js");
  var CompanyUsersScenarios = require("./common-header/cases/company-users.js");
  var UserSettingsScenarios = require("./common-header/cases/user-settings.js");

  var AccountBillingScenarios = require("./billing/cases/account-billing.js");

  var StorageSelectorScenarios = require('./storage/cases/storage-selector.js');
  var NewFolderModalScenarios = require('./storage/cases/new-folder.js');
  var UploadScenarios = require('./storage/cases/upload.js');
  var HomeScenarios = require('./storage/cases/home.js');
  var CopyUrlScenarios = require('./storage/cases/copy-url.js');
  var DownloadScenarios = require('./storage/cases/download.js');
  var TrashScenarios = require('./storage/cases/trash.js');
  var IframeScenarios = require('./storage/cases/iframe.js');
  var DismissModalScenarios = require('./storage/cases/dismiss-modal.js');

  describe('Apps Common', function () {
    var homepageScenarios = new HomepageScenarios();
    var signinGoogleScenarios = new SigninGoogleScenarios();
    var signinCustomScenarios = new SigninCustomScenarios();
    var weeklyTemplatesScenarios = new WeeklyTemplatesScenarios();
  });

  describe('Common Header', function () {
    var companySettingsScenarios = new CompanySettingsScenarios();
    var companySubcompaniesScenarios = new CompanySubcompaniesScenarios();
    var companyUsersSenarios = new CompanyUsersScenarios();
    var userSettingsScenarios = new UserSettingsScenarios();
  });

  describe('Billing', function () {
    var accountBillingScenarios = new AccountBillingScenarios();
  });

  describe('Storage', function () {
    var storageSelectorScenarios = new StorageSelectorScenarios();
    var newFolderModalScenarios = new NewFolderModalScenarios();
    var uploadScenarios = new UploadScenarios();
    var homeScenarios = new HomeScenarios();
    var copyUrlScenarios = new CopyUrlScenarios();
    var downloadScenarios = new DownloadScenarios();
    var trashScenarios = new TrashScenarios();
    var iframeScenarios = new IframeScenarios();
    var dismissModalScenarios = new DismissModalScenarios();
  });

})();
