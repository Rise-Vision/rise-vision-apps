'use strict';
var DownloadPlayerModalPage = function() {
  var downloadPlayerModal = element(by.css('.download-player-modal'));
  var title = element(by.css('.modal-body h4'));

  var downloadWindows64Button = element(by.id('downloadWindows64'));
  var dismissButton = element(by.id('dismissButton'));

  this.getDownloadPlayerModal = function() {
    return downloadPlayerModal;
  };

  this.getTitle = function() {
    return title;
  };

  this.getDownloadWindows64Button = function() {
    return downloadWindows64Button;
  };

  this.getDismissButton = function() {
    return dismissButton;
  };

};

module.exports = DownloadPlayerModalPage;
