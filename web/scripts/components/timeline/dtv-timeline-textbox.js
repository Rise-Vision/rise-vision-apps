(function (angular) {
  'use strict';
  angular.module('risevision.common.components.timeline')
    .directive('timelineTextbox', ['$modal', 'TimelineFactory',
      'timelineDescription',
      function ($modal, TimelineFactory, timelineDescription) {
        return {
          restrict: 'E',
          scope: {
            timelineStyle: '@',
            useLocaldate: '=',
            timeDefined: '=',
            startDate: '=',
            endDate: '=',
            startTime: '=',
            endTime: '=',
            recurrenceType: '=',
            recurrenceFrequency: '=',
            recurrenceAbsolute: '=',
            recurrenceDayOfWeek: '=',
            recurrenceDayOfMonth: '=',
            recurrenceWeekOfMonth: '=',
            recurrenceMonthOfYear: '=',
            recurrenceDaysOfWeek: '='
          },
          templateUrl: 'partials/components/timeline/timeline-textbox.html',
          link: function ($scope) {
            // Watch one of the scope variables to see when
            // new data is coming in
            $scope.$watch('startDate', function () {
              $scope.timeline = TimelineFactory.getTimeline(
                $scope.useLocaldate,
                $scope.timeDefined,
                $scope.startDate,
                $scope.endDate,
                $scope.startTime,
                $scope.endTime,
                $scope.recurrenceType,
                $scope.recurrenceFrequency,
                $scope.recurrenceAbsolute,
                $scope.recurrenceDayOfWeek,
                $scope.recurrenceDayOfMonth,
                $scope.recurrenceWeekOfMonth,
                $scope.recurrenceMonthOfYear,
                $scope.recurrenceDaysOfWeek);

              $scope.timeline.label = timelineDescription.updateLabel(
                $scope.timeline);
            });

            $scope.$watch('timeline.always', function (newValue) {
              $scope.timeDefined = !newValue;
            });

            $scope.openModal = function () {
              var modalInstance = $modal.open({
                templateUrl: 'partials/components/timeline/timeline-modal.html',
                controller: 'timelineModal',
                resolve: {
                  timeline: function () {
                    return angular.copy($scope.timeline);
                  }
                },
                size: 'md'
              });

              modalInstance.result.then(function (timeline) {
                //do what you need if user presses ok
                $scope.timeline = timeline;

                $scope.startDate = timeline.startDate;
                $scope.endDate = timeline.endDate;
                $scope.startTime = timeline.startTime;
                $scope.endTime = timeline.endTime;
                $scope.recurrenceType = timeline.recurrenceType;
                $scope.recurrenceFrequency = timeline.recurrenceFrequency;
                $scope.recurrenceAbsolute = timeline.recurrenceAbsolute;
                $scope.recurrenceDayOfWeek = timeline.recurrenceDayOfWeek;
                $scope.recurrenceDayOfMonth = timeline.recurrenceDayOfMonth;
                $scope.recurrenceWeekOfMonth = timeline.recurrenceWeekOfMonth;
                $scope.recurrenceMonthOfYear = timeline.recurrenceMonthOfYear;
                $scope.recurrenceDaysOfWeek = timeline.recurrenceDaysOfWeek;

                $scope.timeline.label = timelineDescription.updateLabel(
                  $scope.timeline);

              }, function () {
                // do what you need to do if user cancels
              });
            };
          }
        };
      }
    ]);
})(angular);
