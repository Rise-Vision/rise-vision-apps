'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var helper = require('rv-common-e2e').helper;

var ScheduleListScenarios = function() {
  browser.driver.manage().window().setSize(1920, 1080);

  describe('Schedule List', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var schedulesListPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      schedulesListPage = new SchedulesListPage();
      commonHeaderPage = new CommonHeaderPage();

      homepage.getSchedules();
      signInPage.signIn();
    });

    it('should show schedules list page', function () {
      expect(schedulesListPage.getSchedulesAppContainer().isPresent()).to.eventually.be.true;
    });

    it('should show Schedules as title', function () {
      expect(schedulesListPage.getTitle().isPresent()).to.eventually.be.true;
      expect(schedulesListPage.getTitle().getText()).to.eventually.equal('Schedules');
    });

    it('should show the search bar', function () {
      expect(schedulesListPage.getSearchFilter().isPresent()).to.eventually.be.true;
    });

    it('should show schedule list table', function () {
      expect(schedulesListPage.getSchedulesListTable().isPresent()).to.eventually.be.true;
    });

    it('should show schedule add button', function () {
      expect(schedulesListPage.getScheduleAddButton().isPresent()).to.eventually.be.true;
      expect(schedulesListPage.getScheduleAddButton().getText()).to.eventually.equal('Create New Schedule');
    });
    
    it('schedule add button should be a hyperlink', function () {
      expect(schedulesListPage.getScheduleAddButton().getAttribute('href')).to.eventually.be.ok;
      expect(schedulesListPage.getScheduleAddButton().getAttribute('href')).to.eventually.contain('cid=');
    });

    it('should show schedule list table header Name', function () {
      expect(schedulesListPage.getTableHeaderName().isPresent()).to.eventually.be.true;
      expect(schedulesListPage.getTableHeaderName().getText()).to.eventually.equal('Name');
    });

    it('should show schedule list table header Last Modified', function () {
      expect(schedulesListPage.getTableHeaderChangeDate().isPresent()).to.eventually.be.true;
      expect(schedulesListPage.getTableHeaderChangeDate().getText()).to.eventually.equal('Last Modified');
    });

  });
};
module.exports = ScheduleListScenarios;
