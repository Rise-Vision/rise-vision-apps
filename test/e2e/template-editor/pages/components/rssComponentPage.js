'use strict';

var RssComponentPage = function() {
  var rssFeedInput = element(by.id('te-rss-feed'));
  var rssMaxItemsSelect = element(by.id('te-rss-max-items'));
  var loader = element(by.xpath('//div[@spinner-key="rss-editor-loader"]'));
  var validationError = element(by.xpath('//template-component-rss//p[@on="validationResult"]/span'));
  var validationIconError = element(by.xpath('//template-component-rss//streamline-icon[@name="exclamation"]'));
  var validationIconValid = element(by.xpath('//template-component-rss//streamline-icon[@name="checkmark"]'));

  
  this.getRssFeedInput = function () {
    return rssFeedInput;
  };

  this.getRssMaxItemsSelect = function () {
    return rssMaxItemsSelect;
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

  this.getValidationMessage = function (key) {
    return element(by.xpath('//span[@ng-switch-when="' + key + '"]'));
  };
};

module.exports = RssComponentPage;
