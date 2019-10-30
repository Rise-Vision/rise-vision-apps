'use strict';

angular.module('risevision.template-editor.directives')
  .directive('timePicker', [function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/template-editor/time-picker.html',
        link: function ($scope) {
          $scope.$watch('time', function(newValue, oldValue) {
            if (newValue && newValue !== oldValue) {
              var parts = _parseTime(newValue);
              var _hours = isNaN(parts[0]) ? 12 : Number(parts[0]);

              $scope.hours = _hours % 12 === 0 ? 12 : _hours;
              $scope.minutes = isNaN(parts[1]) ? 0 : Number(parts[1]);
              $scope.meridian = _hours > 12 ? 'PM' : 'AM';

              if (isNaN(parts[0]) || isNaN(parts[1])) {
                $scope.updateTime();
              }
            } else {
              $scope.time = '12:00';
            }
          });

          $scope.increaseHours = function () {
            $scope.hours = _increaseValue($scope.hours, 1, 12);
            $scope.updateTime();
          };

          $scope.decreaseHours = function () {
            $scope.hours = _decreaseValue($scope.hours, 1, 12);
            $scope.updateTime();
          };

          $scope.increaseMinutes = function () {
            $scope.minutes = _increaseValue($scope.minutes, 0, 59);
            $scope.updateTime();
          };

          $scope.decreaseMinutes = function () {
            $scope.minutes = _decreaseValue($scope.minutes, 0, 59);
            $scope.updateTime();
          };

          $scope.toggleMeridian = function (meridian) {
            $scope.meridian = meridian;
            $scope.updateTime();
          };

          $scope.updateTime = function () {
            var hours = $scope.hours + ($scope.meridian === 'PM' ? 12 : 0);

            $scope.time = $scope.padNumber(hours) + ':' + $scope.padNumber($scope.minutes);
          };

          $scope.padNumber = function (number) {
            if (number < 10) {
              return '0' + number;
            } else {
              return number;
            }
          };

          function _increaseValue(val, min, max) {
            if (val < max) {
              return ++val;
            } else {
              return min;
            }
          }

          function _decreaseValue(val, min, max) {
            if (val > min) {
              return --val;
            } else {
              return max;
            }
          }

          function _parseTime(time) {
            return time.split(':');
          }
        }
      };
    }
  ])
  .directive('timePickerPopup', ['$compile', function ($compile) {
      return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
        },
        link: function ($scope, element, attrs, ngModelController) {
          var popupEl = angular.element('<div><div time-picker time="time"></div></div>');
          var popup = $compile(popupEl)($scope);

          ngModelController.$formatters.push(function(value) {
            $scope.time = value;
            return value;
          });

          $scope.$watch('time', function (newValue, oldValue) {
            if (newValue !== oldValue) {
              ngModelController.$setViewValue(newValue);
              ngModelController.$render();
            }
          });

          element.after(popup);
        }
      };
    }
  ]);
