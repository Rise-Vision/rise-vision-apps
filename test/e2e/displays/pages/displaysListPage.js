'use strict';

var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var DisplayManagePage = require('./displayManagePage.js');
var helper = require('rv-common-e2e').helper;
var expect = require('rv-common-e2e').expect;

var DisplaysListPage = function() {
  var _this = this;

  var commonHeaderPage = new CommonHeaderPage();
  var displayManagePage = new DisplayManagePage();

  var displaysAppContainer = element(by.css('.displays-app'));
  var title = element(by.id('title'));
  var searchFilter = element(by.tagName('search-filter'));
  var searchFilterField = element(by.css('search-filter div input'));
  var displayAddButton = element(by.id('displayAddButton'));
  var displaysListTable = element(by.id('displaysListTable'));
  var tableHeaderName = element(by.id('tableHeaderName'));
  var tableHeaderLastConnection = element(by.id('tableHeaderLastConnection'));
  var tableHeaderStatus = element(by.id('tableHeaderStatus'));
  var displayItems = element.all(by.repeater('display in displays.items.list'));
  var displaysLoader = element(by.xpath('//div[@spinner-key="displays-list-loader"]'));

  this.searchDisplay = function(displayName) {
    helper.wait(searchFilterField, 'Search Filter Field');
    searchFilterField.sendKeys(displayName);
    helper.wait(displaysLoader, 'Displays loader');
    helper.waitDisappear(displaysLoader, 'Displays loader');
  };

  this.clearSearch = function() {
    helper.wait(searchFilterField, 'Search Filter Field');
    searchFilterField.clear();
    helper.wait(displaysLoader, 'Displays loader');
    helper.waitDisappear(displaysLoader, 'Displays loader');
  };

  this.deleteDisplayIfExists = function() {
    var displayName = 'TEST_E2E_DISPLAY ' + commonHeaderPage.getStageEnv();

    helper.waitDisappear(displaysLoader, 'Displays loader');

    this.searchDisplay(displayName);

    displayItems.count().then(function(count) {
      if (count > 0) {
        helper.clickWhenClickable(displayItems.get(0).element(by.tagName('td')), "First matching Display");

        helper.waitDisappear(displayManagePage.getDisplayLoader(), 'Display loader');

        expect(displayManagePage.getDisplayNameField().getAttribute('value')).to.eventually.contain(displayName);

        helper.wait(displayManagePage.getDeleteButton(), 'Display Delete Button');
        helper.clickWhenClickable(displayManagePage.getDeleteButton(), 'Display Delete Button');

        helper.wait(displayManagePage.getDeleteForeverButton(), 'Display Delete Forever Button');
        helper.clickWhenClickable(displayManagePage.getDeleteForeverButton(), 'Display Delete Forever Button');
        helper.waitDisappear(displayManagePage.getDeleteForeverButton(), 'Display Delete Forever Button');

        helper.wait(displaysListTable, 'Displays List');
        helper.waitDisappear(displaysLoader, 'Displays loader');

        _this.deleteDisplayIfExists();
      } else {
        _this.clearSearch();
      }
    });
  };

  this.getDisplaysAppContainer = function() {
    return displaysAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getSearchFilter = function() {
    return searchFilter;
  };

  this.getSearchFilterField = function() {
    return searchFilterField;
  };

  this.getDisplayAddButton = function() {
    return displayAddButton;
  };

  this.getDisplaysListTable = function() {
    return displaysListTable;
  };

  this.getTableHeaderName = function() {
    return tableHeaderName;
  };

  this.getTableHeaderLastConnection = function() {
    return tableHeaderLastConnection;
  };

  this.getTableHeaderStatus = function() {
    return tableHeaderStatus;
  };

  this.getDisplayItems = function() {
    return displayItems;
  };

  this.getDisplaysLoader = function() {
    return displaysLoader;
  };

  this.getFirstRowSchedule = function() {
    return displayItems.first().element(by.css('.display-schedule .schedule-view'));
  };

  this.getFirstRowStatus = function() {
    return displayItems.first().element(by.css('.display-status'));
  };
};

module.exports = DisplaysListPage;
