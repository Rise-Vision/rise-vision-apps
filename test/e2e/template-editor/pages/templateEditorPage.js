'use strict';

var TemplateEditorPage = function() {
  var seePlansLink = element(by.xpath('//a[contains(text(), "See Our Plans")]'));
  var presentationsListLink = element(by.css('[ng-href="/editor"]'));
  var templateEditorContainer = element(by.id('template-editor'));
  var attributeList = element(by.css('.attribute-list'));
  var componentItems = element.all(by.repeater('comp in components track by $index'));
  var presentationName = element(by.id('presentationName'));
  var editNameButton = element(by.id('editNameButton'));
  var deleteButton = element(by.id('deleteButton'));
  var saveButton = element(by.id('saveButtonDesktop'));
  var publishButton = element(by.id('publishButtonDesktop'));
  var imageComponentSelector = '//div[div/span[contains(text(), "Image - ")]]';
  var imageComponent = element(by.xpath(imageComponentSelector));
  var imageComponentEdit = element(by.xpath(imageComponentSelector + '/div/a'));
  var backToComponentsButton = element(by.css('[ng-click="onBackButton();"]'));
  var financialComponentSelector = '//div[div/span[contains(text(), "Financial - ")]]';
  var financialComponent = element(by.xpath(financialComponentSelector));
  var financialComponentEdit = element(by.xpath(financialComponentSelector + '/div/a'));
  var instrumentItems = element.all(by.repeater('instr in instruments track by $index'));
  var addCurrenciesButton = element(by.css('[ng-click="showSymbolSearch()"]'));
  var addInstrumentButton = element(by.css('[ng-click="addInstrument()"]'));
  var jpyUsdSelector = element(by.css('[for="JPYUSD=X"]'));

  this.seePlansLink = function () {
    return seePlansLink;
  };

  this.getTemplateEditorContainer = function () {
    return templateEditorContainer;
  };

  this.getAttributeList = function () {
    return attributeList;
  };

  this.getPresentationsListLink = function () {
    return presentationsListLink;
  };

  this.getCreatedPresentationLink = function (presentationName) {
    return element(by.xpath('//a[strong[contains(text(), "' + presentationName + '")]]'));
  };

  this.getComponentItems = function () {
    return componentItems;
  };

  this.getPresentationName = function () {
    return presentationName;
  };

  this.getEditNameButton = function () {
    return editNameButton;
  };

  this.getDeleteButton = function () {
    return deleteButton;
  };

  this.getSaveButton = function () {
    return saveButton;
  };

  this.getPublishButton = function () {
    return publishButton;
  };

  this.getImageComponent = function () {
    return imageComponent;
  };

  this.getImageComponentEdit = function () {
    return imageComponentEdit;
  };

  this.getBackToComponentsButton = function () {
    return backToComponentsButton;
  };

  this.getFinancialComponent = function () {
    return financialComponent;
  };

  this.getFinancialComponentEdit = function () {
    return financialComponentEdit;
  };

  this.getInstrumentItems = function () {
    return instrumentItems;
  };

  this.getAddCurrenciesButton = function () {
    return addCurrenciesButton;
  };

  this.getAddInstrumentButton = function () {
    return addInstrumentButton;
  };

  this.getJpyUsdSelector = function () {
    return jpyUsdSelector;
  };
};

module.exports = TemplateEditorPage;
