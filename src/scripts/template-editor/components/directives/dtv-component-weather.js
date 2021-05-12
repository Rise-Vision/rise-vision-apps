'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentWeather', ['templateEditorFactory', 'attributeDataFactory', 'companySettingsFactory', 'userState',
    function (templateEditorFactory, attributeDataFactory, companySettingsFactory, userState) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-weather.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
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

          $scope.registerDirective({
            type: 'rise-data-weather',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              _load();
            }
          });

        }
      };
    }
  ]);
