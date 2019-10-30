'use strict';

angular.module('risevision.template-editor.directives')
  .directive('timePicker', [function () {
      return {
        restrict: 'A',
        templateUrl: 'partials/template-editor/time-picker.html',
        link: function ($scope) {
          var regex = /^(\d{1,2}):(\d{1,2}) (\D{2})$/;

          $scope.$watch('time', function(newValue, oldValue) {
            if (newValue && newValue !== oldValue && regex.test(newValue)) {
              var parts = regex.exec(newValue);
              var _hours = Number(parts[1]);
              var _minutes = Number(parts[2]);

              $scope.hours = Math.min(_hours, 12);
              $scope.minutes = Math.min(_minutes, 59);
              $scope.meridian = parts[3];
            } else {
              $scope.time = '12:00 PM';
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
            $scope.time = $scope.padNumber($scope.hours) + ':' + $scope.padNumber($scope.minutes) + ' ' + $scope.meridian;
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
