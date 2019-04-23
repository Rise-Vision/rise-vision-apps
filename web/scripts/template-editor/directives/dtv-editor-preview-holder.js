'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorPreviewHolder', ['$window', '$sce', 'templateEditorFactory', 'HTML_TEMPLATE_URL', 'WIDGETS_DOMAIN',
    function ($window, $sce, templateEditorFactory, HTML_TEMPLATE_URL, WIDGETS_DOMAIN) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/preview-holder.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          $scope.getEditorPreviewUrl = function(productCode) {
            var url = HTML_TEMPLATE_URL.replace('PRODUCT_CODE', productCode);

            return $sce.trustAsResourceUrl(url);
          }

          $scope.$watch('factory.presentation.templateAttributeData', function (value) {
            var attributeDataText = typeof value === 'string' ?
              value : JSON.stringify(value);

            var iframe = $window.document.getElementById('template-editor-preview');

            iframe.contentWindow.postMessage(attributeDataText, WIDGETS_DOMAIN);

            console.log('attribute data text');
            console.log(attributeDataText);
            console.log(iframe.src);

            iframe.contentWindow.onload = function() {
              console.log('content window loaded');
              console.log(iframe.src);
            }
          }, true);
        }
      };
    }
  ]);
