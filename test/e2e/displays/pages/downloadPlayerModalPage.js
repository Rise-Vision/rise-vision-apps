'use strict';
var DownloadPlayerModalPage = function() {
  var downloadPlayerModal = element(by.css('.download-player-modal'));
  var title = element(by.css('.modal-body h4'));

  var installWindowsLink = element(by.id('installWindows'));

  var dismissButton = element(by.id('dismissButton'));

  this.getDownloadPlayerModal = function() {
    return downloadPlayerModal;
  };

  this.getTitle = function() {
    return title;
  };

  this.getInstallWindowsLink = function() {
    return installWindowsLink;
  };

  this.getDismissButton = function() {
    return dismissButton;
  };

};

module.exports = DownloadPlayerModalPage;
