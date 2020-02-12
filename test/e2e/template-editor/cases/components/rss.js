'use strict';

var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var RssComponentPage = require('./../../pages/components/rssComponentPage.js');

var RssComponentScenarios = function () {
  describe('RSS Component', function () {
    var presentationName;
    var presentationsListPage;
    var templateEditorPage;
    var rssComponentPage;
    var componentLabel = 'Top left';

    before(function () {
      presentationsListPage = new PresentationListPage();
      templateEditorPage = new TemplateEditorPage();
      rssComponentPage = new RssComponentPage();

      presentationsListPage.loadCurrentCompanyPresentationList();

      presentationsListPage.createNewPresentationFromTemplate('Example RSS Component', 'example-rss-component');

      templateEditorPage.getPresentationName().getAttribute('value').then(function(name) {
        expect(name).to.contain('Copy of');

        presentationName = name;
      });
    });

    describe('basic operations', function () {

      it('should open properties of RSS Component', function () {
        templateEditorPage.selectComponent(componentLabel);
        expect(rssComponentPage.getRssFeedInput().isEnabled()).to.eventually.be.true;
        expect(rssComponentPage.getRssFeedInput().getAttribute('value')).to.eventually.equal('https://www.feedforall.com/sample.xml');
        expect(rssComponentPage.getRssMaxItemsSelect().isEnabled()).to.eventually.be.true;
        expect(rssComponentPage.getRssMaxItemsSelect().getAttribute('value')).to.eventually.equal('1');
      });

      function _testInvalidScenario (feedUrl, expectedMessageKey) {
        // Change Feed URL
        expect(rssComponentPage.getRssFeedInput().isEnabled()).to.eventually.be.true;
        rssComponentPage.getRssFeedInput().clear();
        rssComponentPage.getRssFeedInput().sendKeys(feedUrl + protractor.Key.ENTER);

        // Wait for validation to complete
        helper.waitDisappear(rssComponentPage.getLoader(), 'Validation spinner');

        // Verify validation error, message and icon are visible
        expect(rssComponentPage.getValidationError().isDisplayed()).to.eventually.be.true;
        expect(rssComponentPage.getValidationIconError().isDisplayed()).to.eventually.be.true;
        expect(rssComponentPage.getValidationMessage(expectedMessageKey).isDisplayed()).to.eventually.be.true;

        // Verify validation success icon is not visible
        expect(rssComponentPage.getValidationIconValid().isPresent()).to.eventually.be.false;
      }

      it('should show validation error for invalid URL', function () {
        _testInvalidScenario('invalidFeedUrl', 'INVALID_URL');
      });

      it('should show validation error for invalid URL', function () {
        _testInvalidScenario('https://www.google.com', 'NON_FEED');
      });

      it('should show validation error for Not Found URL', function () {
        _testInvalidScenario('https://news.ycombinator.com/news-invalid-url', 'NOT_FOUND');
      });

      it('should not show a validation error if feed is empty', function () {

        // Change Feed URL
        expect(rssComponentPage.getRssFeedInput().isEnabled()).to.eventually.be.true;
        rssComponentPage.getRssFeedInput().clear();
        rssComponentPage.getRssFeedInput().sendKeys('' + protractor.Key.ENTER);

        // Wait for validation to complete
        helper.waitDisappear(rssComponentPage.getLoader(), 'Validation spinner');

        // Verify validation error and icon is not visible
        expect(rssComponentPage.getValidationError().isPresent()).to.eventually.be.false;
        expect(rssComponentPage.getValidationIconError().isPresent()).to.eventually.be.false;

        // Certify validation success icon is not visible
        expect(rssComponentPage.getValidationIconValid().isDisplayed()).to.eventually.be.true;
      });

      it('should not show validation error for valid feed', function () {
        // Change Feed URL
        expect(rssComponentPage.getRssFeedInput().isEnabled()).to.eventually.be.true;
        rssComponentPage.getRssFeedInput().clear();
        rssComponentPage.getRssFeedInput().sendKeys('https://hnrss.org/frontpage' + protractor.Key.ENTER);

        // Wait for validation to complete
        helper.waitDisappear(rssComponentPage.getLoader(), 'Validation spinner');

        //wait for presentation to be auto-saved
        helper.wait(templateEditorPage.getSavedText(), 'RSS component auto-saved');
      });

      it('should update the max items field', function() {
        rssComponentPage.getRssMaxItemsSelect().element(by.cssContainingText('option', '10')).click();

        //wait for presentation to be auto-saved
        templateEditorPage.waitForAutosave();
      });

      it('should reload the Presentation, and validate changes were saved', function () {
        // Load presentation
        presentationsListPage.loadPresentation(presentationName);
        templateEditorPage.selectComponent(componentLabel);
        expect(rssComponentPage.getRssFeedInput().isEnabled()).to.eventually.be.true;
        expect(rssComponentPage.getRssFeedInput().getAttribute('value')).to.eventually.equal('https://hnrss.org/frontpage');
        expect(rssComponentPage.getRssMaxItemsSelect().isEnabled()).to.eventually.be.true;
        expect(rssComponentPage.getRssMaxItemsSelect().getAttribute('value')).to.eventually.equal('10');
      });
    });
  });
};

module.exports = RssComponentScenarios;
