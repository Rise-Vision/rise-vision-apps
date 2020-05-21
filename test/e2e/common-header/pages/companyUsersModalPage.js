/*globals element, by */
(function(module) {
  'use strict';

  var expect = require('rv-common-e2e').expect;
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

    var usersModalFilter = element(by.css('.company-users-modal input[ng-model="search.query"]'));

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

    this.searchUser = function(username) {
      helper.waitDisappear(this.getLoader(), "Company Users Loaded");
      this.getUsersModalFilter().getAttribute("value").then(function (value) {
        if (value !== "") {
          usersModalFilter.clear();
          helper.wait(loader, "Load Company Users");
          helper.waitDisappear(loader, "Company Users Loaded");
        }
      });
      this.getUsersModalFilter().sendKeys(username);
      helper.wait(this.getLoader(), "Load Company Users");
      helper.waitDisappear(this.getLoader(), "Company Users Loaded");
    };

    this.deleteUserIfExists = function(username) {
      var _this = this;
      this.openCompanyUsersModal();
      this.searchUser(username);

      users.count().then(function(count) {
        if (count > 0) {
          console.log('Found matching User, deleting');

          helper.clickWhenClickable(users.get(0), "First matching User");

          helper.wait(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
          helper.waitDisappear(userSettingsModalPage.getLoader(), "User Settings Modal Loader");

          expect(userSettingsModalPage.getUsernameLabel().getText()).to.eventually.equal(username);

          userSettingsModalPage.getDeleteButton().click();
          
          browser.sleep(500);
          helper.wait(userSettingsModalPage.getDeleteForeverButton(), 'User Delete Forever Button');      
          helper.clickWhenClickable(userSettingsModalPage.getDeleteForeverButton(), 'User Delete Forever Button');
          
          helper.waitDisappear(userSettingsModalPage.getUserSettingsModal(), "User Settings Modal");
        }
        else {
          console.log('Matching User not found');
        }

        _this.closeCompanyUsersModal();
      });
    };

    this.getCompanyUsersModal = function() {
      return companyUsersModal;
    };
    
    this.getLoader = function() {
      return loader;
    };
    
    this.getUsersModalFilter = function() {
      return usersModalFilter;
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
