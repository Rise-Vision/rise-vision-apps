'use strict';

var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var TimeDateComponentPage = require('./../../pages/components/timeDateComponentPage.js');

var TimeDateComponentScenarios = function () {
  describe('Time and Date Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var timeDateComponentPage;
    var componentLabel = ' Time and Date - Time and Date Example';

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      timeDateComponentPage = new TimeDateComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Example Time and Date Component', 'example-time-and-date-component');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name;
      });
    });

    describe('basic operations', function () {
      it('should open properties of Counter Component', function () {
        templateEditorPage.selectComponent(componentLabel);
        expect(timeDateComponentPage.getDateFormat().isEnabled()).to.eventually.be.true;
        expect(timeDateComponentPage.getHours12().isEnabled()).to.eventually.be.true;
        expect(timeDateComponentPage.getHours24().isEnabled()).to.eventually.be.true;
        expect(timeDateComponentPage.getDisplayTz().isEnabled()).to.eventually.be.true;
        expect(timeDateComponentPage.getSpecificTz().isEnabled()).to.eventually.be.true;
      });

      it('should select date, time and timezone formatting', function () {
        helper.wait(timeDateComponentPage.getDateFormat(), 'Date format');
        timeDateComponentPage.selectOption(timeDateComponentPage.getDateFormatOptions().get(1).getText());

        helper.wait(timeDateComponentPage.getHours24Label(), '24 hours');
        timeDateComponentPage.getHours24Label().click();

        helper.wait(timeDateComponentPage.getSpecificTzLabel(), 'Specific TZ');
        timeDateComponentPage.getSpecificTzLabel().click();

        helper.wait(timeDateComponentPage.getTimeZone(), 'Time Zone');
        timeDateComponentPage.selectOption(timeDateComponentPage.getTimeZoneOptions().get(60).getText());

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should reload the Presentation, and validate changes were saved', function () {
        // Load presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent(componentLabel);

        helper.wait(timeDateComponentPage.getDateFormat(), 'Date format');

        expect(timeDateComponentPage.getDateFormat().getAttribute('value')).to.eventually.equal('string:MMM DD YYYY');
        expect(timeDateComponentPage.getTimeZone().getAttribute('value')).to.eventually.equal('string:America/Argentina/Buenos_Aires');
      });
    });
  });
};

module.exports = TimeDateComponentScenarios;
