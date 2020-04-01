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
      var commonHeaderPage;
      var homePage;

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
        presentationsListPage.loadPresentation('Test Example Twitter Component');

        templateEditorPage.selectComponent(componentLabel);
        expect(twitterComponentPage.getUsername().isEnabled()).to.eventually.be.true;
        expect(twitterComponentPage.getMaxitems().isEnabled()).to.eventually.be.true;
        expect(twitterComponentPage.getConnectButton().isEnabled()).to.eventually.be.true;

        expect(twitterComponentPage.getConnectButton().isDisplayed()).to.eventually.be.false;
        expect(twitterComponentPage.getUsername().isDisplayed()).to.eventually.be.true;
        expect(twitterComponentPage.getMaxitems().isDisplayed()).to.eventually.be.true;
      });
    });
  });
};

module.exports = TwitterComponentScenarios;
