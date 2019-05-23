'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentWeather', ['templateEditorFactory', 'userState',
    function (templateEditorFactory, userState) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-weather.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          function _load() {
            var attributeDataValue = $scope.getAttributeData($scope.componentId, 'scale');
            if (attributeDataValue) {
              $scope.scale = attributeDataValue;
            } else {
              $scope.scale = $scope.getBlueprintData($scope.componentId, 'scale');
            }
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'scale', $scope.scale);
          };

          $scope.registerDirective({
            type: 'rise-data-weather',
            iconType: 'svg',
            // fas fa-cloud-sun
            // Source: https://fontawesome.com/icons/cloud-sun?style=solid
            // License: https://fontawesome.com/license/free
            icon: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cloud-sun" class="svg-inline--fa fa-cloud-sun fa-w-20" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M575.2 325.7c.2-1.9.8-3.7.8-5.6 0-35.3-28.7-64-64-64-12.6 0-24.2 3.8-34.1 10-17.6-38.8-56.5-66-101.9-66-61.8 0-112 50.1-112 112 0 3 .7 5.8.9 8.7-49.6 3.7-88.9 44.7-88.9 95.3 0 53 43 96 96 96h272c53 0 96-43 96-96 0-42.1-27.2-77.4-64.8-90.4zm-430.4-22.6c-43.7-43.7-43.7-114.7 0-158.3 43.7-43.7 114.7-43.7 158.4 0 9.7 9.7 16.9 20.9 22.3 32.7 9.8-3.7 20.1-6 30.7-7.5L386 81.1c4-11.9-7.3-23.1-19.2-19.2L279 91.2 237.5 8.4C232-2.8 216-2.8 210.4 8.4L169 91.2 81.1 61.9C69.3 58 58 69.3 61.9 81.1l29.3 87.8-82.8 41.5c-11.2 5.6-11.2 21.5 0 27.1l82.8 41.4-29.3 87.8c-4 11.9 7.3 23.1 19.2 19.2l76.1-25.3c6.1-12.4 14-23.7 23.6-33.5-13.1-5.4-25.4-13.4-36-24zm-4.8-79.2c0 40.8 29.3 74.8 67.9 82.3 8-4.7 16.3-8.8 25.2-11.7 5.4-44.3 31-82.5 67.4-105C287.3 160.4 258 140 224 140c-46.3 0-84 37.6-84 83.9z"></path></svg>',
            element: element,
            show: function () {
              element.show();
              $scope.componentId = $scope.factory.selected.id;
              _load();
            },
            getSetupData: function (componentBlueprint) {
              var company = userState.getCopyOfSelectedCompany(true);
              var displayAddress = {
                city: company.city,
                province: company.province,
                country: company.country,
                postalCode: company.postalCode
              };
              return {
                id: componentBlueprint.id,
                displayAddress: displayAddress
              };
            }
          });

        }
      };
    }
  ]);
