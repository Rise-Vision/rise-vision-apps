'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeList', ['templateEditorFactory', 'brandingFactory',
  'schedulesComponentFactory', 'blueprintFactory',
    function (templateEditorFactory, brandingFactory, schedulesComponentFactory, blueprintFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/attribute-list.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          $scope.brandingComponent = brandingFactory.getBrandingComponent();
          $scope.schedulesComponent = schedulesComponentFactory.getSchedulesComponent();

          $scope.components = blueprintFactory.blueprintData.components
            .filter(function (c) {
              return !c.nonEditable;
            });
        }
      };
    }
  ]);
