'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentHtml', ['$timeout', 'componentsFactory', 'attributeDataFactory',
    function ($timeout, componentsFactory, attributeDataFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-html.html',
        link: function ($scope, element) {
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

          componentsFactory.registerDirective({
            type: 'rise-html',
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
