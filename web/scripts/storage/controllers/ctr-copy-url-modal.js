'use strict';

angular.module('risevision.storage.controllers')
  .controller('CopyUrlModalController', ['$scope', 'storageFactory',
    '$modalInstance', '$timeout', 'STORAGE_FILE_URL', 'copyFile',
    function ($scope, storageFactory, $modalInstance, $timeout,
      STORAGE_FILE_URL, copyFile) {
      $scope.copyFile = copyFile;

      var _encodeURIKeepForwardSlash = function (uri) {
        return encodeURIComponent(uri).split('%2F').join('/');
      };

      $scope.copyUrl = copyFile.kind === 'folder' ?
        storageFactory.getFolderSelfLinkUrl() +
        _encodeURIKeepForwardSlash(copyFile.name) :
        STORAGE_FILE_URL + storageFactory.getBucketName() + '/' +
        _encodeURIKeepForwardSlash(copyFile.name);

      $timeout(function () {
        angular.element('#copyUrlInput').focus(function () {
          angular.element(this).select();
        });
        angular.element('#copyUrlInput').focus();
      }, 0);

      $scope.cancel = function () {
        $modalInstance.close();
      };
    }
  ]);
