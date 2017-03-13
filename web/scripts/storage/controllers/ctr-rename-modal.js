'use strict';

angular.module('risevision.storage.controllers')
  .controller('RenameModalCtrl', ['$scope', '$modalInstance', '$rootScope', '$translate', 'storage', 'filesFactory', 'sourceName',
    function ($scope, $modalInstance, $rootScope, $translate, storage, filesFactory, source) {
      $scope.renameName = source.name.replace("/", "");

      $scope.ok = function () {
        var suffix = source.name.endsWith("/") ? "/" : "";
        var renameName = $scope.renameName + suffix;
        var newFile = JSON.parse(JSON.stringify(source));

        $scope.errorKey = null;

        storage.rename(source.name, renameName)
          .then(function(resp) {
            if(resp.code !== 200) {
              $scope.errorKey = resp.message;
            }
            else {
              console.log('Storage rename processed succesfully');

              newFile.name = renameName;
              filesFactory.addFile(newFile);
              filesFactory.removeFiles([source]);
              $modalInstance.close();
            }
          }, function(e) {
            console.log("Error renaming '" + sourceName + "' to '" + $scope.renameName + "'");
            $scope.errorKey = "unknown";
          });
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
      $scope.validDestination = function () {
        return $scope.renameName && $scope.renameName.indexOf("/") === -1;
      };
    }
  ]);
