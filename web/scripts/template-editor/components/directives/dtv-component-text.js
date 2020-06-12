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

          function _load() {
            $scope.isMultiline = $scope.getBlueprintData($scope.componentId, 'multiline');
            var value = $scope.getAvailableAttributeData($scope.componentId, 'value');
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
            $scope.fontsize = fontsizeInt;
            $scope.showFontSize = !!fontsizeInt;
            $scope.text = 'Test Text';

            $timeout(function () {
              $window.dispatchEvent(new Event('resize'));
            }, 400);
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'value', $scope.value);
            $scope.setAttributeData($scope.componentId, 'quillValue', $scope.quillValue);
            if ($scope.showFontSize) {
              $scope.setAttributeData($scope.componentId, 'fontsize', $scope.fontsize);
            }
          };

          $scope.quillValue = "";

          $scope.editorCreated = function (editor) {
            console.log(editor);
          };
          $scope.contentChanged = function (editor, html, text, content, delta, oldDelta, source) {
            console.log('editor: ', editor, 'html: ', html, 'text:', text, 'content:', content, 'delta: ', delta, 'oldDelta:', oldDelta, 'source:', source);
            console.log('CONTENTTTT', $scope.quillValue);
          };

          $scope.selectionChanged = function (editor, range, oldRange, source) {
            console.log('editor: ', editor, 'range: ', range, 'oldRange:', oldRange, 'source:', source);
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
