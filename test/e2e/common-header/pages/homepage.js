/*globals element, by */
(function(module) {
  'use strict';

  var config = require('../../config/config.json');

  var HomePage = function () {
    var url = config.rootUrl + '/';
    // var url = "http://localhost:8000/test/e2e";
    var urlFakePage = url + "/#/fake-page";
    var editorUrl = config.rootUrl + '/editor/list';

    var navMenuItems = element.all(by.repeater('opt in navOptions'));

    var registerUserButton = element(by.css(".register-user-menu-button"));

    var userSettingsButton = element(by.css(".dropdown-menu .user-settings-button"));
    var companyUsersButton = element(by.css(".dropdown-menu .company-users-menu-button"));
    var companySettingsButton = element(by.css(".dropdown-menu .company-settings-menu-button"));
    var addSubcompanyButton = element(by.css(".dropdown-menu .add-subcompany-menu-button"));
    var selectSubcompanyButton = element(by.css(".dropdown-menu #select-subcompany-button"));
    var changeSubcompanyButton = element(by.css(".dropdown-menu #change-subcompany-button"));
    var resetSubcompanyButton = element(by.css(".dropdown-menu #reset-subcompany-button"));

    var subcompanyAlert = element(by.css(".common-header-alert.sub-company-alert.hidden-xs"));
    var testCompanyAlert = element(by.css(".sub-company-alert.test-company-alert"));

    var alertSettingsButton = element(by.css(".alert-settings-button"));

    var freePlanBanner = element(by.id("free-plan-banner"));
    var freePlansModalLink = freePlanBanner.element(by.tagName("a"));

    var trialPlanBanner = element(by.id("trial-plan-banner"));
    var trialPlansModalLink = trialPlanBanner.element(by.tagName("a"));

    this.get = function() {
      browser.get(url);
    };

    this.getEditor = function() {
      browser.get(editorUrl);
    };

    this.getFakePage = function() {
      browser.get(urlFakePage);
    };

    this.getNavMenuOptions = function() {
      return navMenuItems;
    };

    this.getRegisterUserButton = function() {
      return registerUserButton;
    };

    this.getUserSettingsButton = function() {
      return userSettingsButton;
    };

    this.getCompanyUsersButton = function() {
      return companyUsersButton;
    };

    this.getCompanySettingsButton = function() {
      return companySettingsButton;
    };

    this.getAddSubcompanyButton = function() {
      return addSubcompanyButton;
    };

    this.getSelectSubcompanyButton = function() {
      return selectSubcompanyButton;
    };

    this.getChangeSubcompanyButton = function() {
      return changeSubcompanyButton;
    };

    this.getResetSubcompanyButton = function() {
      return resetSubcompanyButton;
    };

    this.getSubcompanyAlert = function() {
      return subcompanyAlert;
    };

    this.getTestCompanyAlert = function() {
      return testCompanyAlert;
    };

    this.getAlertSettingsButton = function() {
      return alertSettingsButton;
    };

    this.getFreePlanBanner = function() {
      return freePlanBanner;
    };

    this.getFreePlansModalLink = function() {
      return freePlansModalLink;
    };

    this.getTrialPlanBanner = function() {
      return trialPlanBanner;
    };

    this.getTrialPlansModalLink = function() {
      return trialPlansModalLink;
    };

  };

  module.exports = HomePage;
})(module);
