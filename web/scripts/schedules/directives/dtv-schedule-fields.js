'use strict';

angular.module('risevision.schedules.directives')
  .directive('scheduleFields', ['$modal', 'scheduleFactory', 'playlistFactory',
    function ($modal, scheduleFactory, playlistFactory) {
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
                templateUrl: 'presentation-selector/presentation-modal.html',
                controller: 'selectPresentationModal',
                resolve: {
                  playlistItem: playlistFactory.getNewPresentationItem
                }
              });

              modalInstance.result.then(function (presentationDetails) {
                var playlistItem = playlistFactory.getNewPresentationItem();
                playlistItem.objectReference = presentationDetails[0];
                playlistItem.name = presentationDetails[1];

                openPlaylistModal(playlistItem);
              });
            };

          } //link()
      };
    }
  ]);
