'use strict';

var BrandingComponentPage = function() {
  var brandingPanel = element(by.css('.branding-component-container'));
  var editLogoLink = element(by.id('edit-logo'));
  var editColorsLink = element(by.id('edit-colors'));

  var logoRemovalConfirmationModal = element(by.cssContainingText('.modal-dialog', 'Are you sure you want to remove your logo?'));
  var confirmButton = element(by.id('confirm-primary'));

  var colorsPanel = element(by.css('.branding-colors-container'));
  var baseColorInput = element(by.id('branding-base-color'));
  var accentColorInput = element(by.id('branding-accent-color'));
  
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

  this.getColorsPanel = function () {
    return colorsPanel;
  };

  this.getBaseColorInput = function () {
    return baseColorInput;
  };

  this.getAccentColorInput = function () {
    return accentColorInput;
  };
};

module.exports = BrandingComponentPage;
