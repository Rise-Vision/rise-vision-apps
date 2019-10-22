'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentCounter', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-counter.html',
        compile: function () {
          return {
            pre: function($scope) {
              $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                showWeeks: false,
                showButtonBar: false
              };

              $scope.datePickers = {
                downToDate: {
                  isOpen: false,
                  initDate: null
                }
              };
            },
            post: function ($scope, element) {
              $scope.factory = templateEditorFactory;

              $scope.registerDirective({
                type: 'rise-data-counter',
                iconType: 'streamline',
                icon: 'hourglass',
                element: element,
                show: function () {
                  $scope.componentId = $scope.factory.selected.id;
                  _load();
                },
                getTitle: function (component) {
                  return 'template.rise-data-counter' + '-' + component.attributes.type.value;
                }
              });

              function _load () {
                $scope.date = $scope.getAvailableAttributeData($scope.componentId, 'date');
                $scope.time = $scope.getAvailableAttributeData($scope.componentId, 'time');

                $scope.countDownTo = $scope.time ? 'downToTime' : 'downToDate';
              }

              $scope.openSystemDatePicker = function () {
                let date = document.querySelector('#nativeDatePicker');

                date.style.display = 'block';
                date.focus();
                date.click();
              };

              $scope.closeSystemDatePicker = function () {
                let date = document.querySelector('#nativeDatePicker');

                date.style.display = 'none';
              };

              $scope.save = function () {
                //$scope.setAttributeData($scope.componentId, 'date', $scope.date);
              };

              $scope.openDatepicker = function ($event, which) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.datePickers[which].isOpen = !$scope.datePickers[which].isOpen;
              };
            }
          };
        }
      };
    }
  ]);
