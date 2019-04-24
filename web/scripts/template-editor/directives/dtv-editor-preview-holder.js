'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorPreviewHolder', ['$window', '$sce', 'templateEditorFactory', 'HTML_TEMPLATE_DOMAIN', 'HTML_TEMPLATE_URL',
    function ($window, $sce, templateEditorFactory, HTML_TEMPLATE_DOMAIN, HTML_TEMPLATE_URL) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/preview-holder.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

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
