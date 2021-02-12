"use strict";

describe("service: timelineBasicDescription ", function() {
  beforeEach(module("risevision.common.components.timeline-basic.services"));
  var timelineBasicDescription, timeline;

  beforeEach(function(){
    timeline = {};

    inject(function($injector){
      timelineBasicDescription = $injector.get("timelineBasicDescription");
    });
  });
  
  it("should exist",function(){
    expect(timelineBasicDescription).to.be.truely;

    expect(timelineBasicDescription.updateLabel).to.be.a("function");

  });

  it("should have a label with All day every day",function(){
    var timeline = {
      allDay: true
    };

    var label = timelineBasicDescription.updateLabel(timeline);

    expect(label).to.equal("All day every day");
  });

  it("should have a label with startTime and endTime",function(){
    var timeline = {
      allDay: false,
      startTime: "8/6/2015 10:55:00 AM",
      endTime: "8/6/2015 06:24:00 PM"
    };

    var label = timelineBasicDescription.updateLabel(timeline);

    expect(label).to.equal("10:55 AM UTC to 06:24 PM UTC every day");
  });

  it("should have a label with All day on Tuesday and Sunday",function(){
    var timeline = {
      allDay: true,
      recurrenceDaysOfWeek : ["Tue", "Sun"]
    };

    var label = timelineBasicDescription.updateLabel(timeline);

    expect(label).to.equal("All day every Tuesday Sunday");
  });

  it("should have a label with startTime and endTime on Tuesday and Sunday",function(){
    var timeline = {
      allDay: false,
      startTime: "8/6/2015 10:55:00 AM",
      endTime: "8/6/2015 06:24:00 PM",
      recurrenceDaysOfWeek : ["Tue", "Sun"]
    };

    var label = timelineBasicDescription.updateLabel(timeline);

    expect(label).to.equal("10:55 AM UTC to 06:24 PM UTC every Tuesday Sunday");
  });

});
