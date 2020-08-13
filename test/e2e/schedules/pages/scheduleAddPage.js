'use strict';
var ScheduleAddPage = function() {
  var schedulesAppContainer = element(by.css('.schedules-app'));
  var title = element(by.id('title'));

  var scheduleNameField = element(by.css('schedule-fields stretchy-input input'));  
  var scheduleNameEditButton = element(by.css('schedule-fields stretchy-input #editButton'));

  var timelineAlwaysCheckboxMask = element(by.id('alwaysCheckboxMask'));
  var timelineAlwaysCheckbox = element(by.id('alwaysCheckbox'));
  var timelineField = element(by.id('timelineLabelMadero'));

  var distributionAllDisplaysCheckboxMask = element(by.id('allDisplaysCheckboxMask'));
  var distributionAllDisplaysCheckbox = element(by.id('allDisplaysCheckbox'));
  var distributionField = element(by.id('distributionFieldMadero'));
  var distributionFieldText = element(by.id('distributionFieldTextMadero'));

  var addPlaylistItemButton = element(by.id('addPlaylistItemButton'));
  var addUrlItemButton = element(by.id('addUrlItemButton'));
  var addPresentationItemButton = element(by.id('addPresentationItemButton'));

  var playlistItems = element.all(by.repeater('playlistItem in playlistItems'));

  var shareScheduleButton = element(by.id('tooltipButton'));

  var saveButton = element(by.id('saveButton'));
  var cancelButton = element(by.id('cancelButton'));
  var deleteButton = element(by.id('deleteButton'));
  var deleteForeverButton = element(by.id('confirm-primary'));

  var errorBox = element(by.id('errorBox'));

  var reassignDistribtionModal = element(by.css('.reassign-distribtion-modal'));
  var closeReassignButton = element(by.css('.reassign-distribtion-modal .close'));

  var scheduleLoader = element(by.xpath('//div[@spinner-key="schedule-loader"]'));


  this.getSchedulesAppContainer = function() {
    return schedulesAppContainer;
  };

  this.getTitle = function() {
    return title;
  };

  this.getScheduleNameField = function() {
    return scheduleNameField;
  };

  this.getScheduleNameEditButton = function() {
    return scheduleNameEditButton;
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

  this.getTimelineAlwaysCheckboxMask = function() {
    return timelineAlwaysCheckboxMask;
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

  this.getReassignDistribtionModal = function() {
    return reassignDistribtionModal;
  };

  this.getCloseReassignButton = function() {
    return closeReassignButton;
  };

  this.getScheduleLoader = function () {
    return scheduleLoader;
  };

  this.getDistributionAllDisplaysCheckboxMask = function() {
    return distributionAllDisplaysCheckboxMask;
  };

  this.getDistributionAllDisplaysCheckbox = function() {
    return distributionAllDisplaysCheckbox;
  };

};

module.exports = ScheduleAddPage;
