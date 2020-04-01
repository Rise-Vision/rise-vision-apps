'use strict';

var expect = require('rv-common-e2e').expect;
var helper = require('rv-common-e2e').helper;
var CommonHeaderPage = require('./../../../common-header/pages/commonHeaderPage.js');
var HomePage = require('./../../../common-header/pages/homepage.js');
var PresentationListPage = require('./../../pages/presentationListPage.js');
var TemplateEditorPage = require('./../../pages/templateEditorPage.js');
var TwitterComponentPage = require('./../../pages/components/twitterComponentPage.js');

var TwitterComponentScenarios = function (subCompanyName) {
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

    describe('not connected UI', function () {
      it('should open properties of Twitter Component', function () {
        templateEditorPage.selectComponent(componentLabel);
        expect(twitterComponentPage.getUsername().isEnabled()).to.eventually.be.true;
        expect(twitterComponentPage.getMaxitems().isEnabled()).to.eventually.be.true;

        expect(twitterComponentPage.getConnectButton().isEnabled()).to.eventually.be.true;
        expect(twitterComponentPage.getConnectButton().isDisplayed()).to.eventually.be.true;
      });
    });

    describe('connected UI', function () {
      var connectedPresentationName = 'Test Example Twitter Component';
      var commonHeaderPage;
      var homePage;
      var expectedUsername;
      var expectedMaxitems;

      before(function () {
        commonHeaderPage = new CommonHeaderPage();
        homePage = new HomePage();

        presentationsListPage.loadCurrentCompanyPresentationList();

        commonHeaderPage.getProfilePic().click();

        expect(homePage.getResetSubcompanyButton().isDisplayed()).to.eventually.be.true;
        homePage.getResetSubcompanyButton().click();

        helper.waitDisappear(homePage.getSubcompanyAlert(), "Subcompany Alert");

        commonHeaderPage.selectSubscribedSubCompany();
      });

      after(function () {
        presentationsListPage.loadCurrentCompanyPresentationList();

        commonHeaderPage.getProfilePic().click();

        expect(homePage.getResetSubcompanyButton().isDisplayed()).to.eventually.be.true;
        homePage.getResetSubcompanyButton().click();

        helper.waitDisappear(homePage.getSubcompanyAlert(), "Subcompany Alert");

        commonHeaderPage.selectSubCompany(subCompanyName);
      });

      it('selects presentation on subscribed company', function () {
        presentationsListPage.loadPresentation(connectedPresentationName);

        templateEditorPage.selectComponent(componentLabel);
        expect(twitterComponentPage.getUsername().isEnabled()).to.eventually.be.true;
        expect(twitterComponentPage.getMaxitems().isEnabled()).to.eventually.be.true;
        expect(twitterComponentPage.getConnectButton().isEnabled()).to.eventually.be.true;

        expect(twitterComponentPage.getConnectButton().isDisplayed()).to.eventually.be.false;
        expect(twitterComponentPage.getUsername().isDisplayed()).to.eventually.be.true;
        expect(twitterComponentPage.getMaxitems().isDisplayed()).to.eventually.be.true;
      });

      it('changes username and maxitems', function () {
        var username = twitterComponentPage.getUsername().getAttribute('value');
        var maxitems = twitterComponentPage.getMaxitems().getAttribute('value');

        expectedUsername = username === '@mashable' ? '@risevision' : '@mashable';
        expectedMaxitems = maxitems === '5' ? '14' : '5';

        twitterComponentPage.getUsername().sendKeys(expectedUsername + protractor.Key.ENTER);
        twitterComponentPage.getMaxitems().sendKeys(expectedMaxitems + protractor.Key.ENTER);

        templateEditorPage.waitForAutosave();
      });

      it('should reload the Presentation, and validate changes were saved', function () {
        presentationsListPage.loadPresentation(connectedPresentationName);
        templateEditorPage.selectComponent(componentLabel);

        expect(twitterComponentPage.getUsername().isDisplayed()).to.eventually.be.true;
        expect(twitterComponentPage.getUsername().getAttribute('value')).to.eventually.equal(expectedUsername);

        expect(twitterComponentPage.getMaxitems().isDisplayed()).to.eventually.be.true;
        expect(twitterComponentPage.getMaxitems().getAttribute('value')).to.eventually.equal(expectedMaxitems);
      });
    });
  });
};

module.exports = TwitterComponentScenarios;
