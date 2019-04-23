'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorPreviewHolder', ['$window', '$sce', 'templateEditorFactory', 'HTML_TEMPLATE_URL',
    function ($window, $sce, templateEditorFactory, HTML_TEMPLATE_URL) {
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
            var domain = $window.location.origin;

            iframe.contentWindow.postMessage(attributeDataText, domain);

            console.log('attribute data text');
            console.log(attributeDataText);
            console.log(domain);
          });
        }
      };
    }
  ]);
