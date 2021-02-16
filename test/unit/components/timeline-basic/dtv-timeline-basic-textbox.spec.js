"use strict";
describe("directive: timeline-basic-textbox", function() {
  beforeEach(module("risevision.common.components.timeline-basic"));

  var elm, $scope, $mainScope, $compile;

  function compileDirective() {
    var tpl = "<timeline-basic-textbox timeline-string='timelineString'></timeline-basic-textbox>";

    elm = $compile(tpl)($mainScope);
    $mainScope.$digest();
    $scope = elm.isolateScope();
  }

  beforeEach(inject(function($rootScope, $injector, _$compile_, $templateCache) {
    $templateCache.put("partials/components/timeline-basic/timeline-textbox.html", "<p>Timeline</p>");

    $mainScope = $rootScope.$new();
    $compile = _$compile_;

    compileDirective();
  }));

  it("should compile html", function() {
    expect(elm.html()).to.contain("<p>Timeline</p>");

    expect($scope.formatTimeline).to.be.a("function");
    expect($scope.parseTimeline).to.be.a("function");
    expect($scope.reformatTime).to.be.a("function");
  });

  it("should update internal fields with provided information", function() {
    $mainScope.timelineString = JSON.stringify({
      time: {
        start: "07:25",
        end: "17:40"
      },
      week: [{ day: "Fri", active: true }]
    });
    $mainScope.$digest();

    expect($scope.monitoringSchedule.startTime).to.contain("07:25 AM");
    expect($scope.monitoringSchedule.endTime).to.contain("05:40 PM");
    expect($scope.monitoringSchedule.recurrenceDaysOfWeek).to.deep.equal(["Fri"]);
  });

  it("should update model with internal fields", function() {
    $scope.monitoringSchedule.timeDefined = true;
    $scope.monitoringSchedule.startTime = "23-Mar-2018 06:00 AM";
    $scope.monitoringSchedule.endTime = "23-Mar-2018 11:30 PM";
    $scope.monitoringSchedule.recurrenceDaysOfWeek = ["Sat"];
    $scope.timeline.always = false;

    $scope.$digest();

    expect($scope.timelineString).to.deep.equal(JSON.stringify({
      time: {
        start: "06:00",
        end: "23:30"
      },
      week: [{ day: "Sat", active: true }]
    }));
  });

  describe("Monitoring schedule:", function () {
    var formatRegex = /\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} \w{2}/;

    describe("formatTimeline:", function() {
      it("should return null when empty timelines are provided", function () {
        expect($scope.formatTimeline()).to.be.null;
        expect($scope.formatTimeline({})).to.be.null;
        expect($scope.formatTimeline({ timeDefined: false })).to.be.null;
      });

      it("should return a string with the expected format for startTime and endTime", function () {
        var resp = JSON.parse($scope.formatTimeline({
          timeDefined: true,
          startTime: "10-Feb-2018 08:30 AM",
          endTime: "10-Feb-2018 04:30 PM"
        }));

        expect(resp).to.deep.equal({
          time: {
            start: "08:30",
            end: "16:30"
          }
        });
      });

      it("should return a string with the expected format for startTime and endTime and week days", function () {
        var resp = JSON.parse($scope.formatTimeline({
          timeDefined: true,
          startTime: "10-Feb-2018 08:30 AM",
          endTime: "10-Feb-2018 04:30 PM",
          recurrenceDaysOfWeek: ["Mon", "Fri", "Sat"]
        }));

        expect(resp).to.deep.equal({
          time: {
            start: "08:30",
            end: "16:30"
          },
          week: [
            { day: "Mon", active: true },
            { day: "Fri", active: true },
            { day: "Sat", active: true }
          ]
        });
      });
    });

    describe("parseTimeline:", function() {
      it("should properly parse an empty string", function () {
        expect($scope.parseTimeline()).to.deep.equal({});
        expect($scope.parseTimeline("")).to.deep.equal({});
        expect($scope.parseTimeline("{}")).to.deep.equal({});
      });

      it("should parse a timeline with startTime and endTime", function () {
        var tl = JSON.stringify({
          time: {
            start: "08:15",
            end: "16:30"
          }
        });
        var parsed = $scope.parseTimeline(tl);

        expect(formatRegex.test(parsed.startTime)).to.be.truely;
        expect(formatRegex.test(parsed.endTime)).to.be.truely;
        expect(parsed.startTime).to.contain("08:15 AM");
        expect(parsed.endTime).to.contain("04:30 PM");
      });

      it("should parse a timeline with startTime and endTime and days of the week", function () {
        var tl = JSON.stringify({
          time: {
            start: "08:15",
            end: "16:30"
          },
          week: [
            { day: "Mon", active: false },
            { day: "Wed", active: true },
            { day: "Thu", active: true },
            { day: "Fri", active: false },
            { day: "Sat", active: true }
          ]
        });
        var parsed = $scope.parseTimeline(tl);

        expect(formatRegex.test(parsed.startTime)).to.be.truely;
        expect(formatRegex.test(parsed.endTime)).to.be.truely;
        expect(parsed.recurrenceDaysOfWeek).to.deep.equal(["Wed", "Thu", "Sat"]);
      });
    });

    describe("reformatTime:", function() {
      it("should properly format the time into the expected date format", function () {
        var time = "15:00";
        var formatted = $scope.reformatTime(time);

        expect(formatRegex.test(formatted)).to.be.truely;
        expect(formatted).to.contain("03:00 PM");
      });
    });
  });
});
