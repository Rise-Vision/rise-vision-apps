'use strict';

var helper = require('rv-common-e2e').helper;

var TemplateEditorPage = function() {
  var seePlansLink = element(by.xpath('//a[contains(text(), "See Our Plans")]'));
  var presentationsListLink = element(by.css('[ng-href="/editor?cid="]'));
  var templateEditorContainer = element(by.id('template-editor'));
  var attributeList = element(by.css('.attribute-list'));
  var componentItems = element.all(by.css('.attribute-row.attribute-row-hover'));
  var presentationName = element(by.css('.presentation-name .input-stretchy'));
  var editNameButton = element(by.css('.presentation-name #editButton'));
  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.buttonText('Delete Forever'));
  var errorModal = element(by.xpath('//h4[contains(text(), "Failed to")]'));
  var publishButton = element(by.id('publishButtonDesktop'));
  var imageComponentSelector = '//div[div/a[contains(text(), "Test Instance")]]';
  var imageComponent = element(by.xpath('(' + imageComponentSelector + ')[1]'));
  var backToComponentsButton = element(by.id('back-button'));
  var financialDataLicenseMessage = element(by.cssContainingText('.modal-dialog', 'Financial Data License Required'));
  var financialDataLicenseCloseButton = element(by.css('#confirmForm .close'));
  var brandingContainer = element(by.id('branding'));
  var brandingColorsOverrideContainer = element(by.id('branding-colors-override'));
  var brandingEditLink = element(by.id('branding-edit'));
  var brandingColorsOverrideEditLink = element(by.id('branding-colors-override-edit'));

  var autoSaveXPath = '//span[@id="autoSavingDesktop"]//span[contains(text(), "TEXT")]';
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

  this.getBackToComponentsButton = function () {
    return backToComponentsButton;
  };

  this.getFinancialDataLicenseMessage = function() {
    return financialDataLicenseMessage;
  };

  this.getFinancialDataLicenseCloseButton = function() {
    return financialDataLicenseCloseButton;
  }

  this.getBrandingContainer = function () {
    return brandingContainer;
  };

  this.getBrandingEditLink = function () {
    return brandingEditLink;
  };

  this.getBrandingColorsOverrideContainer = function () {
    return brandingColorsOverrideContainer;
  };

  this.getBrandingColorsOverrideEditLink = function () {
    return brandingColorsOverrideEditLink;
  };

  this.waitForAutosave = function() {
    browser.sleep(500);
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
    var componentEditLink = element(by.cssContainingText('.attribute-desc a', selectorLabel));

    helper.wait(this.getAttributeList(), 'Attribute List');
    helper.wait(componentEditLink, 'Component Edit');
    helper.clickWhenClickable(componentEditLink, 'Component Edit');
    browser.sleep(1000); //wait animation
  }
};

module.exports = TemplateEditorPage;
