'use strict';

var helper = require('rv-common-e2e').helper;
var StoreProductsModalPage = require('./storeProductsModalPage.js');
var WorkspacePage = require('./workspacePage.js');

var PresentationListPage = function() {
  var editorAppContainer = element(by.css('.editor-app'));

  var title = element(by.id('title'));
  var searchFilter = element(by.tagName('search-filter'));
  var presentationAddButton = element(by.id('presentationAddButton'));
  var sharedTemplatesButton = element(by.id('sharedTemplatesButton'));

  var presentationListTable = element(by.id('presentationListTable'));
  var tableHeaderName = element(by.id('tableHeaderName'));
  var tableHeaderStatus = element(by.id('tableHeaderStatus'));
  var tableHeaderChangeDate = element(by.id('tableHeaderChangeDate'));
  var presentationItems = element.all(by.repeater('presentation in presentations.list'));

  var presentationsLoader = element(by.xpath('//div[@spinner-key="presentation-list-loader"]'));

  this.openNewPresentation = function(isNotSubscribed) {
    var storeProductsModalPage = new StoreProductsModalPage();
    var workspacePage = new WorkspacePage();

    helper.waitDisappear(presentationsLoader,'Presentation loader');
    presentationAddButton.click();
    helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
    helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader(), 'Store Products Loader');
    storeProductsModalPage.getAddBlankPresentation().click();
    
    helper.wait(workspacePage.getWorkspaceContainer(), 'Workspace Container');

    browser.sleep(500);
  }

  this.getEditorAppContainer = function() {
    return editorAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getSearchFilter = function() {
    return searchFilter;
  };

  this.getPresentationAddButton = function() {
    return presentationAddButton;
  };

  this.getSharedTemplatesButton = function() {
    return sharedTemplatesButton;
  };

  this.getPresentationListTable = function() {
    return presentationListTable;
  };

  this.getTableHeaderName = function() {
    return tableHeaderName;
  };

  this.getTableHeaderStatus = function() {
    return tableHeaderStatus;
  };

  this.getTableHeaderChangeDate = function() {
    return tableHeaderChangeDate;
  };

  this.getPresentationItems = function() {
    return presentationItems;
  };

  this.getPresentationsLoader = function() {
    return presentationsLoader;
  }
};

module.exports = PresentationListPage;
