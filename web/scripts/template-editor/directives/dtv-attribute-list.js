'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeList', ['userState', 'templateEditorFactory', 'brandingFactory',
    'blueprintFactory', 'scheduleSelectorFactory', 'tourFactory',
    function (userState, templateEditorFactory, brandingFactory,
      blueprintFactory, scheduleSelectorFactory, tourFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/attribute-list.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          showFirstActiveTooltip();

          $scope.brandingComponent = brandingFactory.getBrandingComponent();

          if (userState.hasRole('cp')) {
            $scope.schedulesComponent = scheduleSelectorFactory.getSchedulesComponent(templateEditorFactory
              .presentation);
          }

          $scope.colorsComponent = blueprintFactory.hasBranding() ? {
            type: 'rise-override-brand-colors'
          } : null;

          $scope.components = blueprintFactory.blueprintData.components
            .filter(function (c) {
              return !c.nonEditable;
            });

          function showFirstActiveTooltip() {
            $scope.tooltipKey = tourFactory.findActiveKey(['ScheduleSelectorTooltip', 'BrandingOverrideTooltip']);
          }
        }
      };
    }
  ]);
