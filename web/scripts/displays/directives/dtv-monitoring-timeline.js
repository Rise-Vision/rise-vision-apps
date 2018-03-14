'use strict';

angular.module('risevision.displays.directives')
  .directive('monitoringTimeline', ['$filter',
    function ($filter) {
      return {
        restrict: 'E',
        template: '<timeline-basic-textbox ' +
        '            start-time = "monitoringSchedule.startTime" ' +
        '            end-time = "monitoringSchedule.endTime" ' +
        '            recurrence-days-of-week = "monitoringSchedule.recurrenceDaysOfWeek" ' +
        '            ng-disabled="ngDisabled"> ' +
        '          </timeline-basic-textbox>',
        scope: {
          timelineString: '=',
          ngDisabled: '='
        },
        link: function ($scope) {
          $scope.$watch('timelineString', function () {
            $scope.monitoringSchedule = $scope.parseTimeline($scope.timelineString);
          });

          $scope.$watch('monitoringSchedule.recurrenceDaysOfWeek', function () {
            $scope.timelineString = $scope.formatTimeline($scope.monitoringSchedule);
          });

          $scope.formatTimeline = function (timeline) {
            var resp = {};
    
            if (!timeline) {
              return null;
            }
    
            if (timeline.startTime || timeline.endTime) {
              resp.time = {};
              resp.time.start = timeline.startTime ? $filter('date')(new Date(timeline.startTime), 'HH:mm') : null;
              resp.time.end = timeline.endTime ? $filter('date')(new Date(timeline.endTime), 'HH:mm') : null;
            }
    
            if (timeline.recurrenceDaysOfWeek && timeline.recurrenceDaysOfWeek.length > 0) {
              resp.week = timeline.recurrenceDaysOfWeek.map(function (day) {
                return {
                  day: day,
                  active: true
                };
              });
            }
    
            resp = JSON.stringify(resp);
    
            return resp !== '{}' ? resp : null;
          };
    
          $scope.parseTimeline = function (tl) {
            var timeline = {};
    
            if (tl && tl !== '{}') {
              tl = JSON.parse(tl);

              if (tl.time) {
                timeline.startTime = tl.time.start ? $scope.reformatTime(tl.time.start) : null;
                timeline.endTime = tl.time.end ? $scope.reformatTime(tl.time.end) : null;
              }
    
              if (tl.week) {
                timeline.recurrenceDaysOfWeek = [];
    
                tl.week.forEach(function(d) {
                  if (d.active) {
                    timeline.recurrenceDaysOfWeek.push(d.day);
                  }
                });
              }
            }
    
            return timeline;
          };
    
          $scope.reformatTime = function (timeString) {
            var today = $filter('date')(new Date(), 'dd-MMM-yyyy');
            var fullDate = new Date(today + ' ' + timeString);
            return $filter('date')(fullDate, 'dd-MMM-yyyy hh:mm a');
          };
        } //link()
      };
    }
  ]);
