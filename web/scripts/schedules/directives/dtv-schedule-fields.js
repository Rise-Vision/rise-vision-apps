'use strict';

angular.module('risevision.schedules.directives')
  .directive('scheduleFields', ['$modal', 'scheduleFactory', 'playlistFactory', 'playerLicenseFactory', '$sce',
    'SHARED_SCHEDULE_URL',
    function ($modal, scheduleFactory, playlistFactory, playerLicenseFactory, $sce, SHARED_SCHEDULE_URL) {
      return {
        restrict: 'E',
        templateUrl: 'partials/schedules/schedule-fields.html',
        link: function ($scope) {
          var originalChangeDate = scheduleFactory.schedule.changeDate;
          $scope.applyTimeline = false;
          $scope.tooltipKey = 'ShareEnterpriseTooltip';
          $scope.freeDisplays = [];
          $scope.factory = scheduleFactory;
          $scope.playerLicenseFactory = playerLicenseFactory;

          $scope.$watchGroup(['factory.schedule.distribution', 'factory.schedule.distributeToAll', function() {
            return scheduleFactory.requiresLicense();
          }], function () {
            playerLicenseFactory.apiError = '';

            scheduleFactory.checkFreeDisplays()
              .then(function (result) {
                $scope.freeDisplays = result;
              });
          });

          $scope.licenseFreeDisplays = function () {
            playerLicenseFactory.confirmAndLicense($scope.freeDisplays).then(function () {
              $scope.freeDisplays = [];
            });
          };

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
            if (!scheduleFactory.schedule) {
              return null;
            }
            var url = SHARED_SCHEDULE_URL.replace('SCHEDULE_ID', scheduleFactory.schedule.id) +
              '&env=apps_schedule';

            if (!$scope.applyTimeline) {
              url += '&applyTimeline=false';
            }

            if (originalChangeDate !== scheduleFactory.schedule.changeDate) {
              url += '&dataSource=core&changeDate=' + scheduleFactory.schedule.changeDate;
            }

            return $sce.trustAsResourceUrl(url);
          };

        } //link()
      };
    }
  ]);
