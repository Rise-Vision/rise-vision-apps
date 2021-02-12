"use strict";
describe("service: TimelineBasicFactory ", function() {
  beforeEach(module("risevision.common.components.timeline-basic.services"));
  var TimelineBasicFactory;

  beforeEach(function() {
    inject(function($injector) {
      TimelineBasicFactory = $injector.get("TimelineBasicFactory");
    });
  });

  it("should exist",function() {
    expect(TimelineBasicFactory).to.be.truely;

    expect(TimelineBasicFactory.getTimeline).to.be.a("function");
  });

  describe("getTimeline:", function() {
    it("should initialize timeline correctly",function() {
      var timeline = TimelineBasicFactory.getTimeline();

      expect(timeline.allDay).to.be.true;
      expect(timeline.everyDay).to.be.true;

      expect(timeline.startTime).to.not.be.ok;
      expect(timeline.endTime).to.not.be.ok;
    });

  });

  describe("Factory: ", function() {
    var timeline;

    beforeEach(function() {
      timeline = TimelineBasicFactory.getTimeline();
    });

    it("should exist",function() {
      var factory = new TimelineBasicFactory({});

      expect(factory).to.be.truely;

      expect(factory.save).to.be.a("function");
      expect(factory.recurrence).to.be.a("object");
      expect(factory.timeline).to.be.a("object");
    });

    it("should initialize startTime/endTime", function() {
      var factory = new TimelineBasicFactory(timeline);

      expect(factory.timeline.startTime).to.be.ok;
      expect(factory.timeline.endTime).to.be.ok;
    });

    it("should save timeline correctly with one selected day",function() {
      var factory = new TimelineBasicFactory(timeline);

      timeline.everyDay = false;
      factory.recurrence.weekly.tuesday = true;

      factory.save();

      expect(factory.timeline.startTime).to.not.be.ok;
      expect(factory.timeline.endTime).to.not.be.ok;
      expect(factory.timeline.everyDay).to.be.false;

      expect(factory.timeline.recurrenceDaysOfWeek).to.deep.equal(["Tue"]);
    });

    it("should save timeline correctly with all days selected", function() {
      var factory = new TimelineBasicFactory(timeline);

      factory.recurrence.weekly.monday = true;
      factory.recurrence.weekly.tuesday = true;
      factory.recurrence.weekly.wednesday = true;
      factory.recurrence.weekly.thursday = true;
      factory.recurrence.weekly.friday = true;
      factory.recurrence.weekly.saturday = true;
      factory.recurrence.weekly.sunday = true;

      factory.save();

      expect(factory.timeline.startTime).to.not.be.ok;
      expect(factory.timeline.endTime).to.not.be.ok;
      expect(factory.timeline.everyDay).to.be.true;
    });
  });
});
