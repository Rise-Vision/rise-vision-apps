'use strict';

var helper = require('rv-common-e2e').helper;

var TemplateEditorPage = function() {
  var seePlansLink = element(by.xpath('//a[contains(text(), "See Our Plans")]'));
  var presentationsListLink = element(by.css('[ng-href="/editor"]'));
  var templateEditorContainer = element(by.id('template-editor'));
  var attributeList = element(by.css('.attribute-list'));
  var componentItems = element.all(by.repeater('comp in components track by $index'));
  var presentationName = element(by.id('presentationName'));
  var editNameButton = element(by.id('editNameButton'));
  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.buttonText('Delete Forever'));
  var errorModal = element(by.xpath('//h4[contains(text(), "Failed to")]'));
  var publishButton = element(by.id('publishButtonDesktop'));
  var imageComponentSelector = '//div[div/span[contains(text(), "Test Instance")]]';
  var imageComponent = element(by.xpath('(' + imageComponentSelector + ')[1]'));
  var imageComponentEdit = element(by.xpath('(' + imageComponentSelector + '/div/a)[1]'));
  var backToComponentsButton = element(by.css('[ng-click="onBackButton();"]'));
  var financialDataLicenseMessage = element(by.css('.financial-data-license-message'));
  var financialDataLicenseCloseButton = element(by.css('#confirmForm .close'));
  var licenseRequiredMessage = element(by.css('.display-license-required-message'));
  var brandingContainer = element(by.id('branding'));
  var brandingEditLink = element(by.id('branding-edit'));

  var autoSaveXPath = '//div[@id="autoSavingDesktop"]//div[contains(text(), "TEXT")]';
  var dirtyText = element(by.xpath(autoSaveXPath.replace('TEXT', 'Unsaved changes')));
  var savedText = element(by.xpath(autoSaveXPath.replace('TEXT', 'All changes saved')));
  var savingText = element(by.xpath(autoSaveXPath.replace('TEXT', 'Saving changes')));

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

  this.getDeleteForeverButton = function () {
    return deleteForeverButton;
  };

  this.getErrorModal = function () {
    return errorModal;
  };

  this.getSavedText = function () {
    return savedText;
  };

  this.getSavingText = function () {
    return savingText;
  };

  this.getDirtyText = function () {
    return dirtyText;
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

  this.getFinancialDataLicenseMessage = function() {
    return financialDataLicenseMessage;
  };

  this.getFinancialDataLicenseCloseButton = function() {
    return financialDataLicenseCloseButton;
  }

  this.getLicenseRequiredMessage = function() {
    return licenseRequiredMessage;
  };

  this.getBrandingContainer = function () {
    return brandingContainer;
  };

  this.getBrandingEditLink = function () {
    return brandingEditLink;
  };

  this.waitForAutosave = function() {
    savedText.isDisplayed().then(function(isDisplayed) {
      if (!isDisplayed) {
        //wait for presentation to be auto-saved
        helper.waitDisappear(dirtyText);
        helper.waitDisappear(savingText, 'Template Editor auto-saving');
        helper.wait(savedText, 'Template Editor auto-saved');
      }
    });
  };

  this.dismissFinancialDataLicenseMessage = function() {
    helper.wait(financialDataLicenseMessage, 'Financial Data License Message');

    //workaround as protractor doesn't click a modal in front of the preview iframe
    financialDataLicenseCloseButton.sendKeys(protractor.Key.ESCAPE);
    // helper.clickWhenClickable(financialDataLicenseCloseButton, 'Financial Data License Close Button');
  }

  this.selectComponent = function (selectorLabel) {
    var componentEditLink = element(by.xpath('//div[div/span[contains(text(), "' + selectorLabel + '")]]/div/a'));

    helper.wait(this.getAttributeList(), 'Attribute List');
    helper.wait(componentEditLink, 'Component Edit');
    helper.clickWhenClickable(componentEditLink, 'Component Edit');
  }
};

module.exports = TemplateEditorPage;
