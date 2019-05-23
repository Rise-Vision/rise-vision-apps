'use strict';

var WeatherComponentPage = function() {
  var farenheitOption = element(by.id('farenheit'));
  var farenheitLabel = element(by.css('label[for="farenheit"]'));
  var celsiusOption = element(by.id('celsius'));
  var celsiusLabel = element(by.css('label[for="celsius"]'));

  this.getFarenheitOption = function () {
    return farenheitOption;
  };

  this.getFarenheitLabel = function () {
    return farenheitLabel;
  };

  this.getCelsiusOption = function () {
    return celsiusOption;
  };

  this.getCelsiusLabel = function () {
    return celsiusLabel;
  };

};

module.exports = WeatherComponentPage;
