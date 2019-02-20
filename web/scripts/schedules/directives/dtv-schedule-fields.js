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
              templateUrl: 'partials/editor/presentation-selector-modal.html',
              controller: 'PresentationSelectorModal'
            });

            modalInstance.result.then(function (presentationDetails) {
              var playlistItem = playlistFactory.getNewPresentationItem();
              playlistItem.objectReference = presentationDetails[0];
              playlistItem.name = presentationDetails[1];
              playlistItem.presentationType = presentationDetails[2];

              openPlaylistModal(playlistItem);
            });
          };

          $scope.isPreviewAvailable = function () {
            var htmlPresentations = _.filter($scope.schedule.content, function (presentation) {
              return presentationUtils.isHtmlPresentation(presentation);
            });

            return htmlPresentations.length === 0;
          };
        } //link()
      };
    }
  ]);
