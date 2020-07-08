'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeList', ['userState', 'templateEditorFactory', 'brandingFactory',
    'blueprintFactory', 'scheduleSelectorFactory', 'tourFactory',
    function (userState, templateEditorFactory, brandingFactory, blueprintFactory, scheduleSelectorFactory, tourFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/attribute-list.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          $scope.brandingComponent = brandingFactory.getBrandingComponent();

          if (userState.hasRole('cp')) {
            $scope.schedulesComponent = scheduleSelectorFactory.getSchedulesComponent();            
          }

          $scope.components = blueprintFactory.blueprintData.components
            .filter(function (c) {
              return !c.nonEditable;
            });

          var tooltipKey = 'ScheduleSelectorTooltip';
          $scope.showTooltipOverlay = tourFactory.isShowing(tooltipKey);

          if ($scope.showTooltipOverlay) {
            var handler = $scope.$on('tooltipOverlay.dismissed', function () {
              tourFactory.dismissed(tooltipKey);
              $scope.showTooltipOverlay = false;
              handler();
            });
          }
        }
      };
    }
  ]);
