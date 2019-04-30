'use strict';
var DisplaysListPage = function() {
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
    return displayItems.first().element(by.css('.display-status .u_icon-hover'));
  };
};

module.exports = DisplaysListPage;
