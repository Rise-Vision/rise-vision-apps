'use strict';

var BrandingColorsOverrideComponentPage = function() {
  var checkboxInput = element(by.css('.colors-checkbox'));
  var colorsContainer = element(by.id('branding-colors-override-container'));
  var baseColorInput = element(by.id('branding-colors-override-base'));
  var accentColorInput = element(by.id('branding-colors-override-accent'));

  this.getCheckboxInput = function () {
    return checkboxInput;
  };

  this.getColorsContainer = function () {
    return colorsContainer;
  };

  this.getBaseColorInput = function () {
    return baseColorInput;
  };

  this.getAccentColorInput = function () {
    return accentColorInput;
  };
};

module.exports = BrandingColorsOverrideComponentPage;
