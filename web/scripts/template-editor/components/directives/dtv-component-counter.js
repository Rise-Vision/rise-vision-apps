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

              $scope.targetDatePicker = {
                isOpen: false,
                initDate: null
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

                $scope.targetUnit = $scope.targetTime ? 'targetTime' : 'targetDate';
              };

              $scope.save = function () {
                if ($scope.targetUnit === 'targetDate') {
                  $scope.setAttributeData($scope.componentId, 'date', $scope.targetDate);
                  $scope.setAttributeData($scope.componentId, 'time', null);
                } else if ($scope.targetUnit === 'targetTime') {
                  $scope.setAttributeData($scope.componentId, 'date', null);
                  $scope.setAttributeData($scope.componentId, 'time', $scope.targetTime);
                }
              };

              $scope.openDatePicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.targetDatePicker.isOpen = !$scope.targetDatePicker.isOpen;
              };
            }
          };
        }
      };
    }
  ]);
