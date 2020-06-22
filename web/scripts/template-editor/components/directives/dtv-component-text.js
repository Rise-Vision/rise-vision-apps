'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentText', ['$timeout', '$window', 'templateEditorFactory', 'templateEditorUtils',
    function ($timeout, $window, templateEditorFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-text.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.sliderOptions = {
            hideLimitLabels: true,
            hidePointerLabels: true
          };

          $scope.tinymceOptions = {
            plugins: 'code colorpicker textcolor wordcount',
            menubar: false,
            toolbar1: 'fontselect fontsizeselect | ' +
              'forecolor backcolor | ' +
              'bold italic underline | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist indent outdent lineheight | ' +
              'removeformat code',
            setup: function (editor) {
              editor.addButton('lineheight', {
                type: 'listbox',
                text: 'Line Height',
                title: 'Line Height',
                icon: false,
                values: [{
                    text: 'Single',
                    value: '1'
                  },
                  {
                    text: 'Double',
                    value: '2'
                  }
                ]
              });
            }
          };

          $scope.richText = '';

          function _load() {
            $scope.isMultiline = $scope.getBlueprintData($scope.componentId, 'multiline');
            var value = $scope.getAvailableAttributeData($scope.componentId, 'value');
            var richText = $scope.getAvailableAttributeData($scope.componentId, 'richText') ? $scope
              .getAvailableAttributeData($scope.componentId, 'richText') : value;
            var fontsize = $scope.getAvailableAttributeData($scope.componentId, 'fontsize');
            var minfontsize = $scope.getAvailableAttributeData($scope.componentId, 'minfontsize');
            var maxfontsize = $scope.getAvailableAttributeData($scope.componentId, 'maxfontsize');

            var fontsizeInt = templateEditorUtils.intValueFor(fontsize, null);
            var minFontSize = templateEditorUtils.intValueFor(minfontsize, 1);
            var maxFontSize = templateEditorUtils.intValueFor(maxfontsize, 200);

            $scope.sliderOptions.floor = minFontSize;
            $scope.sliderOptions.ceil = maxFontSize;
            $scope.sliderOptions.onEnd = $scope.save;

            $scope.value = value;
            $scope.richText = richText;
            $scope.fontsize = fontsizeInt;
            $scope.showFontSize = !!fontsizeInt;

            $timeout(function () {
              $window.dispatchEvent(new Event('resize'));
            }, 400);
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'richText', $scope.richText);

            if ($scope.showFontSize) {
              $scope.setAttributeData($scope.componentId, 'fontsize', $scope.fontsize);
            }
          };

          $scope.registerDirective({
            type: 'rise-text',
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
