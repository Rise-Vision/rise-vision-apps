"use strict";
describe("service: timelineDescription ", function() {
  beforeEach(module("risevision.common.components.timeline.services"));
  var timelineDescription, timeline;

  beforeEach(function(){
    timeline = {};

    inject(function($injector){
      timelineDescription = $injector.get("timelineDescription");
    });
  });
  
  it("should exist",function(){
    expect(timelineDescription).to.be.truely;

    expect(timelineDescription.updateLabel).to.be.a("function");

  });

  it("should have a label with startDate",function(){
    var timeline = {
      startDate: "10/08/2015",
      allDay :  true
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("08-Oct-2015 ");
  });

  it("should have a label with startDate, endDate",function(){
    var timeline = {
      startDate: "10/08/2015",
      endDate: "11/20/2015",
      allDay :  true
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("08-Oct-2015 to 20-Nov-2015 ");
  });

  it("should have a label with startDate, endDate, startTime and endTime",function(){
    var timeline = {
      startDate: "10/08/2015",
      endDate: "11/20/2015",
      startTime: "8/6/2015 10:55:00 AM",
      endTime: "8/6/2015 06:24:00 PM",
      allDay :  false
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("08-Oct-2015 to 20-Nov-2015 10:55 AM to 06:24 PM ");
  });

  it("should have a label with Every Day, startTime and endTime",function(){
    var timeline = {
      startTime: "8/6/2015 10:55:00 AM",
      endTime: "8/6/2015 06:24:00 PM",
      allDay :  false
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("10:55 AM to 06:24 PM ");
  });

  it("should have a label with Daily recurrence",function(){
    var timeline = {
      allDay :  true,
      recurrenceType : "Daily",
      recurrenceFrequency : 1
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("Daily Every 1 Day(s) ");
  });

  it("should have a label with Weekly recurrence without days of the week",function(){
    var timeline = {
      allDay :  true,
      recurrenceType : "Weekly",
      recurrenceFrequency : 5
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("Weekly Every 5 Week(s) ");
  });

  it("should have a label with Weekly recurrence with days of the week",function(){
    var timeline = {
      allDay :  true,
      recurrenceType : "Weekly",
      recurrenceFrequency : 5,
      recurrenceDaysOfWeek : ["Tue", "Sun"]
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("Weekly Every 5 Week(s) Tuesday Sunday ");
  });

  it("should have a label with Monthly recurrence absolute",function(){
    var timeline = {
      allDay :  true,
      recurrenceType : "Monthly",
      recurrenceAbsolute : true,
      recurrenceDayOfMonth : 4,
      recurrenceFrequency : 8
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("Monthly Day 4 Of Every 8 Month(s) ");
  });

  it("should have a label with Monthly recurrence relative",function(){
    var timeline = {
      allDay :  true,
      recurrenceType : "Monthly",
      recurrenceAbsolute : false,
      recurrenceWeekOfMonth : 2,
      recurrenceDayOfWeek : 5,
      recurrenceFrequency : 3

    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("Monthly Third Friday Of Every 3 Month(s) ");
  });

  it("should have a label with Yearly recurrence absolute",function(){
    var timeline = {
      allDay :  true,
      recurrenceType : "Yearly",
      recurrenceAbsolute : true,
      recurrenceMonthOfYear : 6,
      recurrenceDayOfMonth : 16
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("Yearly Every July 16 ");
  });

  it("should have a label with Yearly recurrence relative",function(){
    var timeline = {
      allDay :  true,
      recurrenceType : "Yearly",
      recurrenceAbsolute : false,
      recurrenceWeekOfMonth : 1,
      recurrenceDayOfWeek : 5,
      recurrenceMonthOfYear : 6,
      recurrenceFrequency : 2
    };

    var label = timelineDescription.updateLabel(timeline);

    expect(label).to.equal("Yearly Every Second Friday Of July ");
  });

});
