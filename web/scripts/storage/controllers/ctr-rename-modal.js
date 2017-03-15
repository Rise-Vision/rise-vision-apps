'use strict';

angular.module('risevision.storage.controllers')
  .controller('RenameModalCtrl', ['$scope', '$modalInstance', 'fileActionsFactory', 'sourceObject',
    function ($scope, $modalInstance, fileActionsFactory, sourceObject) {
      $scope.renameName = sourceObject.name.replace("/", "");
      $scope.isProcessing = false;

      $scope.ok = function () {
        $scope.errorKey = null;
        $scope.isProcessing = true;

        return fileActionsFactory.renameObject(sourceObject, $scope.renameName)
          .then(function(resp) {
            if(resp.code !== 200) {
              $scope.errorKey = resp.message;
            }
            else {
              console.log('Storage rename processed succesfully');
              $modalInstance.close();
            }
          }, function(e) {
            console.log("Error renaming '" + sourceObject.name + "' to '" + $scope.renameName + "'", e);
            $scope.errorKey = "unknown";
          })
          .finally(function() {
            $scope.isProcessing = false;
          });
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.validDestination = function () {
        return $scope.renameName && $scope.renameName.indexOf("/") === -1;
      };
    }
  ]);
