/*globals element, by */
(function(module) {
  'use strict';

  var helper = require("rv-common-e2e").helper;
  var CommonHeaderPage = require("./commonHeaderPage.js");
  var HomePage = require("./homepage.js");
  var UserSettingsModalPage = require("./userSettingsModalPage.js");

  var CompanyUsersModalPage = function () {
    var commonHeaderPage = new CommonHeaderPage();
    var homepage = new HomePage();
    var userSettingsModalPage = new UserSettingsModalPage();

    var companyUsersModal = element(by.css(".company-users-modal"));
    var loader = element(by.xpath('//div[@spinner-key="company-users-list"]'));

    var usersList = element.all(by.css(".company-users-list-item"));
    var users = element.all(by.css(".company-users-list-item .list-group-item-text"));
    
    var addUserButton = element(by.css("button.add-company-user-button"));
    var closeButton = element(by.css("button.close-company-users-button"));

    this.openCompanyUsersModal = function() {
      commonHeaderPage.getProfilePic().click();

      helper.wait(homepage.getCompanyUsersButton(), "Company Users Button");

      homepage.getCompanyUsersButton().click();

      helper.wait(companyUsersModal, "Company Users Modal");

      helper.waitDisappear(loader, "Load Company Users");
    };

    this.closeCompanyUsersModal = function() {
      helper.wait(companyUsersModal, "Company Users Modal");

      helper.waitDisappear(loader, "Load Company Users");

      closeButton.click();

      helper.waitDisappear(companyUsersModal, "Company Users Modal");
    };

    this.openAddUserDialog = function() {
      addUserButton.click();
      
      helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
    };

    this.getCompanyUsersModal = function() {
      return companyUsersModal;
    };
    
    this.getLoader = function() {
      return loader;
    };
    
    this.getUsersList = function() {
      return usersList;
    };
    
    this.getUsers = function() {
      return users;
    };
    
    this.getAddUserButton = function() {
      return addUserButton;
    };
    
    this.getCloseButton = function() {
      return closeButton;
    };
    
  };

  module.exports = CompanyUsersModalPage;
})(module);
