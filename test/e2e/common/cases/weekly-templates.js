'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../pages/homepage.js');
var SignInPage = require('./../pages/signInPage.js');
var WeeklyTemplatesPage = require('./../pages/weeklyTemplates.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var PresentationListPage = require('./../../editor/pages/presentationListPage.js');
var helper = require('rv-common-e2e').helper;

var WeeklyTemplatesScenarios = function() {
  
  browser.driver.manage().window().setSize(1400, 900);
  describe('Homepage', function() {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var weeklyTemplatesPage;
    var commonHeaderPage;
    var presentationsListPage;

    before(function (){
      homepage = new HomePage();
      signInPage = new SignInPage();
      weeklyTemplatesPage = new WeeklyTemplatesPage();
      commonHeaderPage = new CommonHeaderPage();
      presentationsListPage = new PresentationListPage();

      homepage.get();
      signInPage.signIn();
    });

    // Jenkins account is not an Education company
    it('should show Weekly Templates for Non-Education customers',function(){
      helper.wait(weeklyTemplatesPage.getWeeklyTemplatesMainPanel(), 'Notice View');
      expect(weeklyTemplatesPage.getWeeklyTemplatesMainPanel().isDisplayed()).to.eventually.be.true;
      expect(weeklyTemplatesPage.getWeeklyTemplatesExpandedView().isDisplayed()).to.eventually.be.true;
      expect(weeklyTemplatesPage.getWeeklyTemplatesNoticeView().isPresent()).to.eventually.be.false;
    });

    it('should show Weekly Templates for Education Customers',function(){
      commonHeaderPage.selectUnsubscribedSubCompany();
      
      browser.sleep(500);
      helper.wait(commonHeaderPage.getCommonHeaderMenuItems().get(1), 'Presentations Common Header Menu Item');
      helper.clickWhenClickable(commonHeaderPage.getCommonHeaderMenuItems().get(1), 'Presentations Common Header Menu Item');
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');

      helper.wait(weeklyTemplatesPage.getWeeklyTemplatesMainPanel(), 'Notice View');
      expect(weeklyTemplatesPage.getWeeklyTemplatesMainPanel().isDisplayed()).to.eventually.be.true;
      expect(weeklyTemplatesPage.getWeeklyTemplatesExpandedView().isDisplayed()).to.eventually.be.true;
      expect(weeklyTemplatesPage.getWeeklyTemplatesNoticeView().isPresent()).to.eventually.be.false;
    });

    it('should close Weekly Template Panel',function(){
      expect(weeklyTemplatesPage.getWeeklyTemplatesCloseButton().isDisplayed()).to.eventually.be.true;
      
      helper.wait(weeklyTemplatesPage.getWeeklyTemplatesCloseButton());
      helper.clickWhenClickable(weeklyTemplatesPage.getWeeklyTemplatesCloseButton(), 'Weekly Templates Close Button');
      browser.sleep(500);

      expect(weeklyTemplatesPage.getWeeklyTemplatesExpandedView().isPresent()).to.eventually.be.false;
      expect(weeklyTemplatesPage.getWeeklyTemplatesNoticeView().isDisplayed()).to.eventually.be.true;
    });

    it('should persist Weekly Template Panel state on page reload',function(){
      browser.refresh();
      helper.waitDisappear(commonHeaderPage.getLoader(), 'CH spinner loader');
      helper.waitDisappear(presentationsListPage.getPresentationsLoader(), 'Presentation loader');
      helper.wait(weeklyTemplatesPage.getWeeklyTemplatesNoticeView(), 'Notice View');
      expect(weeklyTemplatesPage.getWeeklyTemplatesExpandedView().isPresent()).to.eventually.be.false;
      expect(weeklyTemplatesPage.getWeeklyTemplatesNoticeView().isDisplayed()).to.eventually.be.true;
    });

    it('should expand Weekly Template Panel',function(){
      helper.wait(weeklyTemplatesPage.getWeeklyTemplatesNoticeView(), 'Weekly Templates Notice View');
      helper.clickWhenClickable(weeklyTemplatesPage.getWeeklyTemplatesNoticeView(), 'Weekly Templates Notice View');
      browser.sleep(500);
      expect(weeklyTemplatesPage.getWeeklyTemplatesExpandedView().isDisplayed()).to.eventually.be.true;
      expect(weeklyTemplatesPage.getWeeklyTemplatesNoticeView().isPresent()).to.eventually.be.false;
    });

  });
};

module.exports = WeeklyTemplatesScenarios;
