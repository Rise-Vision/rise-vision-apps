'use strict';

angular.module('risevision.schedules.controllers')
  .controller('playlistItemModal', ['$scope', '$modal', '$modalInstance', '$loading',
    'playlistFactory', 'playlistItem', 'userState', 'presentationFactory',
    function ($scope, $modal, $modalInstance, $loading, playlistFactory, playlistItem,
      userState, presentationFactory) {
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.playlistItem = angular.copy(playlistItem);
      $scope.isNew = playlistFactory.isNew(playlistItem);
      configurePlayUntilDone();

      $scope.$watch('loadingTemplate', function (loading) {
        if (loading) {
          $loading.start('playlist-item-modal-loader');
        } else {
          $loading.stop('playlist-item-modal-loader');
        }
      });

      $scope.selectPresentation = function () {
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/presentation-selector-modal.html',
          controller: 'PresentationSelectorModal'
        });

        modalInstance.result.then(function (presentationDetails) {
          $scope.playlistItem.objectReference = presentationDetails[0];
          $scope.playlistItem.presentationType = presentationDetails[2];
          configurePlayUntilDone();
        });
      };

      function configurePlayUntilDone() {
        $scope.playUntilDoneSupported = true;
        $scope.loadingTemplate = true;

        presentationFactory.getPresentationCached($scope.playlistItem.objectReference)
          .then(function (presentation) {
            return playlistFactory.initPlayUntilDone($scope.playlistItem, presentation, $scope.isNew);
          })
          .then(function (playUntilDone) {
            $scope.playUntilDoneSupported = playUntilDone;
          })
          .finally(function () {
            $scope.loadingTemplate = false;
          });
      }

      $scope.save = function () {
        angular.copy($scope.playlistItem, playlistItem);

        playlistFactory.updatePlaylistItem(playlistItem);

        $scope.dismiss();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
