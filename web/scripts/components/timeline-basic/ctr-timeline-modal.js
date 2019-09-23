(function (angular) {
  "use strict";
  angular.module("risevision.common.components.timeline-basic")
    .controller("timelineBasicModal", ["$scope", "$modalInstance", "timeline",
      "TimelineBasicFactory",
      function ($scope, $modalInstance, timeline, TimelineBasicFactory) {
        var factory = new TimelineBasicFactory(timeline);
        $scope.recurrence = factory.recurrence;
        $scope.timeline = factory.timeline;

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
