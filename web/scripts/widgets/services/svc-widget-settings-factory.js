'use strict';

angular.module('risevision.widgets.services')
  .factory('widgetSettingsFactory', ['placeholderFactory',
    'placeholderPlaylistFactory', 'gadgetFactory', 'userState', '$q',
    '$modal', '$location', '$sce', '$log', 'widgetUtils',
    function (placeholderFactory, placeholderPlaylistFactory,
      gadgetFactory, userState, $q, $modal, $location, $sce, $log, 
      widgetUtils) {
      var factory = {};

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

      factory.showSettingsModal = function (item, softUpdate) {
        if (!item || !item.objectReference && !item.settingsUrl) {
          return;
        }

        var modalInstance = $modal.open({
          windowTemplateUrl: 'partials/editor/simple-modal.html',
          templateUrl: 'partials/widgets/image-settings.html',
          controller: 'widgetSettingsModal',
          size: 'lg',
          backdrop: true,
          resolve: {
            widget: function () {
              return {
                params: item.objectData,
                additionalParams: item.additionalParams
              };
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
