'use strict';
var CopyUrlModalPage = function() {
  var copyUrlModal = element(by.id('copyUrlModal'));
  var modalTitle = element(by.css('#copyUrlModal:h5'));
  var copyUrlInput = element(by.id('copyUrlInput'));

  var closeButton = element(by.id('closeButton'));

  this.getCopyUrlModal = function() {
    return copyUrlModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };

  this.getCopyUrlInput = function() {
    return copyUrlInput;
  };

  this.getCloseButton = function() {
    return closeButton;
  };
  
};

module.exports = CopyUrlModalPage;
