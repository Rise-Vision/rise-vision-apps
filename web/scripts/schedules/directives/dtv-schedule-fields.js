'use strict';

angular.module('risevision.schedules.directives')
  .directive('scheduleFields', ['$modal', 'scheduleFactory', 'playlistFactory', 'presentationUtils',
    function ($modal, scheduleFactory, playlistFactory, presentationUtils) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/schedule-fields.html',
        link: function ($scope) {
          $scope.previewUrl = scheduleFactory.getPreviewUrl();

          var openPlaylistModal = function (playlistItem) {
            $modal.open({
              templateUrl: 'partials/schedules/playlist-item.html',
              controller: 'playlistItemModal',
              size: 'md',
              resolve: {
                playlistItem: function () {
                  return playlistItem;
                }
              }
            });
          };

          $scope.addUrlItem = function () {
            openPlaylistModal(playlistFactory.getNewUrlItem());
          };

          $scope.addPresentationItem = function () {
            var modalInstance = $modal.open({
              templateUrl: 'partials/editor/presentation-multi-selector-modal.html',
              controller: 'PresentationMultiSelectorModal'
            });

            modalInstance.result.then(function (presentations) {
              if (presentations && presentations.length === 1) {
                openPlaylistModal(playlistFactory.newPresentationItem(presentations[0]));
              } else {
                playlistFactory.addPresentationItems(presentations);
              }
            });
          };
        } //link()
      };
    }
  ]);
