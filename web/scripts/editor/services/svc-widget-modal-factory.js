'use strict';

angular.module('risevision.editor.services')
  .value('WIDGET_PARAMS',
    'up_id=iframeId&parent=parentUrl&up_rsW=width&up_rsH=height&up_companyId=cid'
  )
  .factory('widgetModalFactory', ['placeholderFactory',
    'placeholderPlaylistFactory', 'gadgetFactory', 'userState', '$q',
    '$modal', '$location', '$sce', '$log', 'WIDGET_PARAMS', 'widgetUtils',
    function (placeholderFactory, placeholderPlaylistFactory,
      gadgetFactory, userState, $q, $modal, $location, $sce, $log,
      WIDGET_PARAMS, widgetUtils) {
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

      var _getSettingsUrl = function (widgetUrl, url) {
        var params = _getUrlParams(widgetUrl);
        var rpcParams = WIDGET_PARAMS
          .replace('cid', userState.getSelectedCompanyId())
          .replace('width', placeholderFactory.placeholder.width)
          .replace('height', placeholderFactory.placeholder.height)
          .replace('iframeId', 'widget-modal-frame')
          .replace('parentUrl', encodeURIComponent($location.$$absUrl));

        url = url
          .replace('http://', '//')
          .replace('https://', '//');

        url += params;
        url += url.indexOf('?') !== -1 || url.indexOf('&') !== -1 ?
          '&' : '?';
        url += rpcParams;

        return $sce.trustAsResourceUrl(url);
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

      factory.showWidgetModal = function (item, softUpdate) {
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
                  url: _getSettingsUrl(item.objectData,
                    item.settingsUrl),
                  additionalParams: item.additionalParams
                });
              } else {
                gadgetFactory.getGadget(item.objectReference)
                  .then(function (gadget) {
                    if (!item.objectData) {
                      item.objectData = gadget.url;
                    }

                    deferred.resolve({
                      url: _getSettingsUrl(item.objectData,
                        gadget.uiUrl),
                      additionalParams: item.additionalParams
                    });
                  });
              }
              return deferred.promise;
            }
          }
        });

        modalInstance.result.then(function (widgetData) {
          if (widgetData) {
            _updateItemObjectData(item, widgetData.params);

            _updateItemName(item, widgetData);

            item.additionalParams = widgetData.additionalParams;

            if (!softUpdate) {
              placeholderPlaylistFactory.updateItem(item);
            }
          }

          console.info('Widget saved:', widgetData);

        }, function () {
          // for unit test purposes
          factory.canceled = true;
        });

      };

      return factory;
    }
  ]);
