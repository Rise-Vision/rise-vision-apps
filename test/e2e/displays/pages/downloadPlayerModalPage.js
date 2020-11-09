'use strict';
var DownloadPlayerModalPage = function() {
  var downloadPlayerModal = element(by.css('.download-player-modal'));
  var title = element(by.css('.modal-body h4'));

  var downloadWindows32Link = element(by.id('downloadWindows32'));
  var downloadWindows64Link = element(by.id('downloadWindows64'));
  var downloadUbuntu32Link = element(by.id('downloadUbuntu32'));
  var downloadUbuntu64Link = element(by.id('downloadUbuntu64'));
  var downloadRaspberryLink = element(by.id('downloadRaspberry'));

  var dismissButton = element(by.id('dismissButton'));

  this.getDownloadPlayerModal = function() {
    return downloadPlayerModal;
  };

  this.getTitle = function() {
    return title;
  };

  this.getDownloadWindows32Link = function() {
    return downloadWindows32Link;
  };

  this.getDownloadWindows64Link = function() {
    return downloadWindows64Link;
  };

  this.getDownloadUbuntu32Link = function() {
    return downloadUbuntu32Link;
  };

  this.getDownloadUbuntu64Link = function() {
    return downloadUbuntu64Link;
  };

  this.getDownloadRaspberryLink = function() {
    return downloadRaspberryLink;
  };

  this.getDismissButton = function() {
    return dismissButton;
  };

};

module.exports = DownloadPlayerModalPage;
