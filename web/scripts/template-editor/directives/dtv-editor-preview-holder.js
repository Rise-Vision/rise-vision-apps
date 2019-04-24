'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorPreviewHolder', ['$window', '$sce', 'templateEditorFactory', 'HTML_TEMPLATE_DOMAIN', 'HTML_TEMPLATE_URL',
    function ($window, $sce, templateEditorFactory, HTML_TEMPLATE_DOMAIN, HTML_TEMPLATE_URL) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/preview-holder.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          var DEFAULT_TEMPLATE_WIDTH = 800;
          var DEFAULT_TEMPLATE_HEIGHT = 600;

          var iframeLoaded = false;
          var attributeDataText = null;
          var iframe = $window.document.getElementById('template-editor-preview');

          iframe.onload = function() {
            iframeLoaded = true;

            _postAttributeData();
          }

          $scope.getEditorPreviewUrl = function(productCode) {
            var url = HTML_TEMPLATE_URL.replace('PRODUCT_CODE', productCode);

            return $sce.trustAsResourceUrl(url);
          }

          function _getTemplateWidth() {
            var width = $scope.factory.blueprintData.width;

            return width ? parseInt( width ) : DEFAULT_TEMPLATE_WIDTH;
          }

          function _getTemplateHeight() {
            var height = $scope.factory.blueprintData.height;

            return height ? parseInt( height ) : DEFAULT_TEMPLATE_HEIGHT;
          }

          $scope.getTemplateAspectRatio = function() {
            var value = ( _getTemplateHeight() / _getTemplateWidth() ) * 100;

            return value.toFixed(2);
          }

          $scope.$watch('factory.presentation.templateAttributeData', function (value) {
            attributeDataText = typeof value === 'string' ?
              value : JSON.stringify(value);

            _postAttributeData();
          }, true);

          function _postAttributeData() {
            if( !attributeDataText || !iframeLoaded ) {
              return;
            }

            iframe.contentWindow.postMessage(attributeDataText, HTML_TEMPLATE_DOMAIN);

            attributeDataText = null;
          }
        }
      };
    }
  ]);
