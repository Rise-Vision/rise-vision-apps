(function (angular) {
  'use strict';
  angular.module('risevision.common.components.timeline-basic')
    .directive('timelineBasicTextbox', ['$modal', '$filter', 'TimelineBasicFactory',
      'timelineBasicDescription',
      function ($modal, $filter, TimelineBasicFactory, timelineBasicDescription) {
        return {
          restrict: 'E',
          scope: {
            timelineString: '=',
            ngDisabled: '='
          },
          templateUrl: 'partials/components/timeline-basic/timeline-textbox.html',
          link: function ($scope) {
            var updatingModal = false;
            var updatingAlwaysCheckbox = false;

            $scope.monitoringSchedule = {};

            // Watch for the formatted input string
            $scope.$watch('timelineString', function () {
              if (!updatingModal && !updatingAlwaysCheckbox) {
                $scope.monitoringSchedule = $scope.parseTimeline($scope.timelineString);
                $scope.timeline = TimelineBasicFactory.getTimeline(
                  $scope.monitoringSchedule.useLocaldate,
                  $scope.monitoringSchedule.startTime,
                  $scope.monitoringSchedule.endTime,
                  $scope.monitoringSchedule.recurrenceDaysOfWeek);

                $scope.timeline.label = timelineBasicDescription.updateLabel($scope.timeline);
              } else {
                updatingModal = false;
                updatingAlwaysCheckbox = false;
              }
            });

            $scope.$watch('timeline.always', function (newValue) {
              if (!updatingModal) {
                updatingAlwaysCheckbox = true;
                $scope.monitoringSchedule.timeDefined = !newValue;
                $scope.timelineString = $scope.formatTimeline($scope.monitoringSchedule);
              }
            });

            $scope.openModal = function () {
              if ($scope.ngDisabled) {
                return;
              }

              var modalInstance = $modal.open({
                templateUrl: 'partials/components/timeline-basic/timeline-modal.html',
                controller: 'timelineBasicModal',
                resolve: {
                  timeline: function () {
                    return angular.copy($scope.timeline);
                  }
                },
                size: 'md'
              });

              modalInstance.result.then(function (timeline) {
                updatingModal = true;

                $scope.timeline = timeline;
                $scope.timeline.always = (timeline.allDay && timeline.everyDay);
                $scope.monitoringSchedule.timeDefined = !$scope.timeline.always;
                $scope.monitoringSchedule.startTime = timeline.startTime;
                $scope.monitoringSchedule.endTime = timeline.endTime;
                $scope.monitoringSchedule.recurrenceDaysOfWeek = timeline.recurrenceDaysOfWeek;

                $scope.timeline.label = timelineBasicDescription.updateLabel($scope.timeline);

                $scope.timelineString = $scope.formatTimeline($scope.monitoringSchedule);
              }, function () {
                // do what you need to do if user cancels
              });
            };

            $scope.formatTimeline = function (timeline) {
              var resp = {};

              if (!timeline || !timeline.timeDefined) {
                return null;
              }

              if (timeline.startTime || timeline.endTime) {
                resp.time = {};
                resp.time.start = timeline.startTime ? $filter('date')(new Date(timeline.startTime), 'HH:mm') :
                  null;
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

                timeline.timeDefined = true;

                if (tl.time) {
                  timeline.startTime = tl.time.start ? $scope.reformatTime(tl.time.start) : null;
                  timeline.endTime = tl.time.end ? $scope.reformatTime(tl.time.end) : null;
                }

                if (tl.week) {
                  timeline.recurrenceDaysOfWeek = [];

                  tl.week.forEach(function (d) {
                    if (d.active) {
                      timeline.recurrenceDaysOfWeek.push(d.day);
                    }
                  });
                }
              }

              return timeline;
            };

            $scope.reformatTime = function (timeString) {
              var today = $filter('date')(new Date(), 'dd MMM yyyy');
              var fullDate = new Date(today + ' ' + timeString);
              return $filter('date')(fullDate, 'dd MMM yyyy hh:mm a');
            };
          } // link
        };
      }
    ]);
})(angular);
