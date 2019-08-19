'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorPreviewHolder', ['$window', '$timeout', '$sce', 'userState', 'templateEditorFactory',
    'blueprintFactory', 'brandingFactory', 'HTML_TEMPLATE_DOMAIN', 'HTML_TEMPLATE_URL',
    function ($window, $timeout, $sce, userState, templateEditorFactory, blueprintFactory, brandingFactory,
      HTML_TEMPLATE_DOMAIN, HTML_TEMPLATE_URL) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/preview-holder.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
          $scope.blueprintFactory = blueprintFactory;
          $scope.brandingFactory = brandingFactory;

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

            _postLogoData();
          };

          $scope.getEditorPreviewUrl = function (productCode) {
            var url = HTML_TEMPLATE_URL.replace('PRODUCT_CODE', productCode);

            return $sce.trustAsResourceUrl(url);
          };

          function _getTemplateWidth() {
            var width = blueprintFactory.blueprintData.width;

            return width ? parseInt(width) : DEFAULT_TEMPLATE_WIDTH;
          }

          function _getTemplateHeight() {
            var height = blueprintFactory.blueprintData.height;

            return height ? parseInt(height) : DEFAULT_TEMPLATE_HEIGHT;
          }

          function _getPreviewAreaWidth() {
            return previewHolder.clientWidth;
          }

          function _getPreviewAreaHeight() {
            return previewHolder.clientHeight;
          }

          function _getHeightDividedByWidth() {
            return _getTemplateHeight() / _getTemplateWidth();
          }

          function _useFullWidth() {
            var offset = 2 * DESKTOP_MARGIN;
            var aspectRatio = _getHeightDividedByWidth();
            var projectedHeight = (_getPreviewAreaWidth() - offset) * aspectRatio;

            return projectedHeight < _getPreviewAreaHeight() - offset;
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
            var height = _getPreviewAreaHeight();

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
              viewHeight = _getPreviewAreaHeight() - offset;
              parentStyle = 'width: ' + $scope.getMobileWidth() + 'px';
              frameStyle = _getFrameStyle(viewHeight, _getTemplateHeight());
            } else if (_useFullWidth()) {
              var viewWidth = _getPreviewAreaWidth() - offset;
              var aspectRatio = $scope.getTemplateAspectRatio() + '%';

              parentStyle = 'padding-bottom: ' + aspectRatio + ';';
              frameStyle = _getFrameStyle(viewWidth, _getTemplateWidth());
            } else {
              viewHeight = _getPreviewAreaHeight() - offset;

              parentStyle = 'height: 100%; width: ' + $scope.getDesktopWidth() + 'px';
              frameStyle = _getFrameStyle(viewHeight, _getTemplateHeight());
            }

            iframeParent.setAttribute('style', parentStyle);
            iframe.setAttribute('style', frameStyle);
          }

          $scope.$watchGroup([
            'blueprintFactory.blueprintData.width',
            'blueprintFactory.blueprintData.height'
          ], function () {
            _applyAspectRatio();

            $timeout(_applyAspectRatio, PREVIEW_INITIAL_DELAY_MILLIS);
          });

          function _onResize() {
            _applyAspectRatio();

            $scope.$digest();
          }

          angular.element($window).on('resize', _onResize);
          $scope.$on('$destroy', function () {
            angular.element($window).off('resize', _onResize);
          });

          $scope.$watch('factory.selected', function (selected) {
            if (!selected) {
              $timeout(_onResize);
            }
          });

          $scope.$watch('factory.presentation.templateAttributeData', function (value) {
            _postAttributeData();
          }, true);

          $scope.$watch('brandingFactory.brandingSettings.logoFileMetadata', function (value) {
            _postLogoData();
          }, true);

          $scope.$on('risevision.company.updated', function () {
            // ensure branding factory updates branding via the same handler
            $timeout(function () {
              _postDisplayData();
              _postLogoData();
            });
          });

          $scope.$on('risevision.company.selectedCompanyChanged', function () {
            // ensure branding factory updates branding via the same handler
            $timeout(function () {
              _postDisplayData();
              _postLogoData();
            });
          });

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
                },
                companyBranding: {
                  primaryColor: brandingFactory.brandingSettings.primaryColor,
                  secondaryColor: brandingFactory.brandingSettings.secondaryColor
                }
              }
            };
            _postMessageToTemplate(message);
          }

          function _postLogoData() {
            if (brandingFactory.brandingSettings.logoFileMetadata) {

              var logoComponents = blueprintFactory.getLogoComponents();
              var components = [];
              angular.forEach(logoComponents, function (c) {
                components.push({
                  id: c.id,
                  metadata: brandingFactory.brandingSettings.logoFileMetadata
                });
              });

              var logoAttributeData = {
                type: 'attributeData',
                value: {
                  components: components
                }
              };
              _postMessageToTemplate(logoAttributeData);
            }
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
