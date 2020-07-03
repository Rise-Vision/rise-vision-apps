'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeList', ['templateEditorFactory', 'brandingFactory',
  'blueprintFactory', 'scheduleSelectorFactory',
    function (templateEditorFactory, brandingFactory, blueprintFactory, scheduleSelectorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/attribute-list.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          $scope.brandingComponent = brandingFactory.getBrandingComponent();
          $scope.schedulesComponent = scheduleSelectorFactory.getSchedulesComponent();

          $scope.components = blueprintFactory.blueprintData.components
            .filter(function (c) {
              return !c.nonEditable;
            });
        }
      };
    }
  ]);
