'use strict';

angular.module('risevision.editor.services')
  .value('RPC_PARAMS', 'up_id=iframeId&parent=parentUrl&')
  .value('WIDGET_PARAMS', 'up_rsW=width&up_rsH=height&up_companyId=cid')
  .factory('widgetModalFactory', ['$q', '$log', '$modal', '$location', '$sce',
    'placeholderFactory', 'gadgetFactory', 'userState', 'widgetUtils',
    'WIDGET_PARAMS', 'RPC_PARAMS',
    function ($q, $log, $modal, $location, $sce, placeholderFactory,
      gadgetFactory, userState, widgetUtils, WIDGET_PARAMS, RPC_PARAMS) {
      var factory = {};

      var _getUrlParams = function (widgetUrl) {
        var res = '';
        var queryParamsStartPos = widgetUrl.indexOf('?');
        if (queryParamsStartPos === -1) {
          queryParamsStartPos = widgetUrl.indexOf('&');
        }

        if (queryParamsStartPos > 0) {
          res = widgetUrl.substring(queryParamsStartPos);
        }

        return res;
      };

      var _getWidgetParams = function () {
        return WIDGET_PARAMS
          .replace('cid', userState.getSelectedCompanyId())
          .replace('width', placeholderFactory.placeholder.width)
          .replace('height', placeholderFactory.placeholder.height);
      };

      var _getRpcParams = function () {
        return RPC_PARAMS
          .replace('iframeId', 'widget-modal-frame')
          .replace('parentUrl', encodeURIComponent($location.$$absUrl));
      };

      var _getIFrameUrl = function (widgetUrl, url) {
        var params = _getUrlParams(widgetUrl);
        url = url
          .replace('http://', '//')
          .replace('https://', '//');

        url += params;
        url += url.indexOf('?') !== -1 || url.indexOf('&') !== -1 ?
          '&' : '?';
        url += _getRpcParams();
        url += _getWidgetParams();

        return $sce.trustAsResourceUrl(url);
      };

      var _showWidgetIFrameModal = function (item) {
        if (!item || !item.objectReference && !item.settingsUrl) {
          return;
        }

        var modalInstance = $modal.open({
          windowTemplateUrl: 'partials/editor/simple-modal.html',
          templateUrl: 'partials/editor/widget-modal.html',
          controller: 'widgetModal',
          size: 'lg',
          backdrop: true,
          resolve: {
            widget: function () {
              var deferred = $q.defer();

              if (item.settingsUrl) {
                deferred.resolve({
                  url: _getIFrameUrl(item.objectData,
                    item.settingsUrl),
                  additionalParams: item.additionalParams
                });
              } else {
                gadgetFactory.getGadgetById(item.objectReference)
                  .then(function (gadget) {
                    if (!item.objectData) {
                      item.objectData = gadget.url;
                    }

                    deferred.resolve({
                      url: _getIFrameUrl(item.objectData,
                        gadget.uiUrl),
                      additionalParams: item.additionalParams
                    });
                  });
              }
              return deferred.promise;
            }
          }
        });

        return modalInstance.result;
      };

      var _getSettingsParams = function (widgetUrl) {
        var params = _getUrlParams(widgetUrl);

        params += params ? '&' : '';
        params += _getWidgetParams();

        return params;
      };

      var _showWidgetSettingsModal = function (item) {
        var inAppDetails = widgetUtils.getInAppSettings(item.objectReference);
        var modalInstance = $modal.open({
          templateUrl: inAppDetails.partial,
          controller: 'WidgetSettingsModalController',
          size: 'lg',
          backdrop: true,
          resolve: {
            widget: function () {
              return {
                type: inAppDetails.type,
                params: _getSettingsParams(item.objectData),
                additionalParams: item.additionalParams
              };
            }
          }
        });

        return modalInstance.result;
      };

      var _getWidgetHtmlUrl = function (url) {
        var res = '';

        if (url) {
          var queryParamsStartPos = url.indexOf('?');

          if (queryParamsStartPos > 0) {
            res = url.substring(0, queryParamsStartPos);
          } else if (queryParamsStartPos === -1 && url.indexOf('&') === -1) {
            res = url;
          }
          // if queryParamsStartPos is 0, return blank url
        }

        return res;
      };

      var _updateItemObjectData = function (item, params) {
        if (params && item.objectData) {
          if (_getWidgetHtmlUrl(params)) {
            item.objectData = params;
            return;
          }

          item.objectData = item.objectData.split(/[?#]/)[0];
          if (params.charAt(0) === '&') {
            params = params.replace('&', '?');
          }
          if (params.charAt(0) !== '?') {
            params = '?' + params;
          }
          item.objectData += params;
        }
      };

      var _updateItemName = function (item, widgetData) {
        if (item.objectReference === widgetUtils.getWidgetId('image') ||
          item.objectReference === widgetUtils.getWidgetId('video')) {
          try {
            var oldAdditionalParams = JSON.parse(item.additionalParams);
            var newAdditionalParams = JSON.parse(widgetData.additionalParams);
            var oldFilename = widgetUtils.getFileName(oldAdditionalParams.selector
              .storageName);
            var newFilename = widgetUtils.getFileName(newAdditionalParams.selector
              .storageName);
            if (item.name === oldFilename && newFilename !== '') {
              item.name = newFilename;
            }
          } catch (err) {
            $log.debug('Error updating item name:', item.name);
          }
        }
      };

      factory.showSettingsModal = function (item) {
        var deferred = $q.reject('Invalid Playlist Item');

        if (item && widgetUtils.getInAppSettings(item.objectReference)) {
          deferred = _showWidgetSettingsModal(item);
        } else if (item && item.type === 'widget') {
          deferred = _showWidgetIFrameModal(item);
        }

        return deferred.then(function (widgetData) {
          if (widgetData) {
            _updateItemObjectData(item, widgetData.params);

            _updateItemName(item, widgetData);

            item.additionalParams = widgetData.additionalParams;

            console.info('Widget saved:', widgetData);
          }
        });

      };


      return factory;
    }
  ]);
