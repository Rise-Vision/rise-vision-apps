'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var DisplaysListPage = require('./../pages/displaysListPage.js');
var helper = require('rv-common-e2e').helper;

var DisplayListScenarios = function() {

  browser.driver.manage().window().setSize(1024, 768);
  describe('Display List', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var displaysListPage;
    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      commonHeaderPage = new CommonHeaderPage();
      displaysListPage = new DisplaysListPage();
    });

    describe('Given user sign in', function () {

      before(function () {
        homepage.getDisplays();
        signInPage.signIn();
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
        helper.wait(displaysListPage.getFirstRowSchedule(), 'Schedule Link');
        expect(displaysListPage.getFirstRowSchedule().isPresent()).to.eventually.be.true;
      });

      it('should show display list Install Player button', function () {
        helper.wait(displaysListPage.getFirstRowStatus(), 'Install Player Button');
        expect(displaysListPage.getFirstRowStatus().getText()).to.eventually.equal('Not Activated');
      });

      describe('bulk actions:', function() {
        it('should allow selecting displays', function() {
          expect(displaysListPage.getFirstRowCheckbox().isDisplayed()).to.eventually.be.true;
        });

        it('should show bulk actions bar when display is selected', function() {
          expect(displaysListPage.getBulkActionsDropdown().isDisplayed()).to.eventually.be.false;
          helper.clickWhenClickable(displaysListPage.getFirstRowCheckbox());
          expect(displaysListPage.getBulkActionsDropdown().isDisplayed()).to.eventually.be.true;
        });

        it('should perform bulk action', function() {
          helper.clickWhenClickable(displaysListPage.getBulkActionsDropdown());
          browser.sleep(500);

          expect(displaysListPage.getRestartPlayerBulkAction().isDisplayed()).to.eventually.be.true;

          helper.clickWhenClickable(displaysListPage.getRestartPlayerBulkAction());

          helper.wait(displaysListPage.getRestartPlayerConfirmButton(),'Restart Player Confirm Button');
          expect(displaysListPage.getRestartPlayerConfirmButton().isDisplayed()).to.eventually.be.true;
        });

        it('should show bulk actions progress bar', function() {
          helper.clickWhenClickable(displaysListPage.getRestartPlayerConfirmButton());

          helper.wait(displaysListPage.getBulkActionsProgressBar(),'Bulk Actions Progress Bar');
          expect(displaysListPage.getBulkActionsProgressBar().isDisplayed()).to.eventually.be.true;
        });

        it('should hide bulk actions progress bar when finished', function() {
          helper.waitDisappear(displaysListPage.getBulkActionsProgressBar(),'Bulk Actions Progress Bar');
          expect(displaysListPage.getBulkActionsProgressBar().isDisplayed()).to.eventually.be.false;
        });
      });
    });
  });
};

module.exports = DisplayListScenarios;
