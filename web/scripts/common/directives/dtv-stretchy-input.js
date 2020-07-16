'use strict';

angular.module('risevision.apps.directives')
  .directive('stretchyInput', ['$window', '$timeout',
    function ($window, $timeout) {
      return {
        restrict: 'E',
        require: 'ngModel',
        scope: {
          ngModel: '='
        },
        templateUrl: 'partials/common/stretchy-input.html',
        link: function ($scope, element) {
          $scope.isEditingInput = false;
          $scope.defaultInputValue = $scope.ngModel;
          $scope.defaultInputWidth = '';

          var _initStretchy = function () {
            var stretchyInputElement = element.find('input.input-stretchy');

            $window.Stretchy.resize(stretchyInputElement[0]);

            if (!$scope.defaultInputWidth) {
              // first time editing, store the width of the field when default name is displayed
              $scope.defaultInputWidth = $window.getComputedStyle(stretchyInputElement[0]).getPropertyValue('width');
            }
          };

          $timeout(_initStretchy);

          $scope.$watch('isEditingInput', function (editing) {
            var stretchyInputElement = element.find('input.input-stretchy');

            if (editing) {
              setFocus(stretchyInputElement[0]);
            } else {
              var nameVal = stretchyInputElement[0].value.replace(/\s/g, '');

              if (!nameVal) {
                // user deleted entire name, set the name and width values to the defaults
                $scope.ngModel = $scope.defaultInputValue;
                stretchyInputElement[0].style.width = $scope.defaultInputWidth;
              }
            }
          });

          $scope.onInputBlur = function () {
            $scope.isEditingInput = false;
          };

          $scope.inputKeyUp = function (keyEvent) {
            // handle enter key
            if (keyEvent.which === 13 && $scope.isEditingInput) {
              $scope.isEditingInput = false;
            }
          };

          function setFocus(elem) {
            if (elem !== null) {
              if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', 0);
                range.select();
              } else {
                if (elem.setSelectionRange) {
                  elem.focus();
                  elem.setSelectionRange(0, elem.value.length);
                } else {
                  elem.focus();
                }
              }
            }
          }
        }
      };
    }
  ]);
