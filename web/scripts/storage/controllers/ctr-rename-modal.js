'use strict';

angular.module('risevision.storage.controllers')
  .controller('RenameModalCtrl', ['$scope', '$modalInstance', '$rootScope', '$translate', '$q', 'storage', 'filesFactory', 'sourceName',
    function ($scope, $modalInstance, $rootScope, $translate, $q, storage, filesFactory, source) {
      $scope.renameName = source.name.replace("/", "");

      function isFile(name) {
        return name.endsWith("/");
      }

      function loadSingleFile(file) {
        if(isFile(file.name)) {
          return storage.files.get({
            file: file.name
          })
          .then(function (resp) {
            return resp && resp.files && resp.files[0] ? resp.files[0] : file;
          });
        }
        else {
          return $q.resolve(file);
        }
      }

      $scope.ok = function () {
        var suffix = isFile(source.name) ? "/" : "";
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

              loadSingleFile(newFile)
                .then(function(file) {
                  filesFactory.addFile(newFile);
                  filesFactory.removeFiles([source]);
                  $modalInstance.close();
                }, function(e) {
                  console.log("Error loading files after renaming '" + sourceName + "' to '" + $scope.renameName + "'", e);
                });
            }
          }, function(e) {
            console.log("Error renaming '" + sourceName + "' to '" + $scope.renameName + "'", e);
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
