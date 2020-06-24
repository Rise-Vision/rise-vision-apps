/*globals element, by */

(function(module) {
  'use strict';

  var HomePage = require('./../../common/pages/homepage.js');
  var LoginPage = require('./loginPage.js');
  var CompanySettingsModalPage = require('./companySettingsModalPage.js');
  var UserSettingsModalPage = require('./userSettingsModalPage.js');
  var helper = require('rv-common-e2e').helper;
  var expect = require('rv-common-e2e').expect;

  var CommonHeaderPage = function () {
    var selfCommonHeaderPage = this;

    var JENKINS_SUBSCRIBED = 'Jenkins Subscribed Subcompany';
    var JENKINS_UNSUBSCRIBED = 'Jenkins Unsubscribed Subcompany';
    var E2E_UNSUBSCRIBED = 'E2E SUBCOMPANY - UNSUBSCRIBED';

    var homePage = new HomePage();
    var loginPage = new LoginPage();
    var companySettingsModalPage = new CompanySettingsModalPage();
    var userSettingsModalPage = new UserSettingsModalPage();

    var commonHeader = element(by.tagName('common-header'));
    var commonHeaderMenuItems = element.all(by.repeater('opt in navOptions'));
    var signInButton = element(by.buttonText('Sign In'));
    var modalDialog = element(by.css('.modal-dialog'));
    var loader = element(by.xpath('//div[@spinner-key="_rv-global-spinner"]'));

    var profilePic = element(by.css(".user-profile-dropdown img.profile-pic"));
    var profileMenu = element(by.css(".user-profile-dropdown .dropdown-menu"));

    var addSubcompanyButton = element(by.css(".dropdown-menu .add-subcompany-menu-button"));
    var selectSubcompanyButton = element(by.css(".dropdown-menu #select-subcompany-button"));
    var changeSubcompanyButton = element(by.css(".dropdown-menu #change-subcompany-button"));
    var companySettingsButton = element(by.css(".dropdown-menu .company-settings-menu-button"));

    var userSettingsButton = element(by.css(".dropdown-menu .user-settings-button"));

    var addSubcompanyModal = element(by.css(".add-subcompany-modal"));
    var addSubcompanyModalNameField = element(by.id("company-settings-name"));
    var addSubcompanyModalIndustryField = element(by.id('company-industry'));
    var addSubcompanyModalSaveButton = element(by.css(".add-subcompany-save-button"));

    var selectSubcompanyModal = element(by.css(".select-subcompany-modal"));
    var selectSubcompanyModalLoader = element(by.xpath('//div[@spinner-key="company-selector-modal-list"]'));
    var selectSubcompanyModalFilter = element(by.css('.select-subcompany-modal input[ng-model="search.query"]'));
    var selectSubcompanyModalCompanies = element.all(by.repeater('company in companies.items.list'));
    var selectSubcompanyModalCloseButton = element(by.css(".modal-header .close"));

    var companySettingsModal = element(by.css(".company-settings-modal"));
    var companySettingsModalLoader = element(by.xpath('//div[@spinner-key="company-settings-modal"]'));
    var companySettingsModalDeleteButton = element(by.id("delete-button"));
    var safeDeleteModal = element(by.id("safeDeleteForm"));
    var safeDeleteModalInput = element(by.id("safeDeleteInput"));
    var safeDeleteModalDeleteForeverButton = element(by.css("#deleteForeverButton.btn-primary"));

    var subcompanyAlert = element(by.css(".common-header-alert.sub-company-alert.hidden-xs"));

    var signOutButton = element(by.css(".dropdown-menu .sign-out-button"));
    var signOutModal = element(by.css(".sign-out-modal"));
    var signOutRvOnlyButton = element(by.css(".sign-out-modal .sign-out-rv-only-button"));
    var signOutGoogleButton = element(by.css(".sign-out-modal .sign-out-google-account"));

    var alertSettingsButton = element(by.css(".alert-settings-button"));
    var turnOnAlertsButton = element(by.id("alertsToggleButton"));

    var mainCompanyNameSpan = element(by.id("mainCompanyName"));

    this.openProfileMenu = function () {
      //wait for spinner to go away.
      helper.waitDisappear(loader, 'CH spinner loader');

      homePage.dismissFeatureTour().then(function() {
        helper.wait(profilePic, 'Profile Picture');
        helper.clickWhenClickable(profilePic, 'Profile Picture');

        helper.wait(profileMenu, 'Profile Menu');
      });
    };

    this.clickSubcompanyButton = function() {
      selectSubcompanyButton.isDisplayed().then(function(value) {
        if (value) {
          helper.clickOverIFrame(selectSubcompanyButton, 'Select Sub Company Button');
        } else {
          helper.clickOverIFrame(changeSubcompanyButton, 'Change Sub Company Button');
        }
      });
    };

    this.signin = function (username, password) {
      //wait for spinner to go away.
      helper.waitDisappear(loader, 'CH spinner loader');
      browser.sleep(500);

      signInButton.isDisplayed().then(function (state) {
        if (state) {

          signInButton.click().then(function () {
            loginPage.signIn(username, password);

            // Apps' tests are more reliable by waiting for the spinner to show, but CH's tests need the try/catch clause
            helper.wait(loader, 'CH spinner loader', 5000)
            .catch(function (err) {
              console.log(err);
            });

            helper.waitDisappear(loader, 'CH spinner loader');
          });
        }
      });
    };

    this.signOut = function(isCustomAuth) {
      helper.waitDisappear(loader, 'CH spinner loader');

      profilePic.isDisplayed().then(function(value) {
        if (value) {
          selfCommonHeaderPage.openProfileMenu();

          helper.clickWhenClickable(signOutButton, 'Sign Out Button');

          if (!isCustomAuth) {
            helper.wait(signOutModal, 'Sign Out Modal');
            signOutRvOnlyButton.click();            
          }

          helper.waitDisappear(signOutModal, 'Sign Out Modal');
        }
      });
    };

    this.getStageEnv = function () {
      return browser.params.login.stageEnv.split('-').join('');
    };

    this.addStageSuffix = function (name) {
      return name + " - " + this.getStageEnv();
    };

    this.getStageEmailAddress = function () {
      return 'jenkins.rise+'+this.getStageEnv()+'@gmail.com';
    };

    this.getPassword = function () {
      return browser.params.login.pass;
    };

    this.searchSubCompany = function (subCompanyName, skipSuffix) {
      this.openProfileMenu();

      this.clickSubcompanyButton();
      helper.wait(selectSubcompanyModal, "Select Subcompany Modal");
      helper.waitDisappear(selectSubcompanyModalLoader, "Load Companies");

      if (subCompanyName) {
        var name = skipSuffix ? subCompanyName : this.addStageSuffix(subCompanyName).split('-').join('');
        selectSubcompanyModalFilter.sendKeys(name);
        helper.wait(selectSubcompanyModalLoader, "Load Companies");
        helper.waitDisappear(selectSubcompanyModalLoader, "Load Companies");
      }
    }

    function _createSubCompany(name, industryValue = 'OTHER') {

      selfCommonHeaderPage.openProfileMenu();

      helper.clickOverIFrame(addSubcompanyButton, 'Add Sub Company Button');
      helper.wait(addSubcompanyModal, "Add Subcompany Modal");

      addSubcompanyModalNameField.sendKeys(selfCommonHeaderPage.addStageSuffix(name));
      if (industryValue) {
        addSubcompanyModalIndustryField.$('[value="'+industryValue+'"]').click(); 
      }
      helper.clickOverIFrame(addSubcompanyModalSaveButton, 'Add Sub Company Modal Save Button');
      helper.waitRemoved(addSubcompanyModal, "Add Subcompany Modal");
    };

    this.createUnsubscribedSubCompany = function(name, industryValue) {
      console.log('Creating Unsubscribed Subcompany');

      this.deleteSubCompanyIfExists(name);

      // this.selectSubCompany(JENKINS_UNSUBSCRIBED);

      _createSubCompany(name, industryValue);
    };

    this.createSubscribedSubCompany = function(name, industryValue) {
      console.log('Creating Subscribed Subcompany');

      this.deleteSubCompanyIfExists(name);
      
      this.selectSubCompany(JENKINS_SUBSCRIBED, false, true);

      _createSubCompany(name, industryValue);
    };

    this.selectSubCompany = function(subCompanyName, avoidRetry, skipSuffix) {
      this.searchSubCompany(subCompanyName, skipSuffix);

      selectSubcompanyModalCompanies.count().then(function(count) {
        if (count > 0) {
          var name = skipSuffix ? subCompanyName : selfCommonHeaderPage.addStageSuffix(subCompanyName);

          helper.clickOverIFrame(selectSubcompanyModalCompanies.get(0), "First matching Subcompany");
          helper.wait(subcompanyAlert, "Subcompany Alert");
          helper.waitForElementTextToChange(subcompanyAlert, name, 'Subcompany Selected');

          helper.waitDisappear(loader, 'CH spinner loader');
        }
        else if (!avoidRetry) {
          helper.clickOverIFrame(selectSubcompanyModalCloseButton, "Subcompany Modal Close Button");
          browser.sleep(10000);
          selfCommonHeaderPage.selectSubCompany(subCompanyName, true, skipSuffix);
        }
        else {
          throw "Could not find the Sub Company: " + subCompanyName;
        }
      });
    };

    this.selectSubscribedSubCompany = function() {
      this.selectSubCompany(JENKINS_SUBSCRIBED, false, true);
    };

    this.selectUnsubscribedSubCompany = function() {
      this.selectSubCompany(E2E_UNSUBSCRIBED, false, true);
    };

    this.deleteSubCompanyIfExists = function(subCompanyName) {
      this.searchSubCompany(subCompanyName);

      selectSubcompanyModalCompanies.count().then(function(count) {
        if (count > 0) {
          console.log('Found matching Subcompany, deleting');

          helper.clickOverIFrame(selectSubcompanyModalCompanies.get(0), "First matching Subcompany");
          helper.wait(subcompanyAlert, "Subcompany Alert");
          selfCommonHeaderPage.deleteCurrentCompany(subCompanyName);
        }
        else {
          console.log('Matching Subcompany not found');

          helper.clickOverIFrame(selectSubcompanyModalCloseButton, "Subcompany Modal Close Button");
        }
      });
    };

    this.deleteCurrentCompany = function(companyName) {
      this.openProfileMenu();

      helper.clickWhenClickable(companySettingsButton, 'Company Settings Button');

      helper.wait(companySettingsModal, "Company Settings Modal");
      helper.waitDisappear(companySettingsModalLoader, "Load Company Settings");

      if (companyName) {
        expect(companySettingsModalPage.getNameField().getAttribute('value')).to.eventually.contain(companyName);
      }

      helper.wait(companySettingsModalDeleteButton, "Delete Button");
      helper.clickWhenClickable(companySettingsModalDeleteButton, "Delete Button");

      helper.wait(safeDeleteModal, "Safe Delete Modal");
      safeDeleteModalInput.sendKeys('DELETE');
      helper.clickWhenClickable(safeDeleteModalDeleteForeverButton, "Safe Delete Modal Delete Forever Button");
      
      helper.waitRemoved(companySettingsModal, "Company Settings Modal");
      helper.waitDisappear(loader, 'CH spinner loader');
      helper.waitDisappear(subcompanyAlert, "Subcompany Alert");
      helper.waitDisappear(loader, 'CH spinner loader');
    };

    this.deleteCurrentUser = function(emailAddress) {
      this.openProfileMenu();

      userSettingsButton.click();
      helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
      helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal Loader");
      browser.sleep(500);

      // Ensure the right User is being deleted
      expect(userSettingsModalPage.getUsernameLabel().getText()).to.eventually.equal(emailAddress);

      userSettingsModalPage.getDeleteButton().click();          
      browser.sleep(500);
      helper.wait(userSettingsModalPage.getDeleteForeverButton(), 'User Delete Forever Button');      
      helper.clickWhenClickable(userSettingsModalPage.getDeleteForeverButton(), 'User Delete Forever Button');          
      helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal");
    }

    this.selectAlerts = function() {
      this.openProfileMenu();

      helper.wait(alertSettingsButton, "Alert settings button");
      helper.clickOverIFrame(alertSettingsButton, "Alert settings button");
      helper.wait(turnOnAlertsButton, "Turn on alerts button");
    };

    this.getCommonHeader = function () {
      return commonHeader;
    };

    this.getCommonHeaderMenuItems = function () {
      return commonHeaderMenuItems;
    };

    this.getSignInButton = function () {
      return signInButton;
    };

    this.getModalDialog = function () {
      return modalDialog;
    };

    this.getLoader = function () {
      return loader;
    };

    this.getProfilePic = function () {
      return profilePic;
    };

    this.getProfileMenu = function () {
      return profileMenu
    };

    this.getSignOutButton = function() {
      return signOutButton;
    };

    this.getSignOutModal = function() {
      return signOutModal;
    };

    this.getSignOutRvOnlyButton = function() {
      return signOutRvOnlyButton;
    };

    this.getSignOutGoogleButton = function() {
      return signOutGoogleButton;
    };

    this.getMainCompanyNameSpan = function() {
      return mainCompanyNameSpan;
    };

  };

  module.exports = CommonHeaderPage;
})(module);
