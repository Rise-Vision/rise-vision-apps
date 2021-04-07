'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentHtml', ['$window', '$timeout', 'templateEditorFactory',
    function ($window, $timeout, templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-html.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.codemirrorOptions = {
            lineNumbers: true,
            theme: 'default',
            lineWrapping: false,
            mode: 'htmlmixed'
          };

          function _load() {
            var html = $scope.getAvailableAttributeData($scope.componentId, 'html');

            $scope.html = html;

            $timeout(function () {
              $window.dispatchEvent(new Event('resize'));
            }, 400);
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'html', $scope.html);
          };

          $scope.registerDirective({
            type: 'rise-html',
            iconType: 'streamline',
            icon: 'text',
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
