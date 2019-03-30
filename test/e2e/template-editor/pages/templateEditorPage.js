'use strict';

var TemplateEditorPage = function() {
  var seePlansLink = element(by.xpath('//a[contains(text(), "See Our Plans")]'));
  var templateEditorContainer = element(by.id('template-editor'));
  var componentItems = element.all(by.repeater('comp in components track by $index'));
  var presentationName = element(by.id('presentationName'));
  var editNameButton = element(by.id('editNameButton'));
  var deleteButton = element(by.id('deleteButton'));
  var saveButton = element(by.id('saveButtonDesktop'));
  var publishButton = element(by.id('publishButtonDesktop'));
  var financialComponentSelector = '//div[div/span[contains(text(), "Financial - ")]]';
  var financialComponent = element(by.xpath(financialComponentSelector));
  var financialComponentEdit = element(by.xpath(financialComponentSelector + '/div/a'));
  var addCurrenciesButton = element(by.css('[ng-click="showSymbolSearch()"]'));
  var addInstrumentButton = element(by.css('[ng-click="addInstrument()"]'));
  var cadUsdSelector = element(by.css('[for="CADUSD=X"]'));

  this.seePlansLink = function () {
    return seePlansLink;
  };

  this.getTemplateEditorContainer = function () {
    return templateEditorContainer;
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

  this.getFinancialComponent = function () {
    return financialComponent;
  };

  this.getFinancialComponentEdit = function () {
    return financialComponentEdit;
  };

  this.getAddCurrenciesButton = function () {
    return addCurrenciesButton;
  };

  this.getAddInstrumentButton = function () {
    return addInstrumentButton;
  };

  this.getCadUsdSelector = function () {
    return cadUsdSelector;
  };
};

module.exports = TemplateEditorPage;
