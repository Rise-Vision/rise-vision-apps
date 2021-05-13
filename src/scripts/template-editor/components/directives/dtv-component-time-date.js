'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentTimeDate', ['WORLD_TIMEZONES', 'componentsFactory', 'attributeDataFactory',
    function (WORLD_TIMEZONES, componentsFactory, attributeDataFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-time-date.html',
        link: function ($scope, element) {
          var DATE_FORMATS = ['MMMM DD, YYYY', 'MMM DD YYYY', 'MM/DD/YYYY', 'DD/MM/YYYY'];

          $scope.dateFormats = DATE_FORMATS.map(function (format) {
            return {
              format: format,
              date: moment().format(format)
            };
          });
          $scope.timezones = WORLD_TIMEZONES;

          $scope.registerDirective({
            type: 'rise-time-date',
            element: element,
            show: function () {
              element.show();
              $scope.componentId = componentsFactory.selected.id;
              $scope.load();
            },
            getTitle: function (component) {
              return 'template.rise-time-date' + '-' + component.attributes.type.value;
            }
          });

          $scope.load = function () {
            var defaultType = attributeDataFactory.getBlueprintData($scope.componentId, 'type');
            var type = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'type');
            var timeFormat = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'time');
            var dateFormat = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'date');
            var timezone = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'timezone');
            var timeFormatVal = timeFormat || 'Hours12';
            var dateFormatVal = dateFormat || $scope.dateFormats[0].format;

            $scope.defaultType = defaultType;
            $scope.type = type;
            $scope.timezoneType = !timezone ? 'DisplayTz' : 'SpecificTz';
            $scope.timezone = timezone;

            if ($scope.type === 'time') {
              $scope.timeFormat = timeFormatVal;
            }

            if ($scope.type === 'date') {
              $scope.dateFormat = dateFormatVal;
            }

            if ($scope.type === 'timedate') {
              $scope.timeFormat = timeFormatVal;
              $scope.dateFormat = dateFormatVal;
            }
          };

          $scope.save = function () {
            if ($scope.timezoneType === 'DisplayTz' || !$scope.timezone) {
              $scope.timezone = null;
            }

            if (!$scope.defaultType) {
              attributeDataFactory.setAttributeData($scope.componentId, 'type', $scope.type);
            }

            if ($scope.type === 'timedate') {
              attributeDataFactory.setAttributeData($scope.componentId, 'time', $scope.timeFormat);
              attributeDataFactory.setAttributeData($scope.componentId, 'date', $scope.dateFormat);
            } else if ($scope.type === 'time') {
              attributeDataFactory.setAttributeData($scope.componentId, 'time', $scope.timeFormat);
            } else if ($scope.type === 'date') {
              attributeDataFactory.setAttributeData($scope.componentId, 'date', $scope.dateFormat);
            }

            attributeDataFactory.setAttributeData($scope.componentId, 'timezone', $scope.timezone);
          };
        }
      };
    }
  ]);
