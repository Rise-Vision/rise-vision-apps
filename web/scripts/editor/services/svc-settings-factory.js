'use strict';

angular.module('risevision.editor.services')
  .factory('settingsFactory', ['$modal', 'widgetModalFactory',
    'placeholderPlaylistFactory',
    function ($modal, widgetModalFactory, placeholderPlaylistFactory) {
      var factory = {};

      var _showPresentationSettingsModal = function (item) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/presentation-item-settings.html',
          controller: 'PresentationItemModalController',
          size: 'lg',
          backdrop: true,
          resolve: {
            item: function () {
              return item;
            }
          }
        });

        return modalInstance.result;
      };

      factory.showSettingsModal = function (item, softUpdate) {
        var deferred;

        if (item && item.type === 'widget') {
          deferred = widgetModalFactory.showSettingsModal(item);
        } else if (item && item.type === 'presentation') {
          deferred = _showPresentationSettingsModal(item);
        }

        if (!deferred) {
          return;
        }

        deferred.then(function () {
          if (!softUpdate) {
            placeholderPlaylistFactory.updateItem(item);
          }
        });

      };

      return factory;
    }
  ]);
