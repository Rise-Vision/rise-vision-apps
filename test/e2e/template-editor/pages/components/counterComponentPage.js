'use strict';

var CounterComponentPage = function() {
  var specificDateLabel = element(by.id('specificDateLabel'));
  var specificTimeLabel = element(by.id('specificTimeLabel'));
  var targetDate = element(by.id('targetDate'));
  var targetTime = element(by.id('targetTime'));
  var datePickerButton = element(by.id('datePickerButton'));
  var timePickerButton = element(by.id('timePickerButton'));
  var increaseHours = element(by.css('[ng-click="increaseHours()"]'));
  var decreaseMinutes = element(by.css('[ng-click="decreaseMinutes()"]'));
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

  this.getTargetTime = function () {
    return targetTime;
  };

  this.getDatePickerButton = function () {
    return datePickerButton;
  };

  this.getTimePickerButton = function () {
    return timePickerButton;
  };

  this.getDatePickerDayButton = function () {
    return element(by.css('[ng-repeat="dt in row track by dt.date"]:nth-child(7) button'));
  };

  this.getIncreaseHours = function () {
    return increaseHours;
  };

  this.getDecreaseMinutes = function () {
    return decreaseMinutes;
  };

  this.getCompletionMessage = function () {
    return completionMessage;
  };
};

module.exports = CounterComponentPage;
