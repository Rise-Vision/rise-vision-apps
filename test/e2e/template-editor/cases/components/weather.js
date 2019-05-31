'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var WeatherComponentPage = require('./../../pages/components/weatherComponentPage.js');

var WeatherComponentScenarios = function () {

  browser.driver.manage().window().setSize(1920, 1080);

  describe('Weather Component', function () {
    var testStartTime = Date.now();
    var presentationName = 'Weather Component Presentation - ' + testStartTime;
    var presentationsListPage;
    var templateEditorPage;
    var weatherComponentPage;

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      weatherComponentPage = new WeatherComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('"Weather Component Test"', 'weather-component-test');
    });

    describe('basic operations', function () {

      it('should open properties of Weather Component', function () {
        templateEditorPage.selectComponent("Weather - Weather Forecast");
        expect(weatherComponentPage.getFarenheitOption().isSelected()).to.eventually.not.be.true;
        expect(weatherComponentPage.getCelsiusOption().isSelected()).to.eventually.be.true;
      });

      it('should save the Presentation, reload it, and validate changes were saved', function () {

        //change weather
        weatherComponentPage.getFarenheitLabel().click();
    
        expect(weatherComponentPage.getFarenheitOption().isSelected()).to.eventually.be.true;
        expect(weatherComponentPage.getCelsiusOption().isSelected()).to.eventually.not.be.true;

        //save presentation
        presentationsListPage.changePresentationName(presentationName);
        presentationsListPage.savePresentation();
        expect(templateEditorPage.getSaveButton().isEnabled()).to.eventually.be.true;

        //log URL for troubeshooting 
        browser.getCurrentUrl().then(function(actualUrl) {
          console.log(actualUrl);
        });
        browser.sleep(100);

        //load presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent("Weather - Weather Forecast");

        expect(weatherComponentPage.getFarenheitOption().isSelected()).to.eventually.be.true;
        expect(weatherComponentPage.getCelsiusOption().isSelected()).to.eventually.not.be.true;
      });
    });
  });
};

module.exports = WeatherComponentScenarios;
