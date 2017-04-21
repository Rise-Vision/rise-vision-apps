'use strict';

angular.module('risevision.editor.services')
  .factory('presentationItemFactory', ['placeholderPlaylistFactory', '$modal',
    function (placeholderPlaylistFactory, $modal) {
      var factory = {};

      factory.showSettingsModal = function (item, softUpdate) {
        if (!item || item.type !== 'presentation') {
          return;
        }

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

        modalInstance.result.then(function () {
          if (!softUpdate) {
            placeholderPlaylistFactory.updateItem(item);
          }
        });

      };

      return factory;
    }
  ]);
