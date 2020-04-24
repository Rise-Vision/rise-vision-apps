'use strict';

angular.module('risevision.schedules.directives')
  .directive('scheduleFields', ['$modal', 'scheduleFactory', 'playlistFactory', 'presentationUtils', 'ENV_NAME',
    'currentPlanFactory', 'plansFactory',
    function ($modal, scheduleFactory, playlistFactory, presentationUtils, ENV_NAME, currentPlanFactory,
      plansFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/schedule-fields.html',
        link: function ($scope) {
          $scope.previewUrl = scheduleFactory.getPreviewUrl();
          $scope.ENV_NAME = ENV_NAME;

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

          $scope.openSharedScheduleModal = function () {
            if (currentPlanFactory.isPlanActive() || currentPlanFactory.isCancelledActive()) {
              $modal.open({
                templateUrl: 'partials/schedules/shared-schedule-modal.html',
                controller: 'SharedScheduleModalController',
                size: 'md'
              });
            } else {
              plansFactory.showUnlockThisFeatureModal();
            }
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
