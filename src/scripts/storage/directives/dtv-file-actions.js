(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .directive('fileActions', ['$window', '$translate', 'FileActionsFactory',
      'pendingOperationsFactory',
      function ($window, $translate, FileActionsFactory,
        pendingOperationsFactory) {
        return {
          restrict: 'E',
          scope: {
            filesFactory: '='
          },
          templateUrl: 'partials/storage/file-actions.html',
          link: function ($scope) {
            $scope.factory = new FileActionsFactory($scope.filesFactory);

            $scope.filesDetails = $scope.filesFactory.filesDetails;
            $scope.fileListStatus = $scope.filesFactory.statusDetails;
            $scope.leavePageMessage = '';

            $translate('storage-client.pending-operation.leave-page').then(
              function (value) {
                $scope.leavePageMessage = value;
              });

            $window.addEventListener('beforeunload', function (e) {
              if (pendingOperationsFactory.getActivePendingOperations()
                .length > 0) {
                (e || window.event).returnValue = $scope.leavePageMessage;
                return $scope.leavePageMessage;
              }
            });

            $scope.isDisabledCopyUrlButton = $scope.isDisabledRenameButton =
              function () {
                return $scope.filesFactory.isTrashFolder() ||
                  $scope.filesDetails.checkedItemsCount !== 1;
              };

            $scope.isDisabledDownloadButton = $scope.isDisabledTrashButton =
              $scope.isDisabledRestoreButton = $scope.isDisabledDeleteButton =
              $scope.isDisabledDuplicateButton = $scope.isDisabledMoveButton =
              function () {
                return $scope.filesDetails.checkedItemsCount < 1;
              };
          }
        };
      }
    ]);
})();
