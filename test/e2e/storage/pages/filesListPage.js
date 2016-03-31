'use strict';
var FilesListPage = function() {
  var filesListTable = element(by.id('storageFileList'));
  var tableHeaderName = element(by.id('tableHeaderName'));
  var fileItems = element.all(by.repeater('file in filesDetails.files | filter:search.query | orderBy:orderByAttribute:reverseSort track by $index'));

  this.getFilesListTable = function() {
    return filesListTable;
  };

  this.getTableHeaderName = function() {
    return tableHeaderName;
  };

  this.getFileItems = function() {
    return fileItems;
  };
};

module.exports = FilesListPage;
