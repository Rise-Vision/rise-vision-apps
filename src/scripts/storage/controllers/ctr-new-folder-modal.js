'use strict';

angular.module('risevision.storage.controllers')
  .controller('NewFolderModalCtrl', ['$scope', '$modalInstance',
    'filesFactory', 'storage', '$rootScope', '$translate',
    function ($scope, $modalInstance, filesFactory, storage,
      $rootScope, $translate) {
      $scope.duplicateFolderSpecified = false;
      $scope.accessDenied = false;
      $scope.serverError = false;
      $scope.waitingForResponse = false;

      $scope.ok = function () {
        var requestParams;
        if (!$scope.folderName) {
          $scope.folderName = '';
        }
        $scope.folderName = $scope.folderName.replace(/\//g, '');
        if (filesFactory.getFileNameIndex($scope.folderName + '/') > -1) {
          $scope.duplicateFolderSpecified = true;
          return;
        }
        if ($scope.folderName !== '') {
          $scope.waitingForResponse = true;

          storage.createFolder(filesFactory.folderPath + $scope.folderName)
            .then(function (resp) {

              if (resp.code === 200) {
                $rootScope.$emit('refreshSubscriptionStatus',
                  'trial-available');
                filesFactory.refreshFilesList();
                $modalInstance.close($scope.folderName);

              } else if (resp.code === 403 && resp.message.indexOf(
                  'restricted-role') === -1) {
                $translate('storage-client.error.' + resp.message, {
                  username: resp.userEmail
                }).then(function (msg) {
                  $scope.accessDenied = true;
                  $scope.accessDeniedMessage = msg;
                });
              } else if (resp.code === 403) {
                $scope.accessDenied = true;
              } else {
                $scope.respCode = resp.code;
                $scope.accessDenied = true;
              }

            }).finally(function () {
              $scope.waitingForResponse = false;
            });
        }
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ]);
