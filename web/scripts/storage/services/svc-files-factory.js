'use strict';
angular.module('risevision.storage.services')
  .factory('filesFactory', ['storage', 'storageFactory',
    function (storage, storageFactory) {
      var svc = {
        startTrial: storage.startTrial,
        filesDetails: {
          files: [],
          code: 202
        }
      };

      svc.addFile = function (newFile) {
        var currentFolder = storageFactory.folderPath ? storageFactory.folderPath :
          '';
        var idx = newFile.name.indexOf('/', currentFolder.length);
        // Handles the case where a file inside a folder was added (since files are not visible, only adds the folder)
        var fileName = idx >= 0 ? newFile.name.substring(0, idx + 1) :
          newFile.name;
        var existingFileNameIndex = -1;

        for (var i = 0, j = svc.filesDetails.files.length; i < j; i += 1) {
          if (svc.filesDetails.files[i].name === fileName) {
            existingFileNameIndex = i;
            break;
          }
        }

        if (idx >= 0) {
          if (existingFileNameIndex === -1) {
            svc.filesDetails.files.push({
              name: fileName,
              kind: 'folder'
            });
          }
        } else if (existingFileNameIndex !== -1) {
          svc.filesDetails.files.splice(existingFileNameIndex, 1, newFile);
        } else {
          svc.filesDetails.files.push(newFile);
        }

        // Needed because file upload does not refresh the list with a server call
        svc.filesDetails.bucketExists = true;
      };

      svc.getFileNameIndex = function (fileName) {
        for (var i = 0; i < svc.filesDetails.files.length; i++) {
          if (svc.filesDetails.files[i].name === fileName) {
            return i;
          }
        }
        return -1;
      };

      svc.removeFiles = function (files) {
        var oldFiles = svc.filesDetails.files;

        for (var i = oldFiles.length - 1; i >= 0; i--) {
          if (files.indexOf(oldFiles[i]) >= 0) {
            oldFiles.splice(i, 1);
          }
        }
      };

      svc.refreshFilesList = function () {
        function processFilesResponse(resp) {
          var TRASH = '--TRASH--/';
          var parentFolder = storageFactory.folderPath;
          var parentFolderIndex = null;

          resp.files = resp.files || [];

          for (var i = 0; i < resp.files.length; i++) {
            var file = resp.files[i];

            if (file.name === parentFolder) {
              parentFolderIndex = i;
              break;
            }
          }
          if (parentFolderIndex !== null) {
            resp.files.splice(parentFolderIndex, 1);
          }

          svc.filesDetails.bucketExists = resp.bucketExists;
          svc.filesDetails.files = resp.files || [];
          svc.filesDetails.code = resp.code;

          if (!storageFactory.folderPath || !parentFolder || parentFolder ===
            '/') {
            // [AD] There may be a reason why the trash folder is added in 
            // the second position; from legacy Storage
            svc.filesDetails.files.splice(1, 0, {
              name: TRASH,
              size: '',
              updated: null
            });
          }

          return resp;
        }

        var params = {};
        if (storageFactory.folderPath) {
          params.folderPath = storageFactory.folderPath;
        } else {
          params.folderPath = undefined;
        }

        svc.filesDetails.code = 202;
        svc.loadingItems = true;

        return storage.files.get(params)
          .then(function (resp) {
            return processFilesResponse(resp);
          }, function () {
            // TODO: show error message
          })
          .finally(function () {
            svc.loadingItems = false;
          });
      };

      return svc;
    }
  ]);
