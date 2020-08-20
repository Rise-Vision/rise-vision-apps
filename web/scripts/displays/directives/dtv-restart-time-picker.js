'use strict';

angular.module('risevision.displays.directives')
  .directive('restartTimePicker', ['timeParser',
    function (timeParser) {

      return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
          timeString: '=ngModel'
        },
        templateUrl: 'partials/displays/restart-time-picker.html',
        link: function ($scope, elm, attrs, ctrl) {
          $scope.$watch('time', function () {
            var time = timeParser.parseAmpm($scope.time);
            
            if (time) {
              ctrl.$setViewValue(time);              
            }
          });

          $scope.$watch('timeString', function () {
            var time = timeParser.parseMilitary($scope.timeString);
            
            if (time) {
              $scope.time = time;
            }
          });

          $scope.openTimePicker = function ($event, picker) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope[picker] = !$scope[picker];
          };

        } //link()
      };
    }
  ]);
