'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeEditor', ['$timeout', 'templateEditorFactory',
    function ($timeout, templateEditorFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/attribute-editor.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
          $scope.showAttributeList = true;

          $scope.editComponent = function (component) {
            $scope.factory.selected = component;
            _showAttributeList(false, 300);
          };

          $scope.backToList = function () {
            $scope.factory.selected = null;
            _showAttributeList(true, 0);
          };

          $scope.getComponentIcon = function (component) {
            var iconsMap = {
              'rise-data-financial': 'fa-line-chart',
              'rise-data-image': 'fa-image'
            };

            return component ? iconsMap[component.type] : '';
          };

          function _showAttributeList(value, delay) {
            $timeout(function () {
              $scope.showAttributeList = value;
            }, !isNaN(delay) ? delay : 500);
          }
        }
      };
    }
  ]);
