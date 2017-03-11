'use strict';

angular.module('risevision.storage.controllers')
  .controller('RenameModalCtrl', ['$scope', '$modalInstance', '$rootScope', '$translate', 'storage', 'sourceName',
    function ($scope, $modalInstance, $rootScope, $translate, storage, source) {
      $scope.ok = function () {
        $scope.errorKey = null;

        storage.rename(source.name, $scope.renameName)
          .then(function(resp) {
            console.log("AAAAAA", resp);
            if(resp.code !== 200) {
              $scope.errorKey = resp.message;
            }
            else {
              console.log('Storage rename processed succesfully');
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
    }
  ]);
