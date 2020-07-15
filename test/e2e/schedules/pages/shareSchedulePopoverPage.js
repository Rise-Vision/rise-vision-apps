'use strict';
var ShareSchedulePopoverPage = function() {
  var shareSchedulePopover = element(by.id('shareSchedulePopover'));

  var closeButton = element(by.css("#shareSchedulePopover .close"));
  var goBackButton = element(by.id("shareSchedulePopoverGoBack"));

  var embedCodeTabLink = element(by.id('embedButton'));
  var chromeExtensionTabLink = element(by.id('extensionButton')); 

  var copyLinkButton = element(by.id('copyUrlButton'));
  var copyEmbedCodeButton = element(by.id('copyEmbedCodeButton'));

  var twitterShareButton = element(by.id('twitterShareButton'));

  var chromeExtensionLink = element(by.id('chromeExtensionLink'));


  this.getShareSchedulePopover = function() {
    return shareSchedulePopover;
  };

  this.getCloseButton = function() {
    return closeButton;
  };

  this.getGoBackButton = function() {
    return goBackButton;
  };

  this.getEmbedCodeTabLink = function() {
    return embedCodeTabLink;
  };

  this.getChromeExtensionTabLink = function() {
    return chromeExtensionTabLink;
  };

  this.getCopyLinkButton = function() {
    return copyLinkButton;
  };

  this.getCopyEmbedCodeButton = function() {
    return copyEmbedCodeButton;
  };

  this.getTwitterShareButton = function() {
    return twitterShareButton;
  };

  this.getChromeExtensionLink = function() {
    return chromeExtensionLink;
  };

};

module.exports = ShareSchedulePopoverPage;
