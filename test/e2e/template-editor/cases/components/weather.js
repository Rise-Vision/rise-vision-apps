'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var WeatherComponentPage = require('./../../pages/components/weatherComponentPage.js');
var helper = require('rv-common-e2e').helper;

var WeatherComponentScenarios = function () {
  describe('Weather Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var weatherComponentPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      weatherComponentPage = new WeatherComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Weather Component Test', 'weather-component-test');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name;
      });
    });

    describe('basic operations', function () {

      it('should open properties of Weather Component', function () {
        templateEditorPage.selectComponent("Weather Forecast");
        browser.sleep(500); //wait for sidebar animation
        expect(weatherComponentPage.getFarenheitOption().isSelected()).to.eventually.not.be.true;
        expect(weatherComponentPage.getCelsiusOption().isSelected()).to.eventually.be.true;
      });

      it('should change the weather unit and auto-save after', function () {
        //change weather
        weatherComponentPage.getFarenheitLabel().click();

        expect(weatherComponentPage.getFarenheitOption().isSelected()).to.eventually.be.true;
        expect(weatherComponentPage.getCelsiusOption().isSelected()).to.eventually.not.be.true;

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should save the Presentation, reload it, and validate changes were saved', function () {
        //load presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent("Weather Forecast");

        expect(weatherComponentPage.getFarenheitOption().isSelected()).to.eventually.be.true;
        expect(weatherComponentPage.getCelsiusOption().isSelected()).to.eventually.not.be.true;
      });
    });
  });
};

module.exports = WeatherComponentScenarios;
