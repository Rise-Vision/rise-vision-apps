'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorPreviewHolder', ['$window', '$sce', 'templateEditorFactory', 'HTML_TEMPLATE_DOMAIN',
    'HTML_TEMPLATE_URL', 'templateEditorComponentsFactory',
    function ($window, $sce, templateEditorFactory, HTML_TEMPLATE_DOMAIN, HTML_TEMPLATE_URL,
      templateEditorComponentsFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/preview-holder.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;

          var DEFAULT_TEMPLATE_WIDTH = 800;
          var DEFAULT_TEMPLATE_HEIGHT = 600;
          var MOBILE_PREVIEW_HEIGHT = 200;
          var MOBILE_PREVIEW_HEIGHT_SHORT = 140;
          var MOBILE_MARGIN = 10;
          var DESKTOP_MARGIN = 20;
          var PREVIEW_INITIAL_DELAY_MILLIS = 1000;

          var iframeLoaded = false;
          var attributeDataText = null;

          var previewHolder = $window.document.getElementById('preview-holder');
          var iframeParent = $window.document.getElementById('template-editor-preview-parent');
          var iframe = $window.document.getElementById('template-editor-preview');

          iframe.onload = function () {
            iframeLoaded = true;

            _setupComponents();
          };

          $scope.getEditorPreviewUrl = function (productCode) {
            var url = HTML_TEMPLATE_URL.replace('PRODUCT_CODE', productCode);

            return $sce.trustAsResourceUrl(url);
          };

          function _getTemplateWidth() {
            var width = $scope.factory.blueprintData.width;

            return width ? parseInt(width) : DEFAULT_TEMPLATE_WIDTH;
          }

          function _getTemplateHeight() {
            var height = $scope.factory.blueprintData.height;

            return height ? parseInt(height) : DEFAULT_TEMPLATE_HEIGHT;
          }

          function _getHeightDividedByWidth() {
            return _getTemplateHeight() / _getTemplateWidth();
          }

          function _useFullWidth() {
            var offset = 2 * DESKTOP_MARGIN;
            var aspectRatio = _getHeightDividedByWidth();
            var projectedHeight = (previewHolder.clientWidth - offset) * aspectRatio;

            return projectedHeight < previewHolder.clientHeight - offset;
          }

          function _getWidthFor(height) {
            var value = height / _getHeightDividedByWidth();

            return value;
          }

          function _mediaMatches(mediaQuery) {
            return $window.matchMedia(mediaQuery).matches;
          }

          $scope.getMobileWidth = function () {
            var isShort = _mediaMatches('(max-height: 570px)');
            var layerHeight = isShort ? MOBILE_PREVIEW_HEIGHT_SHORT : MOBILE_PREVIEW_HEIGHT;

            var offset = 2 * MOBILE_MARGIN;
            var value = _getWidthFor(layerHeight - offset) + offset;

            return value.toFixed(0);
          };

          $scope.getDesktopWidth = function () {
            var offset = 2 * DESKTOP_MARGIN;
            var height = previewHolder.clientHeight - offset;

            return _getWidthFor(height).toFixed(0);
          };

          $scope.getTemplateAspectRatio = function () {
            var value = _getHeightDividedByWidth() * 100;

            return value.toFixed(4);
          };

          function _getFrameStyle(viewSize, templateSize) {
            var ratio = (viewSize / templateSize).toFixed(4);
            var width = _getTemplateWidth();
            var height = _getTemplateHeight();

            return 'width: ' + width + 'px;' +
              'height: ' + height + 'px;' +
              'transform:scale3d(' + ratio + ',' + ratio + ',' + ratio + ');';
          }

          function _applyAspectRatio() {
            var frameStyle, parentStyle, viewHeight;
            var isMobile = _mediaMatches('(max-width: 768px)');
            var offset = (isMobile ? MOBILE_MARGIN : DESKTOP_MARGIN) * 2;

            if (isMobile) {
              viewHeight = previewHolder.clientHeight - offset;
              parentStyle = 'width: ' + $scope.getMobileWidth() + 'px';
              frameStyle = _getFrameStyle(viewHeight, _getTemplateHeight());
            } else if (_useFullWidth()) {
              var viewWidth = previewHolder.clientWidth - offset;
              var aspectRatio = $scope.getTemplateAspectRatio() + '%';

              parentStyle = 'padding-bottom: ' + aspectRatio + ';';
              frameStyle = _getFrameStyle(viewWidth, _getTemplateWidth());
            } else {
              viewHeight = previewHolder.clientHeight - offset;

              parentStyle = 'height: 100%; width: ' + $scope.getDesktopWidth() + 'px';
              frameStyle = _getFrameStyle(viewHeight, _getTemplateHeight());
            }

            iframeParent.setAttribute('style', parentStyle);
            iframe.setAttribute('style', frameStyle);
          }

          $scope.$watchGroup([
            'factory.blueprintData.width',
            'factory.blueprintData.height'
          ], function () {
            _applyAspectRatio();

            setTimeout(_applyAspectRatio, PREVIEW_INITIAL_DELAY_MILLIS);
          });

          function _onResize() {
            _applyAspectRatio();

            $scope.$digest();
          }

          angular.element($window).on('resize', _onResize);
          $scope.$on('$destroy', function () {
            angular.element($window).off('resize', _onResize);
          });

          $scope.$watch('factory.presentation.templateAttributeData', function (value) {
            attributeDataText = typeof value === 'string' ?
              value : JSON.stringify(value);

            _postAttributeData();
          }, true);

          function _postAttributeData() {
            if (!attributeDataText || !iframeLoaded) {
              return;
            }

            iframe.contentWindow.postMessage(attributeDataText, HTML_TEMPLATE_DOMAIN);

            attributeDataText = null;
          }

          function _setupComponents() {
            var setupData = {
              components: templateEditorComponentsFactory.getSetupData($scope.factory.blueprintData.components)
            };
            iframe.contentWindow.postMessage(JSON.stringify(setupData), HTML_TEMPLATE_DOMAIN);
          }
        }
      };
    }
  ]);
