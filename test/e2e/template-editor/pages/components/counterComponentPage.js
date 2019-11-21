'use strict';

var CounterComponentPage = function() {
  var specificDateLabel = element(by.id('specificDateLabel'));
  var specificTimeLabel = element(by.id('specificTimeLabel'));
  var targetDate = element(by.id('targetDate'));
  var targetDateTime = element(by.id('targetDateTime'));
  var targetTime = element(by.id('targetTime'));
  var datePickerButton = element(by.id('datePickerButton'));
  var dateTimePickerButton = element(by.id('dateTimePickerButton'));
  var timePickerButton = element(by.id('timePickerButton'));
  var completionMessage = element(by.id('completionMessage'));

  this.getSpecificDateLabel = function () {
    return specificDateLabel;
  };

  this.getSpecificTimeLabel = function () {
    return specificTimeLabel;
  };

  this.getTargetDate = function () {
    return targetDate;
  };

  this.getTargetDateTime = function () {
    return targetDateTime;
  };

  this.getTargetTime = function () {
    return targetTime;
  };

  this.getDatePickerButton = function () {
    return datePickerButton;
  };

  this.getDateTimePickerButton = function () {
    return dateTimePickerButton;
  };

  this.getTimePickerButton = function () {
    return timePickerButton;
  };

  this.getDatePickerDayButton = function () {
    return element(by.css('[ng-repeat="dt in row track by dt.date"]:nth-child(7) button'));
  };

  this.getIncreaseHours = function (section) {
    return element(by.css('#' + section + 'Radio [ng-click="increaseHours()"]'));
  };

  this.getDecreaseMinutes = function (section) {
    return element(by.css('#' + section + 'Radio [ng-click="decreaseMinutes()"]'));
  };

  this.getCompletionMessage = function () {
    return completionMessage;
  };
};

module.exports = CounterComponentPage;
