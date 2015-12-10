'use strict';
var DisplaysListPage = function() {
  var displaysAppContainer = element(by.css('.displays-app'));
  var title = element(by.id('title'));
  var searchFilter = element(by.tagName('search-filter'));
  var displayAddButton = element(by.id('displayAddButton'));
  var displaysListTable = element(by.id('displaysListTable'));
  var tableHeaderName = element(by.id('tableHeaderName'));
  var tableHeaderStatus = element(by.id('tableHeaderStatus'));
  var tableHeaderActivity = element(by.id('tableHeaderActivity'));
  var displayItems = element.all(by.repeater('display in displays.list'));

  this.getDisplaysAppContainer = function() {
    return displaysAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getSearchFilter = function() {
    return searchFilter;
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

  this.getTableHeaderStatus = function() {
    return tableHeaderStatus;
  };

  this.getTableHeaderActivity = function() {
    return tableHeaderActivity;
  };

  this.getDisplayItems = function() {
    return displayItems;
  };
};

module.exports = DisplaysListPage;