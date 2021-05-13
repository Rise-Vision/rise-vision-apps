'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeList', ['userState', 'componentsFactory', 'templateEditorFactory',
    'brandingFactory', 'blueprintFactory', 'scheduleSelectorFactory',
    function (userState, componentsFactory, templateEditorFactory, brandingFactory, 
      blueprintFactory, scheduleSelectorFactory) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/template-editor/attribute-list.html',
        link: function ($scope) {
          $scope.componentsFactory = componentsFactory;
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
        }
      };
    }
  ]);
