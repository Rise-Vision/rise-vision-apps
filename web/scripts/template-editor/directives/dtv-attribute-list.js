'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeList', ['templateEditorFactory', 'brandingFactory', 'blueprintFactory',
    function (templateEditorFactory, brandingFactory, blueprintFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/attribute-list.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          $scope.brandingComponent = brandingFactory.getBrandingComponent();

          $scope.components = blueprintFactory.blueprintData.components
            .filter(function (c) {
              return !c.nonEditable &&
                !(c.attributes && c.attributes['is-logo'] && c.attributes['is-logo'].value === 'true');
            });
        }
      };
    }
  ]);
