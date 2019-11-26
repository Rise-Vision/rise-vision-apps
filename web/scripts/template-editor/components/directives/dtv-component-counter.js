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

              $scope.targetDateTimePicker = {
                isOpen: false
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
                var counterType = $scope.getAvailableAttributeData($scope.componentId, 'type');
                var targetDate = $scope.getAvailableAttributeData($scope.componentId, 'date');
                var targetTime = $scope.getAvailableAttributeData($scope.componentId, 'time');
                var nonCompletion = $scope.getAvailableAttributeData($scope.componentId, 'non-completion');
                var completion = $scope.getAvailableAttributeData($scope.componentId, 'completion');

                $scope.counterType = counterType;
                $scope.nonCompletion = nonCompletion === '';
                $scope.completionMessage = completion;

                if (targetDate) {
                  var localDate = new Date(targetDate);
                  localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());

                  $scope.targetUnit = 'targetDate';
                  // Set init-date attribute to fix issue with Date initialization
                  // https://github.com/angular-ui/bootstrap/issues/5081
                  $scope.targetDatePicker.initDate = localDate;

                  $scope.targetDate = localDate;
                  $scope.targetDateTime = utils.absoluteTimeToMeridian(targetTime);
                } else if (targetTime) {
                  $scope.targetTime = utils.absoluteTimeToMeridian(targetTime);
                  $scope.targetUnit = 'targetTime';
                } else {
                  $scope.targetDate = null;
                  $scope.targetTime = null;
                  $scope.targetUnit = null;
                }

                _registerDatePickerClosingWatch();
              };

              $scope.save = function () {
                if ($scope.targetUnit === 'targetDate') {
                  var formattedDateTime = utils.meridianTimeToAbsolute($scope.targetDateTime);
                  var localDate = new Date($scope.targetDate);
                  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());

                  $scope.setAttributeData($scope.componentId, 'date', utils.formatISODate(localDate));
                  $scope.setAttributeData($scope.componentId, 'time', formattedDateTime);
                } else if ($scope.targetUnit === 'targetTime' && $scope.targetTime) {
                  var formattedTime = utils.meridianTimeToAbsolute($scope.targetTime);

                  $scope.setAttributeData($scope.componentId, 'date', null);
                  $scope.setAttributeData($scope.componentId, 'time', formattedTime);
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

              $scope.openTimePicker = function ($event, type) {
                var picker = type === 'date' ? 'targetDateTimePicker' : 'targetTimePicker';

                $event.preventDefault();
                $event.stopPropagation();

                $scope[picker].isOpen = !$scope[picker].isOpen;
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
