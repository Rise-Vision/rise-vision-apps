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

          /*jshint camelcase: false */
          $scope.tinymceOptions = {
            baseURL: '/vendor/tinymce/', //set path to load theme and skin files
            plugins: 'colorpicker textcolor lists link',
            menubar: false,
            toolbar1: 'fontselect fontsizeselect | ' +
              'forecolor backcolor | ' +
              'bold italic underline | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist | ' + 'link | ' +
              'removeformat code',
            fontsize_formats: '8px 10px 12px 14px 18px 24px 36px',
            setup: function(editor) {
              editor.on('paste', function(e) {
                //paste does not trigger change event
                //editor.getContent() needs timeout in order to include the change
                setTimeout(function() {
                  $scope.data.richText = editor.getContent();
                  $scope.save();
                }, 100);
              });
            }
          };
          /*jshint camelcase: true */

          $scope.data = {
            richText: ''
          };

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
            $scope.data.richText = richText;
            $scope.fontsize = fontsizeInt;
            $scope.showFontSize = !!fontsizeInt;

            $timeout(function () {
              $window.dispatchEvent(new Event('resize'));
            }, 400);
          }

          $scope.save = function () {
            $scope.setAttributeData($scope.componentId, 'richText', $scope.data.richText);
            $scope.setAttributeData($scope.componentId, 'value', undefined);

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
