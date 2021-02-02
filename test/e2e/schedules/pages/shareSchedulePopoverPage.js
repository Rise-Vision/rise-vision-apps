'use strict';
var ShareSchedulePopoverPage = function() {
  var shareSchedulePopover = element(by.css('.tooltip.tooltip-share-options'));

  var closeButton = element(by.css(".tooltip.tooltip-share-options .close"));
  var goBackButton = element(by.css(".tooltip.tooltip-share-options #shareSchedulePopoverGoBack"));

  var embedCodeTabLink = element(by.css('.tooltip.tooltip-share-options #embedButton'));
  var chromeExtensionTabLink = element(by.css('.tooltip.tooltip-share-options #extensionButton')); 

  var copyLinkButton = element(by.css('.tooltip.tooltip-share-options #copyUrlButton'));
  var copyLinkInput = element(by.css('.tooltip.tooltip-share-options input.copy-text-box'));
  var copyEmbedCodeButton = element(by.css('.tooltip.tooltip-share-options #copyEmbedCodeButton'));

  var twitterShareButton = element(by.css('.tooltip.tooltip-share-options #twitterShareButton'));

  var chromeExtensionLink = element(by.css('.tooltip.tooltip-share-options #chromeExtensionLink'));


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

  this.getCopyLinkInput = function() {
    return copyLinkInput;
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
