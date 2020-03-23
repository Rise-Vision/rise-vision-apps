'use strict';

var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var TwitterComponentPage = require('./../../pages/components/twitterComponentPage.js');

var TwitterComponentScenarios = function () {
  describe('Twitter Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var twitterComponentPage;
    var componentLabel = 'Sidebar Tweets';

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      twitterComponentPage = new TwitterComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Example Twitter Component', 'example-twitter-component');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name;
      });
    });

    describe('basic operations', function () {
      it('should open properties of Twitter Component', function () {
        templateEditorPage.selectComponent(componentLabel);
        expect(twitterComponentPage.getUsername().isEnabled()).to.eventually.be.true;
        expect(twitterComponentPage.getMaxitems().isEnabled()).to.eventually.be.true;
      });

      it('should change username and maxitems', function () {
        helper.wait(twitterComponentPage.getUsername(), 'Username');
        browser.sleep(500);
        twitterComponentPage.getUsername().clear();
        browser.sleep(500);
        twitterComponentPage.getUsername().sendKeys("risevision" + protractor.Key.ENTER);

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should reload the Presentation, and validate changes were saved', function () {
        // Load presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent(componentLabel);

        helper.wait(twitterComponentPage.getUsername(), 'Username');

        expect(twitterComponentPage.getUsername().getAttribute('value')).to.eventually.equal('risevision');
      });
    });
  });
};

module.exports = TwitterComponentScenarios;
