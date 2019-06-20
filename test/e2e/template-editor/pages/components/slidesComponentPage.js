'use strict';

var SlidesComponentPage = function() {
  var srcInput = element(by.id('te-slides-src'));
  var durationInput = element(by.id('te-slides-duration'));
  var loader = element(by.xpath('//div[@spinner-key="slides-editor-loader"]'));
  var validationError = element(by.xpath('//template-component-slides//p[@on="validationResult"]/span'));
  var validationIconError = element(by.xpath('//template-component-slides//streamline-icon[@name="exclamation"]'));
  var validationIconValid = element(by.xpath('//template-component-slides//streamline-icon[@name="checkmark"]'));

  
  this.getSrcInput = function () {
    return srcInput;
  };

  this.getDurationInput = function () {
    return durationInput;
  };

  this.getLoader = function () {
    return loader;
  };

  this.getValidationError = function () {
    return validationError;
  };

  this.getValidationIconError = function () {
    return validationIconError;
  };

  this.getValidationIconValid = function () {
    return validationIconValid;
  };
};

module.exports = SlidesComponentPage;
