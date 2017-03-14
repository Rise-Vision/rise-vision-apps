'use strict';

angular.module('risevision.storage.controllers')
  .controller('RenameModalCtrl', ['$scope', '$modalInstance', '$q', 'storage', 'filesFactory', 'fileSelectorFactory', 'sourceName',
    function ($scope, $modalInstance, $q, storage, filesFactory, fileSelectorFactory, source) {
      $scope.renameName = source.name.replace("/", "");
      $scope.isProcessing = false;

      function isFile(name) {
        return name.lastIndexOf("/") !== name.length - 1;
      }

      function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
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
          return $q.resolve(clone(file));
        }
      }

      $scope.ok = function () {
        var suffix = isFile(source.name) ? "" : "/";
        var renameName = $scope.renameName + suffix;
        var newFile = clone(source);

        $scope.errorKey = null;
        $scope.isProcessing = true;

        return storage.rename(source.name, renameName)
          .then(function(resp) {
            if(resp.code !== 200) {
              $scope.errorKey = resp.message;
              return resp;
            }
            else {
              console.log('Storage rename processed succesfully');
              newFile.name = renameName;

              return loadSingleFile(newFile)
                .then(function(file) {
                  filesFactory.removeFiles([source]);
                  filesFactory.addFile(newFile);
                  fileSelectorFactory.resetSelections();
                }, function(e) {
                  console.log("Error loading after renaming '" + source.name + "' to '" + $scope.renameName + "'", e);
                })
                .finally(function() {
                  $modalInstance.close();
                });
            }
          }, function(e) {
            console.log("Error renaming '" + source.name + "' to '" + $scope.renameName + "'", e);
            $scope.errorKey = "unknown";
          })
          .finally(function() {
            $scope.isProcessing = false;
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
