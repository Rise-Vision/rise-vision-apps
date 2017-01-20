'use strict';
var config = require('../../config/config.json');

var IframePage = function() {
  var singleFileSelectorUrl = config.rootUrl + '/storage-selector.html#/?selector-type=single-file';
  var singleFolderSelectorUrl = config.rootUrl + '/storage-selector.html#/?selector-type=single-folder';

  this.getSingleFileSelector = function() {
    browser.get(singleFileSelectorUrl);
  };

  this.getSingleFolderSelector = function() {
    browser.get(singleFolderSelectorUrl);
  };
};

module.exports = IframePage;
