'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../launcher/pages/homepage.js');
var LoginPage = require('./../../launcher/pages/loginPage.js');
var CommonHeaderPage = require('rv-common-e2e').commonHeaderPage;
var DisplaysListPage = require('./../pages/displaysListPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayListScenarios = function() {

  browser.driver.manage().window().setSize(1024, 768);
  describe("In order to manage displays " +
    "As a user signed in " +
    "I would like to see a list of my displays", function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var loginPage;
    var commonHeaderPage;
    var displaysListPage;
    before(function () {
      homepage = new HomePage();
      loginPage = new LoginPage();
      commonHeaderPage = new CommonHeaderPage();
      displaysListPage = new DisplaysListPage();
    });

    describe('Given user sign in', function () {

      before(function () {
        homepage.getDisplays();
        loginPage.signIn();
      });

      it('should show displays list page', function () {
        expect(displaysListPage.getDisplaysAppContainer().isPresent()).to.eventually.be.true;
      });

      it('should show Displays as title', function () {
        expect(displaysListPage.getTitle().isPresent()).to.eventually.be.true;
        expect(displaysListPage.getTitle().getText()).to.eventually.equal('Displays');
      });

      it('should show the search bar', function () {
        expect(displaysListPage.getSearchFilter().isPresent()).to.eventually.be.true;
      });

      it('should show display list table', function () {
        expect(displaysListPage.getDisplaysListTable().isPresent()).to.eventually.be.true;
      });

      it('should show display add button', function () {
        expect(displaysListPage.getDisplayAddButton().isPresent()).to.eventually.be.true;
        expect(displaysListPage.getDisplayAddButton().getText()).to.eventually.equal('Add Display');
      });

      it('should show display list table header Name', function () {
        expect(displaysListPage.getTableHeaderName().isPresent()).to.eventually.be.true;
        expect(displaysListPage.getTableHeaderName().getText()).to.eventually.equal('Name');
      });

      it('should show display list table header Last Connection', function () {
        expect(displaysListPage.getTableHeaderLastConnection().isPresent()).to.eventually.be.true;
        expect(displaysListPage.getTableHeaderLastConnection().getText()).to.eventually.equal('Last Connection');
      });

      it('should show display list table header Status', function () {
        expect(displaysListPage.getTableHeaderStatus().isPresent()).to.eventually.be.true;
        expect(displaysListPage.getTableHeaderStatus().getText()).to.eventually.equal('Status');
      });

      it('should show display list Schedule View button (All Displays - 24/7)', function () {
        expect(displaysListPage.getFirstRowSchedule().isPresent()).to.eventually.be.true;
      });

      it('should show display list Install Player button', function () {
        helper.wait(displaysListPage.getFirstRowStatus(), 'Install Player Button');
        expect(displaysListPage.getFirstRowStatus().getAttribute('ng-click')).to.eventually.equal('displayFactory.addDisplayModal(display)');
      });
    });
  });
};

module.exports = DisplayListScenarios;
