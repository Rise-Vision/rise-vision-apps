(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline")
    .controller("timelineModal", ["$scope", "$modalInstance", "timeline",
      "TimelineFactory",
      function ($scope, $modalInstance, timeline, TimelineFactory) {
        var factory = new TimelineFactory(timeline);
        $scope.recurrence = factory.recurrence;
        $scope.timeline = factory.timeline;

        $scope.dateOptions = {
          formatYear: "yy",
          startingDay: 1,
          showWeeks: false,
          showButtonBar: false
        };

        $scope.today = new Date();

        var parseDate = function (dateString) {
          var useLocaldate = factory.timeline.useLocaldate;

          if (!dateString) {
            return undefined;
          }

          var dt = new Date(dateString);

          if (useLocaldate) {
            // 'undo' the timezone offset again (so we end up on the original date again)
            dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
          }

          return dt;
        };

        // Set init-date attribute to fix issue with Date initialization
        // https://github.com/angular-ui/bootstrap/issues/5081
        $scope.datepickers = {
          startDate: {
            initDate: parseDate(factory.timeline.startDate)
          },
          endDate: {
            initDate: parseDate(factory.timeline.endDate)
          }
        };

        $scope.openDatepicker = function ($event, which) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.datepickers[which].isOpen = true;
        };

        $scope.save = function () {
          factory.save();
          $modalInstance.close($scope.timeline);
        };

        $scope.close = function () {
          $modalInstance.dismiss();
        };
      }
    ]);
})(angular);
