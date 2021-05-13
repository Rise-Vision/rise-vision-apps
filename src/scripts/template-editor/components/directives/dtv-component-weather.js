'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentWeather', ['componentsFactory', 'attributeDataFactory', 'companySettingsFactory', 'userState',
    function (componentsFactory, attributeDataFactory, companySettingsFactory, userState) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-weather.html',
        link: function ($scope, element) {
          $scope.companySettingsFactory = companySettingsFactory;
          $scope.canEditCompany = userState.hasRole('ua');

          var company = userState.getCopyOfSelectedCompany(true);
          $scope.hasValidAddress = !!(company.postalCode || (company.city && company.country));

          function _load() {
            var attributeDataValue = attributeDataFactory.getAttributeData($scope.componentId, 'scale');
            if (attributeDataValue) {
              $scope.scale = attributeDataValue;
            } else {
              $scope.scale = attributeDataFactory.getBlueprintData($scope.componentId, 'scale');
            }
          }

          $scope.save = function () {
            attributeDataFactory.setAttributeData($scope.componentId, 'scale', $scope.scale);
          };

          componentsFactory.registerDirective({
            type: 'rise-data-weather',
            element: element,
            show: function () {
              $scope.componentId = componentsFactory.selected.id;
              _load();
            }
          });

        }
      };
    }
  ]);
