'use strict';

var BrandingComponentPage = function() {
  var brandingPanel = element(by.css('.branding-component-container'));
  var editLogoLink = element(by.id('edit-logo'));
  var editColorsLink = element(by.id('edit-colors'));
  var logoRemovalConfirmationModal = element(by.id('confirmForm'));
  var confirmButton = element(by.id('confirm-primary'));


  this.getBrandingPanel = function () {
    return brandingPanel;
  };

  this.getEditLogoLink = function () {
    return editLogoLink;
  };

  this.getEditColorsLink = function () {
    return editColorsLink;
  };

  this.getLogoRemovalConfirmationModal = function () {
    return logoRemovalConfirmationModal;
  };

  this.getConfirmButton = function () {
    return confirmButton;
  };
};

module.exports = BrandingComponentPage;
