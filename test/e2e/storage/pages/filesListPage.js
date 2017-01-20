'use strict';
var FilesListPage = function() {
  var searchInput = element(by.id('storageSelectorSearchInput'));
  var filesListLoader = element(by.xpath('//div[@spinner-key="storage-selector-loader"]'));
  var filesListTable = element(by.id('storageFileList'));
  var filesGrid = element(by.id('storageFilesGrid'));
  var tableHeaderName = element(by.id('tableHeaderName'));
  var fileItems = element.all(by.repeater('file in filesDetails.files | filter:search.query | orderBy:orderByAttribute:reverseSort track by $index'));
  var gridViewSelector = element(by.id('gridViewSelector'));
  var listViewSelector = element(by.id('listViewSelector'));
  
  var helper = require('rv-common-e2e').helper;
  
  this.filterFileList = function(query) {
    helper.wait(this.getSearchInput(), 'Wait for search input');

    this.getSearchInput().clear();
    this.getSearchInput().sendKeys(query);
  }

  this.getSearchInput = function(){
    return searchInput;
  };

  this.getGridViewSelector = function() {
    return gridViewSelector;
  };

  this.getListViewSelector = function() {
    return listViewSelector;
  };

  this.getFilesListLoader = function() {
    return filesListLoader;
  };

  this.getFilesListTable = function() {
    return filesListTable;
  };

  this.getFilesGrid = function() {
    return filesGrid;
  };

  this.getTableHeaderName = function() {
    return tableHeaderName;
  };

  this.getFileItems = function() {
    return fileItems;
  };

};

module.exports = FilesListPage;
