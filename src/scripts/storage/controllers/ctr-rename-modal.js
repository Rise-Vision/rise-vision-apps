'use strict';

angular.module('risevision.storage.controllers')
  .controller('RenameModalCtrl', ['$scope', '$log', '$modalInstance',
    'fileActionsFactory', 'storageUtils', 'sourceObject',
    function ($scope, $log, $modalInstance, fileActionsFactory, storageUtils,
      sourceObject) {
      $scope.parentPath = storageUtils.fileParent(sourceObject);
      $scope.renameName = storageUtils.fileName(sourceObject).replace('/', '');
      $scope.isProcessing = false;

      $scope.ok = function () {
        $scope.errorKey = null;
        $scope.isProcessing = true;

        return fileActionsFactory.renameObject(sourceObject, $scope.parentPath +
            $scope.renameName)
          .then(function (resp) {
            $log.debug('Storage rename processed succesfully');

            $modalInstance.close();
          }, function (e) {
            $log.error('Error renaming \'' + sourceObject.name + '\' to \'' +
              $scope.renameName + '\'', e);

            $scope.errorKey = (e && e.result && e.result.error && e.result.error.message) || 'unknown';
          })
          .finally(function () {
            $scope.isProcessing = false;
          });
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.validDestination = function () {
        return $scope.renameName && $scope.renameName.indexOf('/') === -1;
      };
    }
  ]);
