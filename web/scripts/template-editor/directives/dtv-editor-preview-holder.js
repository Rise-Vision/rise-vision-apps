'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorPreviewHolder', ['$window', '$sce', 'templateEditorFactory', 'HTML_TEMPLATE_DOMAIN',
    'HTML_TEMPLATE_URL', 'userState',
    function ($window, $sce, templateEditorFactory, HTML_TEMPLATE_DOMAIN, HTML_TEMPLATE_URL, userState) {
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

          var previewHolder = $window.document.getElementById('preview-holder');
          var iframeParent = $window.document.getElementById('template-editor-preview-parent');
          var iframe = $window.document.getElementById('template-editor-preview');

          iframe.onload = function () {
            iframeLoaded = true;

            _postAttributeData();

            _postStartEvent();

            _postDisplayData();
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

            var value = _getWidthFor(layerHeight);

            return value.toFixed(0);
          };

          $scope.getDesktopWidth = function () {
            var height = previewHolder.clientHeight;

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
            _postAttributeData();
          }, true);

          function _postAttributeData() {
            var message = {
              type: 'attributeData',
              value: $scope.factory.presentation.templateAttributeData
            };
            _postMessageToTemplate(message);
          }

          function _postStartEvent() {
            _postMessageToTemplate({
              type: 'sendStartEvent'
            });
          }

          function _postDisplayData() {
            var company = userState.getCopyOfSelectedCompany(true);
            var message = {
              type: 'displayData',
              value: {
                displayAddress: {
                  city: company.city,
                  province: company.province,
                  country: company.country,
                  postalCode: company.postalCode
                }
              }
            };
            _postMessageToTemplate(message);
          }

          function _postMessageToTemplate(message) {
            if (!iframeLoaded) {
              return;
            }
            iframe.contentWindow.postMessage(JSON.stringify(message), HTML_TEMPLATE_DOMAIN);
          }
        }
      };
    }
  ]);
