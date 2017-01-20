'use strict';
var SchedulesListPage = function() {
  var schedulesAppContainer = element(by.css('.schedules-app'));
  var title = element(by.id('title'));
  var searchFilter = element(by.tagName('search-filter'));
  var scheduleAddButton = element(by.id('scheduleAddButton'));
  var schedulesListTable = element(by.id('schedulesListTable'));
  var tableHeaderName = element(by.id('tableHeaderName'));
  var tableHeaderChangeDate = element(by.id('tableHeaderChangeDate'));
  var scheduleItems = element.all(by.repeater('schedule in schedules.list'));
  var loader = element(by.xpath('//div[@spinner-key="schedules-list-loader"]'));

  this.getSchedulesAppContainer = function() {
    return schedulesAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getSearchFilter = function() {
    return searchFilter;
  };

  this.getScheduleAddButton = function() {
    return scheduleAddButton;
  };

  this.getSchedulesListTable = function() {
    return schedulesListTable;
  };

  this.getTableHeaderName = function() {
    return tableHeaderName;
  };

  this.getTableHeaderChangeDate = function() {
    return tableHeaderChangeDate;
  };

  this.getScheduleItems = function() {
    return scheduleItems;
  };

  this.getLoader = function() {
    return loader;
  };
};

module.exports = SchedulesListPage;
