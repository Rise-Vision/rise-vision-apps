'use strict';
var SharedScheduleModalPage = function() {
  var sharedScheduleModal = element(by.id('sharedScheduleModal'));

  var modalTitle = element(by.css('.modal-title'));
  var closeButton = element(by.css(".modal-header .close"));

  var embedCodeTabLink = element(by.id('embedCodeTabLink'));
  var socialMediaTabLink = element(by.id('socialMediaTabLink'));
  var chromeExtensionTabLink = element(by.id('chromeExtensionTabLink')); 

  var copyLinkButton = element(by.id('copyUrlButton'));
  var copyEmbedCodeButton = element(by.id('copyEmbedCodeButton'));

  var twitterShareButton = element(by.id('twitterShareButton'));

  var chromeExtensionLink = element(by.id('chromeExtensionLink'));


  this.getSharedScheduleModal = function() {
    return sharedScheduleModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };

  this.getCloseButton = function() {
    return closeButton;
  };

  this.getEmbedCodeTabLink = function() {
    return embedCodeTabLink;
  };

  this.getSocialMediaTabLink = function() {
    return socialMediaTabLink;
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

module.exports = SharedScheduleModalPage;
