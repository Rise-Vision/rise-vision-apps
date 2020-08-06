'use strict';

var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var StoreProductsModalPage = require('../../editor/pages/storeProductsModalPage.js');
var TemplateEditorPage = require('./templateEditorPage.js');

var PresentationListPage = function() {
  var title = element(by.id('title'));

  var presentationAddButton = element(by.id('presentationAddButton'));

  var presentationListTable = element(by.id('presentationListTable'));
  var presentationItems = element.all(by.repeater('presentation in presentations.list'));

  var presentationsLoader = element(by.xpath('//div[@spinner-key="presentation-list-loader"]'));
  var templateEditorLoader = element(by.xpath('//div[@spinner-key="template-editor-loader"]'));

  var homepage = new HomePage();
  var signInPage = new SignInPage();
  var storeProductsModalPage = new StoreProductsModalPage();
  var templateEditorPage = new TemplateEditorPage();

  this.createNewPresentationFromTemplate = function(templateName, addTemplateButtonId) {

    helper.waitDisappear(presentationsLoader, 'Presentation loader');
    helper.wait(presentationAddButton, 'Add Presentation Button');
    helper.clickWhenClickable(presentationAddButton, 'Add Presentation Button');
    helper.wait(storeProductsModalPage.getStoreProductsModal(), 'Select Content Modal');
    helper.waitDisappear(storeProductsModalPage.getStoreProductsLoader(), 'Store Products Loader');
    storeProductsModalPage.getSearchInput().sendKeys(templateName);
    helper.wait(storeProductsModalPage.getAddButtonById(addTemplateButtonId), 'Add Example Template Button');
    browser.sleep(1000);
    helper.clickWhenClickable(storeProductsModalPage.getAddButtonById(addTemplateButtonId), 'Add Example Template Button');

    helper.wait(templateEditorPage.getTemplateEditorContainer(), 'Template Editor Container');
    browser.sleep(500);

    //wait for presentation to be auto-saved
    helper.wait(templateEditorPage.getSavedText(), 'Template auto-saved');

    templateEditorPage.dismissFeatureTour();
  };

  this.loadPresentationsList = function() {
    homepage.getEditor();
    signInPage.signIn();
  }

  this.loadCurrentCompanyPresentationList = function() {
    helper.clickWhenClickable(templateEditorPage.getPresentationsListLink(), 'Presentations List');
    helper.wait(this.getPresentationsLoader(), 'Presentation loader');
    helper.waitDisappear(this.getPresentationsLoader(), 'Presentation loader');
  }

  this.loadPresentation = function(presentationName) {
    this.loadCurrentCompanyPresentationList();
    helper.clickWhenClickable(templateEditorPage.getCreatedPresentationLink(presentationName), 'Presentation Link');
    helper.waitDisappear(this.getPresentationsLoader(), 'Presentation loader');
    helper.wait(templateEditorPage.getAttributeList(), 'Attribute List');
    browser.sleep(500); // Wait for transition to finish
  }

  this.changePresentationName = function(presentationName) {
    expect(templateEditorPage.getPresentationName().isEnabled()).to.eventually.be.false;
    helper.waitDisappear(this.getTemplateEditorLoader());
    templateEditorPage.getEditNameButton().click();
    expect(templateEditorPage.getPresentationName().isEnabled()).to.eventually.be.true;
    templateEditorPage.getPresentationName().sendKeys(presentationName + protractor.Key.ENTER);
  }

  this.getTitle = function() {
    return title;
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

  this.getTemplateEditorLoader = function() {
    return templateEditorLoader;
  }
};

module.exports = PresentationListPage;
