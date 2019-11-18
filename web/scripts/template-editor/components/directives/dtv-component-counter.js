'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentCounter', ['$document', '$timeout', 'templateEditorFactory', 'templateEditorUtils',
    function ($document, $timeout, templateEditorFactory, utils) {
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
                $scope.nonCompletion = $scope.getAvailableAttributeData($scope.componentId,
                  'non-completion') === '';
                $scope.completionMessage = $scope.getAvailableAttributeData($scope.componentId, 'completion');

                if ($scope.targetDate) {
                  $scope.targetUnit = 'targetDate';
                } else if ($scope.targetTime) {
                  $scope.targetTime = utils.absoluteTimeToMeridian($scope.targetTime);
                  $scope.targetUnit = 'targetTime';
                }

                _registerDatePickerClosingWatch();
              };

              $scope.save = function () {
                if ($scope.targetUnit === 'targetDate') {
                  $scope.setAttributeData($scope.componentId, 'date', utils.formatISODate($scope.targetDate));
                  $scope.setAttributeData($scope.componentId, 'time', null);
                } else if ($scope.targetUnit === 'targetTime') {
                  $scope.setAttributeData($scope.componentId, 'date', null);
                  $scope.setAttributeData($scope.componentId, 'time', utils.meridianTimeToAbsolute($scope
                    .targetTime));
                }

                if ($scope.counterType === 'down' && !$scope.nonCompletion) {
                  $scope.setAttributeData($scope.componentId, 'completion', $scope.completionMessage);
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

              function _registerDatePickerClosingWatch() {
                $scope.$watch('targetDatePicker.isOpen', function (isOpen) {
                  $timeout(function () {
                    if (isOpen) {
                      $document.on('touchstart', _datePickerClickOutsideHander);
                    } else {
                      $document.off('touchstart', _datePickerClickOutsideHander);
                    }
                  }, 100);
                });
              }

              function _datePickerClickOutsideHander(event) {
                if (!$scope.targetDatePicker.isOpen) {
                  return;
                }

                var datePicker = $document[0].querySelector('.counter-container [datepicker]');
                var datePickerPopup = $document[0].querySelector('.counter-container [datepicker-popup-wrap]');
                var dpContainsTarget = datePicker.contains(event.target);
                var popupContainsTarget = datePickerPopup.contains(event.target);

                if (!(dpContainsTarget || popupContainsTarget)) {
                  $scope.$apply(function () {
                    $scope.targetDatePicker.isOpen = false;
                  });
                }
              }
            }
          };
        }
      };
    }
  ]);
