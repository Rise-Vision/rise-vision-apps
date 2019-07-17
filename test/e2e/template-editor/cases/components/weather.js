'use strict';

var expect = require('rv-common-e2e').expect;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var WeatherComponentPage = require('./../../pages/components/weatherComponentPage.js');
var helper = require('rv-common-e2e').helper;

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

      presentationsListPage.createNewPresentationFromTemplate('Weather Component Test', 'weather-component-test');
    });

    describe('basic operations', function () {

      it('should auto-save the Presentation after it has been created', function () {
        helper.waitDisappear(templateEditorPage.getDirtyText());
        helper.waitDisappear(templateEditorPage.getSavingText());
        helper.wait(templateEditorPage.getSavedText(), 'Weather component auto-saved');
      });

      it('should open properties of Weather Component', function () {
        templateEditorPage.selectComponent("Weather - Weather Forecast");
        expect(weatherComponentPage.getFarenheitOption().isSelected()).to.eventually.not.be.true;
        expect(weatherComponentPage.getCelsiusOption().isSelected()).to.eventually.be.true;
      });

      it('should change the weather unit and auto-save after', function () {
        //change weather
        weatherComponentPage.getFarenheitLabel().click();

        expect(weatherComponentPage.getFarenheitOption().isSelected()).to.eventually.be.true;
        expect(weatherComponentPage.getCelsiusOption().isSelected()).to.eventually.not.be.true;

        helper.wait(templateEditorPage.getSavingText(), 'Weather component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Weather component auto-saved');
      });

      it('should save the Presentation, reload it, and validate changes were saved', function () {

        //change name and save presentation
        presentationsListPage.changePresentationName(presentationName);
        helper.wait(templateEditorPage.getSavingText(), 'Weather component auto-saving');
        helper.wait(templateEditorPage.getSavedText(), 'Weather component auto-saved');

        //log URL for troubleshooting
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
