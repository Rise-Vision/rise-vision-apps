'use strict';
var AutoScheduleModalPage = function() {
  var autoScheduleModal = element(by.id('autoScheduleModal'));

  var closeButton = element(by.css('#autoScheduleModal .close'));
  
  this.getAutoScheduleModal = function() {
    return autoScheduleModal;
  };

  this.getCloseButton = function() {
    return closeButton;
  };

};

module.exports = AutoScheduleModalPage;
