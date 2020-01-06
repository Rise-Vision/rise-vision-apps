'use strict';

var TimeDateComponentPage = function() {
  var dateFormat = element(by.id('te-td-date-format'));
  var dateFormatOptions = element.all(by.options('df.format as df.date for df in dateFormats'));
  var hours12 = element(by.id('Hours12'));
  var hours24 = element(by.id('Hours24'));
  var hours24Label = element(by.id('Hours24Label'));
  var displayTz = element(by.id('DisplayTz'));
  var specificTz = element(by.id('SpecificTz'));
  var specificTzLabel = element(by.id('SpecificTzLabel'));
  var timeZone = element(by.id('te-td-timezone'));
  var timeZoneOptions = element.all(by.options('tz for tz in timezones'));

  this.getDateFormat = function () {
    return dateFormat;
  };

  this.getDateFormatOptions = function () {
    return dateFormatOptions;
  };

  this.getHours12 = function () {
    return hours12;
  };

  this.getHours24 = function () {
    return hours24;
  };

  this.getHours24Label = function () {
    return hours24Label;
  };

  this.getDisplayTz = function () {
    return displayTz;
  };

  this.getSpecificTz = function () {
    return specificTz;
  };

  this.getSpecificTzLabel = function () {
    return specificTzLabel;
  };

  this.getTimeZone = function () {
    return timeZone;
  };

  this.getTimeZoneOptions = function () {
    return timeZoneOptions;
  };

  this.selectOption = function (optionText) {
    element(by.cssContainingText('option', optionText)).click();
  };
};

module.exports = TimeDateComponentPage;
