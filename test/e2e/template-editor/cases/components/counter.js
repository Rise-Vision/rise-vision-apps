'use strict';

var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var CounterComponentPage = require('./../../pages/components/counterComponentPage.js');

var CounterComponentScenarios = function () {
  describe('Counter Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var counterComponentPage;
    var componentLabel = 'Countdown Example';

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      counterComponentPage = new CounterComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Example Counter Component', 'example-counter-component');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name;
      });
    });

    describe('basic operations', function () {
      it('should open properties of Counter Component', function () {
        templateEditorPage.selectComponent(componentLabel);
        expect(counterComponentPage.getSpecificDateLabel().isEnabled()).to.eventually.be.true;
        expect(counterComponentPage.getSpecificTimeLabel().isEnabled()).to.eventually.be.true;
        expect(counterComponentPage.getTargetDate().getAttribute('value')).to.eventually.equal('');
        expect(counterComponentPage.getTargetTime().getAttribute('value')).to.eventually.equal('12:00 AM');
      });

      it('should select a date', function () {
        helper.wait(counterComponentPage.getSpecificDateLabel(), 'Specific date ratio');
        counterComponentPage.getSpecificDateLabel().click();

        helper.wait(counterComponentPage.getDatePickerButton(), 'Target date button');
        counterComponentPage.getDatePickerButton().click();

        helper.wait(counterComponentPage.getDatePickerDayButton(), 'Seventh button');
        counterComponentPage.getDatePickerDayButton().click();

        expect(counterComponentPage.getTargetDate().getAttribute('value')).to.eventually.not.equal('');

        helper.wait(counterComponentPage.getDateTimePickerButton(), 'Target time button');
        counterComponentPage.getDateTimePickerButton().click();

        helper.wait(counterComponentPage.getIncreaseHours('date'), 'Increase hours');
        counterComponentPage.getIncreaseHours('date').click();
        counterComponentPage.getIncreaseHours('date').click();
        counterComponentPage.getIncreaseHours('date').click();

        helper.wait(counterComponentPage.getDecreaseMinutes('date'), 'Decrease hours');
        counterComponentPage.getDecreaseMinutes('date').click();

        // Close time picker
        counterComponentPage.getDateTimePickerButton().click();

        expect(counterComponentPage.getTargetDateTime().getAttribute('value')).to.eventually.equal('03:59 AM');

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should select a time', function () {
        helper.wait(counterComponentPage.getSpecificTimeLabel(), 'Specific time ratio');
        counterComponentPage.getSpecificTimeLabel().click();

        helper.wait(counterComponentPage.getTimePickerButton(), 'Target time button');
        counterComponentPage.getTimePickerButton().click();

        helper.wait(counterComponentPage.getIncreaseHours('time'), 'Increase hours');
        counterComponentPage.getIncreaseHours('time').click();

        helper.wait(counterComponentPage.getDecreaseMinutes('time'), 'Decrease hours');
        counterComponentPage.getDecreaseMinutes('time').click();
        counterComponentPage.getDecreaseMinutes('time').click();
        counterComponentPage.getDecreaseMinutes('time').click();

        // Close time picker
        counterComponentPage.getTimePickerButton().click();

        expect(counterComponentPage.getTargetTime().getAttribute('value')).to.eventually.equal('01:57 AM');

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should enter the completion message', function () {
        helper.wait(counterComponentPage.getCompletionMessage(), 'Completion message');
        counterComponentPage.getCompletionMessage().sendKeys('Test message');

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should reload the Presentation, and validate changes were saved', function () {
        // Load presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent(componentLabel);
        expect(counterComponentPage.getTargetDate().getAttribute('value')).to.eventually.equal('');
        expect(counterComponentPage.getTargetTime().getAttribute('value')).to.eventually.equal('01:57 AM');
        expect(counterComponentPage.getCompletionMessage().getAttribute('value')).to.eventually.equal('Test message');
      });
    });
  });
};

module.exports = CounterComponentScenarios;
