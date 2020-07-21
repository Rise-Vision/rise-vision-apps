'use strict';

angular.module('risevision.schedules.directives')
  .directive('scheduleFields', ['$modal', 'playlistFactory', '$sce', 'SHARED_SCHEDULE_URL',
    function ($modal, playlistFactory, $sce, SHARED_SCHEDULE_URL) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/schedule-fields.html',
        link: function ($scope) {
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

          $scope.getEmbedUrl = function () {
            if (!$scope.schedule) {
              return null;
            }
            var url = SHARED_SCHEDULE_URL.replace('SCHEDULE_ID', $scope.schedule.id) + '&env=apps_schedule';
            return $sce.trustAsResourceUrl(url);
          };
        } //link()
      };
    }
  ]);
