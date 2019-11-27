'use strict';

angular.module('risevision.template-editor.directives')
  .directive('timePicker', ['templateEditorUtils',
    function (utils) {
      return {
        restrict: 'A',
        templateUrl: 'partials/template-editor/time-picker.html',
        link: function ($scope) {
          var regex = /^(\d{1,2}):(\d{1,2}) (\D{2})$/;

          $scope.$watch('time', function (newValue, oldValue) {
            if (newValue && newValue !== oldValue && regex.test(newValue)) {
              var parts = regex.exec(newValue);
              var _hours = Number(parts[1]);
              var _minutes = Number(parts[2]);

              $scope.hours = Math.min(_hours, 12);
              $scope.minutes = Math.min(_minutes, 59);
              $scope.meridian = parts[3];
            } else {
              $scope.time = '12:00 AM';
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

          $scope.setMeridian = function (meridian) {
            $scope.meridian = meridian;
            $scope.updateTime();
          };

          $scope.updateTime = function () {
            $scope.time = utils.padNumber($scope.hours, 2) + ':' + utils.padNumber($scope.minutes, 2) + ' ' +
              $scope.meridian;
          };

          $scope.padNumber = function (number) {
            return utils.padNumber(number, 2);
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
  .directive('timePickerPopup', ['$compile', '$document',
    function ($compile, $document) {
      return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
          isOpen: '='
        },
        link: function ($scope, element, attrs, ngModelController) {
          var popupElement = angular.element('<div><div time-picker time="time"></div></div>');
          var popupCompiled = $compile(popupElement)($scope);

          ngModelController.$formatters.push(function (value) {
            $scope.time = value;
            return value;
          });

          $scope.$watch('isOpen', function (newValue) {
            if (newValue) {
              $document.on('click', _documentClickHandler);
              $document.on('touchstart', _documentClickHandler);
            } else {
              $document.off('click', _documentClickHandler);
              $document.off('touchstart', _documentClickHandler);
            }
          });

          $scope.$watch('time', function (newValue, oldValue) {
            if (newValue !== oldValue) {
              ngModelController.$setViewValue(newValue);
              ngModelController.$render();
            }
          });

          element.after(popupCompiled);

          function _documentClickHandler() {
            if (!$scope.isOpen && $scope.disabled) {
              return;
            }

            var popup = popupCompiled[0];
            var dpContainsTarget = element[0].contains(event.target);
            var popupContainsTarget = popup.contains !== undefined && popup.contains(event.target);

            if ($scope.isOpen && !(dpContainsTarget || popupContainsTarget)) {
              $scope.$apply(function () {
                $scope.isOpen = false;
              });
            }
          }
        }
      };
    }
  ]);
