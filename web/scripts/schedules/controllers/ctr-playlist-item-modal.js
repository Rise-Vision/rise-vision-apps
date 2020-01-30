'use strict';

angular.module('risevision.schedules.controllers')
  .controller('playlistItemModal', ['$scope', '$modal', '$modalInstance', '$loading',
    'playlistFactory', 'playlistItem', 'userState', 'presentation', 'blueprintFactory', 'HTML_PRESENTATION_TYPE',
    function ($scope, $modal, $modalInstance, $loading, playlistFactory, playlistItem,
      userState, presentation, blueprintFactory, HTML_PRESENTATION_TYPE) {
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

        if ($scope.playlistItem.presentationType === HTML_PRESENTATION_TYPE) {

          $scope.loadingTemplate = true;

          presentation.get($scope.playlistItem.objectReference).then(function (result) {

              return blueprintFactory.isPlayUntilDone(result.item.productCode);
            })
            .then(function (playUntilDone) {
              if (playUntilDone && $scope.isNew) {
                //When user schedules a PUD template, then set schedule item to PUD by default.
                $scope.playlistItem.playUntilDone = true;
              }
              if (!playUntilDone) {
                $scope.playUntilDoneSupported = false;
                $scope.playlistItem.playUntilDone = false;
              }
            })
            .catch(function () {
              $scope.playUntilDoneSupported = false;
              $scope.playlistItem.playUntilDone = false;
            })
            .finally(function () {
              $scope.loadingTemplate = false;
            });

        } else {
          $scope.loadingTemplate = false;
        }
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
