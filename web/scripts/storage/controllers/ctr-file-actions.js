'use strict';

angular.module('risevision.storage.controllers')
  .controller('FileActionsController', ['$scope', 'fileActionsFactory',
    'filesFactory', 'storageFactory', '$window', '$translate',
    function ($scope, fileActionsFactory, filesFactory, storageFactory,
      $window, $translate) {
      $scope.factory = fileActionsFactory;
      $scope.storageFactory = storageFactory;

      $scope.filesDetails = filesFactory.filesDetails;
      $scope.fileListStatus = filesFactory.statusDetails;
      $scope.leavePageMessage = '';

      $translate('storage-client.pending-ops-leave-page').then(function (
        value) {
        $scope.leavePageMessage = value;
      });

      $window.addEventListener('beforeunload', function (e) {
        if (fileActionsFactory.getActivePendingOperations().length > 0) {
          (e || window.event).returnValue = $scope.leavePageMessage;
          return $scope.leavePageMessage;
        }
      });

      $scope.isDisabledCopyUrlButton = function () {
        return storageFactory.isTrashFolder() ||
          filesFactory.filesDetails.checkedItemsCount !== 1;
      };

      $scope.isDisabledDownloadButton = $scope.isDisabledTrashButton =
        $scope.isDisabledRestoreButton = $scope.isDisabledDeleteButton =
        function () {
          return filesFactory.filesDetails.checkedItemsCount < 1;
        };
    }
  ]);
