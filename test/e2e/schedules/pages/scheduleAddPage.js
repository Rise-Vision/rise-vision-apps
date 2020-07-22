'use strict';
var ScheduleAddPage = function() {
  var schedulesAppContainer = element(by.css('.schedules-app'));
  var title = element(by.id('title'));

  var displayNameField = element(by.model('factory.schedule.name'));

  var timelineAlwaysCheckbox = element(by.model('timeline.always'));
  var timelineField = element(by.id('timelineTextbox'));


  var distributionAllDisplaysCheckbox = element(by.model('distributeToAll'));
  var distributionField = element(by.id('distributionField'));
  var distributionFieldText = element(by.id('distributionFieldText'));

  var addPlaylistItemButton = element(by.id('addPlaylistItemButton'));
  var addUrlItemButton = element(by.id('addUrlItemButton'));
  var addPresentationItemButton = element(by.id('addPresentationItemButton'));

  var playlistItems = element.all(by.repeater('playlistItem in playlistItems'));

  var shareScheduleButton = element(by.id('tooltipButton'));

  var saveButton = element(by.id('saveButton'));
  var cancelButton = element(by.id('cancelButton'));
  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.buttonText('Delete Forever'));

  var errorBox = element(by.id('errorBox'));

  var scheduleLoader = element(by.xpath('//div[@spinner-key="schedule-loader"]'));


  this.getSchedulesAppContainer = function() {
    return schedulesAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getScheduleNameField = function() {
    return displayNameField;
  };

  this.getShareScheduleButton = function() {
    return shareScheduleButton;
  };

  this.getSaveButton = function() {
    return saveButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };

  this.getDeleteButton = function() {
    return deleteButton;
  };

  this.getDeleteForeverButton = function() {
    return deleteForeverButton;
  };

  this.getAddPlaylistItemButton = function() {
    return addPlaylistItemButton;
  };

  this.getAddPresentationItemButton = function() {
    return addPresentationItemButton;
  };

  this.getAddUrlItemButton = function() {
    return addUrlItemButton;
  };

  this.getPlaylistItems = function() {
    return playlistItems;
  };
  
  this.getTimelineAlwaysCheckbox = function() {
    return timelineAlwaysCheckbox;
  };

  this.getTimelineField = function () {
    return timelineField;
  };

  this.getDistributionField = function () {
    return distributionField;
  };

  this.getDistributionFieldText = function () {
    return distributionFieldText;
  };

  this.getErrorBox = function () {
    return errorBox;
  };

  this.getScheduleLoader = function () {
    return scheduleLoader;
  };

  this.getDistributionAllDisplaysCheckbox = function() {
    return distributionAllDisplaysCheckbox;
  };

};

module.exports = ScheduleAddPage;
