/*globals element, by */
(function(module) {
  'use strict';

  var HelpDropdownPage = function () {
    var helpDropdownButton = element(by.id("helpDropdownButton"));
    var askCommunityButton = element(by.id("askCommunityButton"));
    var getSupportButton = element(by.id("getSupportButton"));
    var getStartedButton = element(by.id("getStartedButton"));
    var documentationButton = element(by.id("documentationButton"));

    this.getHelpDropdownButton = function() {
      return helpDropdownButton;
    };

    this.getAskCommunityButton = function() {
      return askCommunityButton;
    };

    this.getSupportButton = function() {
      return getSupportButton;
    };

    this.getGetStartedButton = function() {
      return getStartedButton;
    };

    this.getDocumentationButton = function() {
      return documentationButton;
    };

  };

  module.exports = HelpDropdownPage;
})(module);
