'use strict';
angular.module('risevision.storage.services')
  .factory('FilesFactory', ['$rootScope', 'storage', 'storageUtils', 'pendingOperationsFactory',
    'filterFilter', 'currentPlanFactory', 'processErrorCode',
    function ($rootScope, storage, storageUtils, pendingOperationsFactory,
      filterFilter, currentPlanFactory, processErrorCode) {
      return function (storageFactory) {

        // filesFactory functionality ~~~~~~~~~~

        var factory = {
          startTrial: currentPlanFactory.showPurchaseOptions,
          filesDetails: {
            files: [],
            code: 202
          },
          excludedFiles: [],
          folderPath: ''
        };

        factory.addFile = function (newFile) {
          var currentFolder = factory.folderPath ? factory.folderPath :
            '';
          var idx = newFile.name.indexOf('/', currentFolder.length);
          // Handles the case where a file inside a folder was added (since files are not visible, only adds the folder)
          var fileName = idx >= 0 ? newFile.name.substring(0, idx + 1) :
            newFile.name;
          var existingFileNameIndex = -1;

          for (var i = 0, j = factory.filesDetails.files.length; i < j; i +=
            1) {
            if (factory.filesDetails.files[i].name === fileName) {
              existingFileNameIndex = i;
              break;
            }
          }

          if (idx >= 0) {
            if (existingFileNameIndex === -1) {
              factory.filesDetails.files.push({
                name: fileName,
                kind: 'folder'
              });
            }
          } else if (existingFileNameIndex !== -1) {
            factory.filesDetails.files.splice(existingFileNameIndex, 1,
              newFile);
          } else {
            factory.filesDetails.files.push(newFile);
          }

          // Needed because file upload does not refresh the list with a server call
          factory.filesDetails.bucketExists = true;
        };

        factory.getFileNameIndex = function (fileName) {
          for (var i = 0; i < factory.filesDetails.files.length; i++) {
            if (factory.filesDetails.files[i].name === fileName) {
              return i;
            }
          }
          return -1;
        };

        factory.removeFiles = function (files) {
          var oldFiles = factory.filesDetails.files;

          for (var i = oldFiles.length - 1; i >= 0; i--) {
            if (files.indexOf(oldFiles[i]) >= 0) {
              oldFiles.splice(i, 1);
            }
          }
        };

        factory.refreshFilesList = function () {
          function processFilesResponse(resp) {
            var TRASH = '--TRASH--/';
            var parentFolder = factory.folderPath;
            var parentFolderIndex = null;

            resp.files = resp.files || [];

            factory.filesDetails.files = resp.files.filter(
              function (f) {
                var include = true;

                if (factory.excludedFiles.indexOf(f.name) !== -1) {
                  include = false;
                }

                if (f.name === parentFolder) {
                  include = false;
                }

                if (storageFactory.isFolderFilter() &&
                  !storageUtils.fileIsFolder(f)) {
                  include = false;
                }

                return include;
              }
            );

            factory.filesDetails.bucketExists = resp.bucketExists;
            factory.filesDetails.code = resp.code;

            if (!factory.folderPath || !parentFolder || parentFolder ===
              '/') {
              // [AD] There may be a reason why the trash folder is added in 
              // the second position; from legacy Storage
              factory.filesDetails.files.splice(1, 0, {
                name: TRASH,
                size: '',
                updated: null
              });

              if (storageFactory.isFolderFilter()) {
                factory.filesDetails.files.splice(1, 0, {
                  name: '/',
                  size: '',
                  updated: null
                });
              }
            }

            return resp;
          }

          var params = {};
          if (factory.folderPath) {
            params.folderPath = factory.folderPath;
          } else {
            params.folderPath = undefined;
          }

          factory.filesDetails.code = 202;
          factory.loadingItems = true;

          var sourceObject = {
            name: factory.folderPath ? factory.folderPath : '/'
          };
          pendingOperationsFactory.addPendingOperation(sourceObject, 'load');

          return storage.files.get(params)
            .then(function (resp) {
              pendingOperationsFactory.removePendingOperation(sourceObject);

              return processFilesResponse(resp);
            }, function (e) {
              pendingOperationsFactory.statusDetails.message = processErrorCode('Files', 'load', e);
              pendingOperationsFactory.markPendingOperationFailed(sourceObject);
            })
            .finally(function () {
              factory.loadingItems = false;
            });
        };

        // fileSelectorFactory functionality ~~~~~~~~~~

        //on all state Changes do not hold onto checkedFiles list
        $rootScope.$on('$stateChangeStart', function () {
          factory.resetSelections();
        });

        factory.resetSelections = function () {
          factory.filesDetails.files.forEach(function (val) {
            val.isChecked = false;
          });

          factory.filesDetails.checkedCount = 0;
          factory.filesDetails.folderCheckedCount = 0;
          factory.filesDetails.checkedItemsCount = 0;
        };

        factory.resetSelections();

        factory.selectAllCheckboxes = function (query) {
          var filteredFiles = filterFilter(factory.filesDetails.files,
            query);

          factory.selectAll = !factory.selectAll;

          factory.filesDetails.checkedCount = 0;
          factory.filesDetails.folderCheckedCount = 0;
          factory.filesDetails.checkedItemsCount = 0;
          for (var i = 0; i < factory.filesDetails.files.length; ++i) {
            var file = factory.filesDetails.files[i];

            if (storageUtils.fileIsTrash(file) ||
              (storageUtils.fileIsFolder(file) &&
                !storageFactory.isFolderSelector())) {
              continue;
            }

            file.isChecked = factory.selectAll && filteredFiles.indexOf(
                file) >=
              0;

            if (file.name.substr(-1) !== '/') {
              factory.filesDetails.checkedCount += file.isChecked ? 1 :
                0;
            } else {
              factory.filesDetails.folderCheckedCount += file.isChecked ?
                1 : 0;
            }

            factory.filesDetails.checkedItemsCount += file.isChecked ? 1 :
              0;
          }
        };

        factory.getSelectedFiles = function () {
          return factory.filesDetails.files.filter(function (e) {
            return e.isChecked;
          });
        };

        var _fileCheckToggled = function (file) {
          // ng-click is processed before btn-checkbox updates the model
          var checkValue = !file.isChecked;

          file.isChecked = checkValue;

          if (file.name.substr(-1) !== '/') {
            factory.filesDetails.checkedCount += checkValue ? 1 : -1;
          } else {
            factory.filesDetails.folderCheckedCount += checkValue ? 1 :
              -1;
          }

          factory.filesDetails.checkedItemsCount += checkValue ? 1 : -1;
        };

        factory.sendFiles = function () {
          var files = factory.getSelectedFiles();

          $rootScope.$broadcast('FileSelectAction', files);
        };

        factory.onFileSelect = function (file) {
          if (storageFactory.canSelect(file)) {
            if (!storageFactory.isMultipleSelector()) {
              $rootScope.$broadcast('FileSelectAction', [file]);
            } else {
              _fileCheckToggled(file);
            }
          }
        };

        factory.changeFolder = function (folder) {
          if (storageUtils.fileIsFolder(folder)) {
            factory.resetSelections();

            factory.folderPath = folder.name;

            factory.refreshFilesList();
          }
        };

        factory.isTrashFolder = function () {
          return factory.folderPath.lastIndexOf('--TRASH--/', 0) === 0;
        };

        return factory;
      };
    }
  ]);
