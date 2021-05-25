'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentText', ['$timeout', '$window', 'componentsFactory', 'attributeDataFactory', 'templateEditorUtils',
    function ($timeout, $window, componentsFactory, attributeDataFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-text.html',
        link: function ($scope, element) {
          $scope.alignmentOptions = [
            {
              name: 'Top Left',
              vertical: 'top',
              horizontal: 'left'
            },
            {
              name: 'Top Center',
              vertical: 'top',
              horizontal: 'center'
            },
            {
              name: 'Top Right',
              vertical: 'top',
              horizontal: 'right'
            },
            {
              name: 'Middle Left',
              vertical: 'middle',
              horizontal: 'left'
            },
            {
              name: 'Middle Center',
              vertical: 'middle',
              horizontal: 'center'
            },
            {
              name: 'Middle Right',
              vertical: 'middle',
              horizontal: 'right'
            },
            {
              name: 'Bottom Left',
              vertical: 'bottom',
              horizontal: 'left'
            },
            {
              name: 'Bottom Center',
              vertical: 'bottom',
              horizontal: 'center'
            },
            {
              name: 'Bottom Right',
              vertical: 'bottom',
              horizontal: 'right'
            }
          ];

          $scope.sliderOptions = {
            hideLimitLabels: true,
            hidePointerLabels: true
          };

          function _loadAlignment() {
            var vertical = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'verticalalign');
            var horizontal = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'horizontalalign');

            $scope.alignment = _.find($scope.alignmentOptions, function (o) {
              return o.vertical === vertical && o.horizontal === horizontal;
            });
            $scope.showAlignment = !!$scope.alignment;
          }

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

            _loadAlignment();

            $timeout(function () {
              $window.dispatchEvent(new Event('resize'));
            }, 400);
          }

          $scope.save = function () {
            attributeDataFactory.setAttributeData($scope.componentId, 'value', $scope.value);

            if ($scope.showFontSize) {
              attributeDataFactory.setAttributeData($scope.componentId, 'fontsize', $scope.fontsize);
            }

            if ($scope.showAlignment) {
              attributeDataFactory.setAttributeData($scope.componentId, 'verticalalign', $scope.alignment.vertical);
              attributeDataFactory.setAttributeData($scope.componentId, 'horizontalalign', $scope.alignment.horizontal);
              attributeDataFactory.setAttributeData($scope.componentId, 'textalign', $scope.alignment.horizontal);
            }
          };

          componentsFactory.registerDirective({
            type: 'rise-text',
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
