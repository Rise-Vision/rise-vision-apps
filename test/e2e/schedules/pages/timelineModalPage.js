'use strict';
var TimelineModalPage = function() {
  var editTimelineModal = element(by.id('timelineModal'));
  var modalTitle = element(by.css('.modal-title'));

  var startDateTextbox = element(by.model("timeline.startDate"));
  var endDateTextbox = element(by.model("timeline.endDate"));
  var alldayCheckbox = element(by.model("timeline.allDay"));

  var dailyRecurrenceRadio = element(by.id("Daily"));
  var dailyRecurrenceFrequency = element(by.model("recurrence.daily.recurrenceFrequency"));
  
  var weeklyRecurrenceRadio = element(by.id("Weekly"));
  var weeklyRecurrenceFrequency = element(by.model("recurrence.weekly.recurrenceFrequency"));

  var applyButton = element.all(by.css(".modal-footer .btn")).first();
  var cancelButton = element.all(by.css(".modal-footer .btn")).last();

  this.getEditTimelineModal = function() {
    return editTimelineModal;
  };

  this.getModalTitle = function() {
    return modalTitle;
  };
  
  this.getStartDateTextbox = function() {
    return startDateTextbox;
  };
  
  this.getEndDateTextbox = function() {
    return endDateTextbox;
  };
  
  this.getAlldayCheckbox = function() {
    return alldayCheckbox;
  };
  
  this.getDailyRecurrenceRadio = function() {
    return dailyRecurrenceRadio;
  }

  this.getDailyRecurrenceFrequency = function() {
    return dailyRecurrenceFrequency;
  }
  
  this.getWeeklyRecurrenceRadio = function() {
    return weeklyRecurrenceRadio;
  }

  this.getWeeklyRecurrenceFrequency = function() {
    return weeklyRecurrenceFrequency;
  }

  this.getApplyButton = function() {
    return applyButton;
  };

  this.getCancelButton = function() {
    return cancelButton;
  };

};

module.exports = TimelineModalPage;
