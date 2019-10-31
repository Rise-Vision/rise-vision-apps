'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentCounter', ['templateEditorFactory', 'templateEditorUtils',
    function (templateEditorFactory, utils) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-counter.html',
        compile: function () {
          return {
            pre: function ($scope) {
              $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                showWeeks: false,
                showButtonBar: false
              };

              $scope.targetDatePicker = {
                isOpen: false,
                initDate: null
              };

              $scope.targetTimePicker = {
                isOpen: false
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
                  $scope.load();
                },
                getTitle: function (component) {
                  return 'template.rise-data-counter' + '-' + component.attributes.type.value;
                }
              });

              $scope.load = function () {
                $scope.counterType = $scope.getAvailableAttributeData($scope.componentId, 'type');
                $scope.targetDate = $scope.getAvailableAttributeData($scope.componentId, 'date');
                $scope.targetTime = $scope.getAvailableAttributeData($scope.componentId, 'time');

                if ($scope.targetDate) {
                  $scope.targetUnit = 'targetDate';
                } else if ($scope.targetTime) {
                  $scope.targetTime = utils.absoluteTimeToMeridian($scope.targetTime);
                  $scope.targetUnit = 'targetTime';
                }
              };

              $scope.save = function () {
                if ($scope.targetUnit === 'targetDate') {
                  $scope.setAttributeData($scope.componentId, 'date', utils.formatISODate($scope.targetDate));
                  $scope.setAttributeData($scope.componentId, 'time', null);
                } else if ($scope.targetUnit === 'targetTime') {
                  $scope.setAttributeData($scope.componentId, 'date', null);
                  $scope.setAttributeData($scope.componentId, 'time', utils.meridianTimeToAbsolute($scope.targetTime));
                }
              };

              $scope.openDatePicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.targetDatePicker.isOpen = !$scope.targetDatePicker.isOpen;
              };

              $scope.openTimePicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.targetTimePicker.isOpen = !$scope.targetTimePicker.isOpen;
              };
            }
          };
        }
      };
    }
  ]);
