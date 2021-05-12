'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentText', ['$timeout', '$window', 'templateEditorFactory', 'attributeDataFactory', 'templateEditorUtils',
    function ($timeout, $window, templateEditorFactory, attributeDataFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-text.html',
        link: function ($scope, element) {
          $scope.sliderOptions = {
            hideLimitLabels: true,
            hidePointerLabels: true
          };

          function _load() {
            $scope.isMultiline = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'multiline');
            var value = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'value');
            var fontsize = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'fontsize');
            var minfontsize = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'minfontsize');
            var maxfontsize = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'maxfontsize');

            var fontsizeInt = templateEditorUtils.intValueFor(fontsize, null);
            var minFontSize = templateEditorUtils.intValueFor(minfontsize, 1);
            var maxFontSize = templateEditorUtils.intValueFor(maxfontsize, 200);

            $scope.sliderOptions.floor = minFontSize;
            $scope.sliderOptions.ceil = maxFontSize;
            $scope.sliderOptions.onEnd = $scope.save;

            $scope.value = value;
            $scope.fontsize = fontsizeInt;
            $scope.showFontSize = !!fontsizeInt;

            $timeout(function () {
              $window.dispatchEvent(new Event('resize'));
            }, 400);
          }

          $scope.save = function () {
            attributeDataFactory.setAttributeData($scope.componentId, 'value', $scope.value);

            if ($scope.showFontSize) {
              attributeDataFactory.setAttributeData($scope.componentId, 'fontsize', $scope.fontsize);
            }
          };

          $scope.registerDirective({
            type: 'rise-text',
            element: element,
            show: function () {
              $scope.componentId = templateEditorFactory.selected.id;
              _load();
            }
          });

        }
      };
    }
  ]);
