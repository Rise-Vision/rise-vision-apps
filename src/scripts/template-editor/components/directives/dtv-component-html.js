'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentHtml', ['$timeout', 'templateEditorFactory', 'attributeDataFactory',
    function ($timeout, templateEditorFactory, attributeDataFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-html.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.codemirrorOptions = {};

          function _load() {
            var html = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'html');

            $scope.html = html;

            $timeout(function () {
              $scope.codemirrorOptions = {
                lineNumbers: true,
                theme: 'default',
                lineWrapping: false,
                mode: 'htmlmixed'
              };
            }, 400);
          }

          $scope.save = function () {
            attributeDataFactory.setAttributeData($scope.componentId, 'html', $scope.html);
          };

          $scope.registerDirective({
            type: 'rise-html',
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
