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
          $scope.directives = {};

          $scope.registerDirective = function (directive) {
            directive.element.hide();
            $scope.directives[directive.type] = directive;
          };

          $scope.editComponent = function (component) {
            var directive = $scope.directives[component.type];

            $scope.factory.selected = component;
            directive.show();

            _showAttributeList(false, 300);
          };

          $scope.onBackButton = function () {
            var component = $scope.factory.selected;
            var directive = $scope.directives[component.type];

            if (!directive.onBackHandler || !directive.onBackHandler()) {
              $scope.backToList();
            }
          };

          $scope.backToList = function () {
            var component = $scope.factory.selected;
            var directive = $scope.directives[component.type];

            $scope.factory.selected = null;
            directive.element.hide();

            _showAttributeList(true, 0);
          };

          $scope.getComponentIcon = function (component) {
            return component && $scope.directives[component.type] ?
              $scope.directives[component.type].icon : '';
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
