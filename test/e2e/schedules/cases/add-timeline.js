'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var ScheduleAddPage = require('./../pages/scheduleAddPage.js');
var helper = require('rv-common-e2e').helper;
var TimelineModalPage = require('./../pages/timelineModalPage.js');

var AddTimelineScenarios = function() {
browser.driver.manage().window().setSize(1920, 1080);

describe('Add Timeline', function() {
  this.timeout(2000);// to allow for protactor to load the seperate page
  var homepage;
  var signInPage;
  var commonHeaderPage;
  var schedulesListPage;
  var scheduleAddPage;
  var timelineModalPage;

  before(function (){
    homepage = new HomePage();
    signInPage = new SignInPage();
    schedulesListPage = new SchedulesListPage();
    scheduleAddPage = new ScheduleAddPage();
    commonHeaderPage = new CommonHeaderPage();
    timelineModalPage = new TimelineModalPage();

    homepage.getSchedules();
    signInPage.signIn();
    helper.waitDisappear(schedulesListPage.getLoader(),'Schedules loader');
  });

  describe(' Given a user is adding a new schedule ', function() {
    before(function () {
      schedulesListPage.getScheduleAddButton().click();
    });
    
    it('always checkbox should be checked', function() {
      expect(scheduleAddPage.getTimelineAlwaysCheckbox().isSelected()).to.eventually.be.true;
        
      expect(scheduleAddPage.getTimelineField().isDisplayed()).to.eventually.be.false;
    });
    
    it('should show timeline text box when checking off Always', function() {
      helper.clickOverIFrame(scheduleAddPage.getTimelineAlwaysCheckboxMask(), 'Always checkbox');
      
      expect(scheduleAddPage.getTimelineField().isDisplayed()).to.eventually.be.true;
    });
    
    it('should hide timeline text box when checking Always', function() {
      helper.clickOverIFrame(scheduleAddPage.getTimelineAlwaysCheckboxMask(), 'Always checkbox');
      
      expect(scheduleAddPage.getTimelineField().isDisplayed()).to.eventually.be.false;
    });

    describe('Given a user clicks on the Timeline field', function () {
      before(function () {
        helper.clickOverIFrame(scheduleAddPage.getTimelineAlwaysCheckboxMask(), 'Always checkbox');
        scheduleAddPage.getTimelineField().click();
        helper.wait(timelineModalPage.getEditTimelineModal(), 'Edit Timeline Modal');
      });

      it('should open the Edit Timeline Modal', function () {
        expect(timelineModalPage.getEditTimelineModal().isDisplayed()).to.eventually.be.true;
      });

      it('should show modal title', function () {
        expect(timelineModalPage.getModalTitle().getText()).to.eventually.equal('Edit Timeline');
      });

      it('should show timeline fields', function() {
        expect(timelineModalPage.getStartDateTextbox().isDisplayed())
          .to.eventually.be.true;
        expect(timelineModalPage.getStartDateTextbox().getAttribute('value'))
          .to.eventually.be.ok;
            
        expect(timelineModalPage.getEndDateTextbox().isDisplayed())
          .to.eventually.be.true;
        expect(timelineModalPage.getEndDateTextbox().getAttribute('value'))
          .to.eventually.not.be.ok;

        expect(timelineModalPage.getAlldayCheckbox().isPresent())
          .to.eventually.be.true;
        expect(timelineModalPage.getAlldayCheckbox().isSelected())
          .to.eventually.be.true;

        expect(timelineModalPage.getDailyRecurrenceRadio().isDisplayed())
          .to.eventually.be.true;
        expect(timelineModalPage.getDailyRecurrenceRadio().isSelected())
          .to.eventually.be.true;                    
      });

      describe('Given the user selects a recurrence',function () {
        it('should show recurrence options', function () {
          expect(timelineModalPage.getDailyRecurrenceFrequency().isDisplayed())
            .to.eventually.be.true;
          expect(timelineModalPage.getDailyRecurrenceFrequency().getAttribute('value'))
            .to.eventually.equal('1');            

          expect(timelineModalPage.getWeeklyRecurrenceFrequency().isPresent())
            .to.eventually.be.false;
        });
        
        it('should show weekly recurrence fields', function () {
          timelineModalPage.getWeeklyRecurrenceRadio().click();

          expect(timelineModalPage.getDailyRecurrenceFrequency().isPresent())
            .to.eventually.be.false;
          
          expect(timelineModalPage.getWeeklyRecurrenceFrequency().isDisplayed())
            .to.eventually.be.true;
          expect(timelineModalPage.getWeeklyRecurrenceFrequency().getAttribute('value'))
            .to.eventually.equal('1');
        });
        
        it('save should update timeline correctly', function(done) {
          timelineModalPage.getWeeklyRecurrenceRadio().click();
          timelineModalPage.getWeeklyRecurrenceFrequency().sendKeys('0');
          timelineModalPage.getApplyButton().click();
          
          helper.clickWhenClickable(scheduleAddPage.getTimelineField(), 'Re-open timeline').then(function() {
            helper.wait(timelineModalPage.getEditTimelineModal(), 'Edit Timeline Modal');

            expect(timelineModalPage.getWeeklyRecurrenceRadio().isSelected())
              .to.eventually.be.true;
            expect(timelineModalPage.getWeeklyRecurrenceFrequency().isPresent())
              .to.eventually.be.true;

            expect(timelineModalPage.getWeeklyRecurrenceFrequency().getAttribute('value'))
              .to.eventually.equal('10');
              
            done();        
          });

        });
      });
      
      

    });
  });
});
};
module.exports = AddTimelineScenarios;
