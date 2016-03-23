'use strict';
angular.module('risevision.storage.services')
  .factory('filesFactory', ['storage', 'storageFactory',
    function (storage, storageFactory) {
      var svc = {
        startTrial: storage.startTrial
      };

      svc.filesDetails = {
        files: []
      };

      svc.statusDetails = {
        code: 202
      };

      svc.addFile = function (newFile) {
        var currentFolder = storageFactory.folderPath ? storageFactory.folderPath :
          '';
        var idx = newFile.name.indexOf('/', currentFolder.length);
        // Handles the case where a file inside a folder was added (since files are not visible, only adds the folder)
        var fileName = idx >= 0 ? newFile.name.substring(0, idx + 1) :
          newFile.name;
        var existingFileNameIndex;

        for (var i = 0, j = svc.filesDetails.files.length; i < j; i += 1) {
          if (svc.filesDetails.files[i].name === fileName) {
            existingFileNameIndex = i;
            break;
          }
        }

        if (idx >= 0) {
          if (!existingFileNameIndex) {
            svc.filesDetails.files.push({
              name: fileName
            });
          }
        } else if (existingFileNameIndex) {
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
          var parentFolder = decodeURIComponent(storageFactory.folderPath);
          var parentFolderFound = false;

          resp.files = resp.files || [];
          resp.empty = resp.files.length === 0;

          for (var i = 0; i < resp.files.length; i++) {
            var file = resp.files[i];

            if (file.name === parentFolder) {
              parentFolderFound = true;
              file.currentFolder = true;
              delete file.size;
              delete file.updated;
              break;
            }
          }

          if (!parentFolderFound && storageFactory.folderPath) {
            resp.files.unshift({
              name: parentFolder,
              currentFolder: true,
              size: '',
              updated: null
            });
          }

          svc.filesDetails.bucketExists = resp.bucketExists;
          svc.filesDetails.files = resp.files || [];
          svc.statusDetails.code = resp.code;

          if (storageFactory.isSingleFolderSelector()) {
            svc.filesDetails.files = svc.filesDetails.files.filter(
              storageFactory.fileIsFolder);
          }

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
          params.folderPath = decodeURIComponent(storageFactory.folderPath);
          svc.statusDetails.folder = params.folderPath;
        } else {
          params.folderPath = undefined;
          svc.statusDetails.folder = '/';
        }

        svc.statusDetails.code = 202;

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
