'use strict';

angular.module('risevision.schedules.controllers')
  .controller('playlistItemModal', ['$scope', '$modal', '$modalInstance',
    'playlistFactory', 'playlistItem', 'userState', 'presentation', 'template', 'HTML_PRESENTATION_TYPE',
    function ($scope, $modal, $modalInstance, playlistFactory, playlistItem,
      userState, presentation, template, HTML_PRESENTATION_TYPE) {
      $scope.companyId = userState.getSelectedCompanyId();
      $scope.playlistItem = angular.copy(playlistItem);
      $scope.isNew = playlistFactory.isNew(playlistItem);
      configurePlayUntilDone();

      $scope.$on('picked', function (event, url) {
        $scope.playlistItem.objectReference = url[0];
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

          //start spinner

          presentation.get($scope.playlistItem.objectReference).then(function (result) {

              return template.loadBlueprintData(result.item.productCode);
            })
            .then(function (result) {

              if (result.data && !result.data.playUntilDone) {
                $scope.playUntilDoneSupported = false;
                $scope.playlistItem.playUntilDone = false;
              }
            })
            .finally(function () {
              //stop spinner
            });

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
