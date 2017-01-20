'use strict';

angular.module('risevision.schedules.controllers')
  .controller('playlistItemModal', ['$scope', '$modal', '$modalInstance',
    'playlistFactory', 'playlistItem', 'userState',
    function ($scope, $modal, $modalInstance, playlistFactory, playlistItem,
      userState) {
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.playlistItem = angular.copy(playlistItem);
      $scope.isNew = playlistFactory.isNew(playlistItem);

      $scope.$on('picked', function (event, url) {
        $scope.playlistItem.objectReference = url[0];
      });

      $scope.selectPresentation = function () {
        var modalInstance = $modal.open({
          templateUrl: 'presentation-selector/presentation-modal.html',
          controller: 'selectPresentationModal'
        });

        modalInstance.result.then(function (presentationDetails) {
          $scope.playlistItem.objectReference = presentationDetails[0];
        });
      };

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
