'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeList', ['userState', 'templateEditorFactory', 'brandingFactory',
    'blueprintFactory', 'scheduleSelectorFactory',
    function (userState, templateEditorFactory, brandingFactory, blueprintFactory, scheduleSelectorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/attribute-list.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
          $scope.tooltipKey = 'ScheduleSelectorTooltip';

          $scope.brandingComponent = brandingFactory.getBrandingComponent();

          if (userState.hasRole('cp')) {
            $scope.schedulesComponent = scheduleSelectorFactory.getSchedulesComponent(templateEditorFactory
              .presentation);
          }

          $scope.components = blueprintFactory.blueprintData.components
            .filter(function (c) {
              return !c.nonEditable;
            });
        }
      };
    }
  ]);
