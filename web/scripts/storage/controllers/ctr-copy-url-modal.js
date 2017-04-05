'use strict';

angular.module('risevision.storage.controllers')
  .controller('CopyUrlModalController', ['$scope', 'storageUtils',
    '$modalInstance', '$timeout', 'STORAGE_FILE_URL', 'copyFile',
    function ($scope, storageUtils, $modalInstance, $timeout,
      STORAGE_FILE_URL, copyFile) {
      $scope.copyFile = copyFile;

      var _encodeURIKeepForwardSlash = function (uri) {
        return encodeURIComponent(uri).split('%2F').join('/');
      };

      $scope.copyUrl = copyFile.kind === 'folder' ?
        storageUtils.getFolderSelfLinkUrl() +
        _encodeURIKeepForwardSlash(copyFile.name) :
        STORAGE_FILE_URL + storageUtils.getBucketName() + '/' +
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
