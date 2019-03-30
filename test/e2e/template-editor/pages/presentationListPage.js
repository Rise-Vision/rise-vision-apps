'use strict';

var helper = require('rv-common-e2e').helper;
var StoreProductsModalPage = require('../../editor/pages/storeProductsModalPage.js');
var TemplateEditorPage = require('./templateEditorPage.js');

var PresentationListPage = function() {
  var presentationAddButton = element(by.id('presentationAddButton'));

  var presentationListTable = element(by.id('presentationListTable'));
  var presentationItems = element.all(by.repeater('presentation in presentations.list'));

  var presentationsLoader = element(by.xpath('//div[@spinner-key="presentation-list-loader"]'));

  this.openNewExampleTemplate = function() {
    var storeProductsModalPage = new StoreProductsModalPage();
    var templateEditorPage = new TemplateEditorPage();

    helper.waitDisappear(presentationsLoader, 'Presentation loader');
    presentationAddButton.click();
    helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
    helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader(), 'Store Products Loader');
    storeProductsModalPage.getSearchInput().sendKeys('Example Financial');
    helper.wait(storeProductsModalPage.getAddExampleTemplate(), 'Add Example Template');
    storeProductsModalPage.getAddExampleTemplate().click();

    helper.wait(templateEditorPage.getTemplateEditorContainer(), 'Template Editor Container');
    browser.sleep(500);
  };

  this.getPresentationAddButton = function() {
    return presentationAddButton;
  };

  this.getPresentationListTable = function() {
    return presentationListTable;
  };

  this.getPresentationItems = function() {
    return presentationItems;
  };

  this.getPresentationsLoader = function() {
    return presentationsLoader;
  }
};

module.exports = PresentationListPage;
