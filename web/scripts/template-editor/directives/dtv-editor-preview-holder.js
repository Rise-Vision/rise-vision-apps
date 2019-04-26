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
          var MOBILE_PREVIEW_HEIGHT = 160;

          var iframeLoaded = false;
          var attributeDataText = null;

          var previewHolder = $window.document.getElementById('preview-holder');
          var iframeParent = $window.document.getElementById('template-editor-preview-parent');
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

          function _getHeightDividedByWidth() {
            return _getTemplateHeight() / _getTemplateWidth();
          }

          function _isLandscape() {
            return _getHeightDividedByWidth() < 1;
          }

          function _getWidthFor(height) {
            var value = height / _getHeightDividedByWidth();

            return value.toFixed(0);
          }

          $scope.getMobileWidth = function() {
            return _getWidthFor(MOBILE_PREVIEW_HEIGHT);
          }

          $scope.getDesktopWidth = function() {
            return _getWidthFor(previewHolder.clientHeight);
          }

          $scope.getTemplateAspectRatio = function() {
            var value = _getHeightDividedByWidth() * 100;

            return value.toFixed(2);
          }

          function _applyAspectRatio() {
            var style;

            if( $window.matchMedia('(max-width: 768px)').matches ) {
              style = 'width: ' + $scope.getMobileWidth() + 'px';
            } else if( _isLandscape() ) {
              var aspectRatio = $scope.getTemplateAspectRatio() + '%';

              style = 'padding-bottom: ' + aspectRatio + ';'
            } else {
              style = 'height: 100%; width: ' + $scope.getDesktopWidth() + 'px';
            }

            iframeParent.setAttribute('style', style);
          }

          $scope.$watchGroup([
            'factory.blueprintData.width',
            'factory.blueprintData.height'
          ], _applyAspectRatio);

          function _onResize() {
            _applyAspectRatio();

            $scope.$digest();
          }

          angular.element($window).on('resize', _onResize);
          $scope.$on('$destroy', function() {
            angular.element($window).off('resize', _onResize);
          });

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
