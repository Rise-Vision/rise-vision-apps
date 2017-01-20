'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var PresentationListPage = require('./../pages/presentationListPage.js');
var helper = require('rv-common-e2e').helper;

var PresentationListScenarios = function() {

  browser.driver.manage().window().setSize(1920, 1080);
  describe("In order to manage presentations " +
    "As a user signed in " +
    "I would like to see a list of my presentations", function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var presentationsListPage;

    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      presentationsListPage = new PresentationListPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getEditor();
      //wait for spinner to go away.
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader').then(function () {
        loginPage.signIn();
      });
    });

    it('should show presentations list page', function () {
      expect(presentationsListPage.getEditorAppContainer().isDisplayed()).to.eventually.be.true;
    });

    it('should show Presentations as title', function () {
      expect(presentationsListPage.getTitle().isDisplayed()).to.eventually.be.true;
      expect(presentationsListPage.getTitle().getText()).to.eventually.equal('Presentations');
    });

    it('should show the search bar', function () {
      expect(presentationsListPage.getSearchFilter().isDisplayed()).to.eventually.be.true;
    });

    it('should show presentation list table', function () {
      expect(presentationsListPage.getPresentationListTable().isDisplayed()).to.eventually.be.true;
    });

    it('should show presentation add button', function () {
      expect(presentationsListPage.getPresentationAddButton().isDisplayed()).to.eventually.be.true;
      expect(presentationsListPage.getPresentationAddButton().getText()).to.eventually.equal('Add Presentation');
    });

    it('should show presentation list table header Name', function () {
      expect(presentationsListPage.getTableHeaderName().isDisplayed()).to.eventually.be.true;
      expect(presentationsListPage.getTableHeaderName().getText()).to.eventually.equal('Name');
    });

    it('should show presentation list table header Status', function () {
      expect(presentationsListPage.getTableHeaderStatus().isDisplayed()).to.eventually.be.true;
      expect(presentationsListPage.getTableHeaderStatus().getText()).to.eventually.equal('Status');
    });

    it('should show presentation list table header Last Modified', function () {
      expect(presentationsListPage.getTableHeaderChangeDate().isDisplayed()).to.eventually.be.true;
      expect(presentationsListPage.getTableHeaderChangeDate().getText()).to.eventually.equal('Last Modified');
    });

  });
};
module.exports = PresentationListScenarios;
