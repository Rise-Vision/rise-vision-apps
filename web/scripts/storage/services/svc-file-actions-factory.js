'use strict';
angular.module('risevision.storage.services')
  .factory('fileActionsFactory', ['$rootScope',
    'fileSelectorFactory', 'filesFactory', 'storage', 'storageFactory',
    'downloadFactory', '$modal', '$translate', 'localStorageService', '$q',
    'STORAGE_FILE_URL',
    function ($rootScope, fileSelectorFactory, filesFactory, storage, storageFactory,
      downloadFactory, $modal, $translate, localStorageService, $q, STORAGE_FILE_URL) {
      var factory = {};

      factory.statusDetails = {
        code: 200,
        message: ''
      };
      factory.pendingOperations = [];
      factory.isPOCollapsed = true;

      factory.downloadButtonClick = function () {
        downloadFactory.downloadFiles(fileSelectorFactory.getSelectedFiles(),
          100);
      };

      factory.deleteButtonClick = function () {
        factory.confirmDeleteFilesAction();
      };

      factory.trashButtonClick = function () {
        factory.processFilesAction('trash');
      };

      factory.restoreButtonClick = function () {
        factory.processFilesAction('restore');
      };

      factory.removePendingOperation = function (file) {
        var position = factory.pendingOperations.indexOf(file);

        if (position >= 0) {
          factory.pendingOperations.splice(position, 1);
        }
      };

      factory.copyUrlButtonClick = function () {
        $modal.open({
          templateUrl: 'partials/storage/copy-url-modal.html',
          controller: 'CopyUrlModalController',
          size: 'lg',
          resolve: {
            copyFile: function () {
              return fileSelectorFactory.getSelectedFiles()[0];
            }
          }
        });
      };

      factory.confirmDeleteFilesAction = function () {
        var filesSelected = filesFactory.filesDetails.checkedCount > 0;
        var foldersSelected = filesFactory.filesDetails.folderCheckedCount >
          0;
        var message;

        if (filesSelected && foldersSelected) {
          message = 'delete-files-folders';
        } else if (foldersSelected) {
          message = 'delete-folders';
        } else {
          message = 'delete-files';
        }

        message = 'storage-client.' + message + '-' +
          (filesFactory.filesDetails.checkedItemsCount === 1 ?
            'singular' : 'plural');

        var modalInstance = $modal.open({
          templateUrl: 'confirm-instance/confirm-modal.html',
          controller: 'confirmInstance',
          windowClass: 'modal-custom',
          resolve: {
            confirmationTitle: function () {
              return '';
            },
            confirmationMessage: function () {
              return $translate(message, {
                count: filesFactory.filesDetails.checkedItemsCount
              });
            },
            confirmationButton: function () {
              return 'common.delete-forever';
            },
            cancelButton: null
          }
        });

        modalInstance.result.then(function () {
          // do what you need if user presses ok
          factory.processFilesAction('delete');
        }, function () {
          // do what you need to do if user cancels
        });

      };

      var _getAPIMethod = function (action) {
        if (action === 'trash') {
          return storage.trash.move;
        } else if (action === 'restore') {
          return storage.trash.restore;
        } else {
          return storage.files.delete;
        }
      };

      factory.processFilesAction = function (action) {
        var selectedFiles = fileSelectorFactory.getSelectedFiles();
        var selectedFileNames = selectedFiles.map(function (file) {
          return file.name;
        });

        selectedFiles.forEach(function (file) {
          file.action = action;
          var pendingFileNames = factory.pendingOperations.map(function (
            i) {
            return i.name;
          });
          if (pendingFileNames.indexOf(file.name) === -1) {
            factory.pendingOperations.push(file);
          }
        });

        filesFactory.removeFiles(selectedFiles);
        fileSelectorFactory.resetSelections();
        factory.isPOCollapsed = true;

        _getAPIMethod(action)(selectedFileNames)
          .then(function (resp) {
            if (!resp.result) {
              factory.statusDetails.code = resp.code;

              if (resp.code === 403 && resp.message.indexOf(
                  'restricted-role') >= 0) {
                $translate('storage-client.access-denied').then(function (
                  msg) {
                  factory.statusDetails.message = msg;
                });
              } else {
                $translate('storage-client.' + resp.message, {
                  username: resp.userEmail
                }).then(function (msg) {
                  factory.statusDetails.message = msg;
                });
              }
              selectedFiles.forEach(function (file) {
                file.actionFailed = true;

                filesFactory.filesDetails.files.push(file);
              });

              fileSelectorFactory.resetSelections();
            } else {
              // Removed completed pending operations
              for (var i = factory.pendingOperations.length - 1; i >= 0; i--) {
                var file = factory.pendingOperations[i];

                if (selectedFiles.indexOf(file) >= 0) {
                  factory.pendingOperations.splice(i, 1);
                }
              }
            }
          });
      };

      factory.getActivePendingOperations = function () {
        return factory.pendingOperations.filter(function (op) {
          return !op.actionFailed;
        });
      };

      factory.refreshThumbnail = function(file) {
        if(!storageFactory.fileIsFolder(file)) {
          return storage.files.get({ file: file.name })
            .then(function (resp) {
              return resp && resp.files && resp.files[0] ? resp.files[0] : file;
            });
        }
        else {
          return $q.resolve(angular.copy(file));
        }
      };

      factory.renameObject = function(sourceObject, newName) {
        var suffix = storageFactory.fileIsFolder(sourceObject) && !storageFactory.fileIsFolder({ name: newName }) ? "/" : "";
        var renameName = newName + suffix;
        var newObject = angular.copy(sourceObject);

        return storage.rename(sourceObject.name, renameName)
          .then(function(resp) {
            if(resp.code !== 200) {
              return resp;
            }
            else {
              newObject.name = renameName;

              return factory.refreshThumbnail(newObject)
                .then(function(file) {
                  filesFactory.removeFiles([sourceObject]);
                  filesFactory.addFile(newObject);
                  fileSelectorFactory.resetSelections();

                  return resp;
                });
            }
          });
      };

      factory.showBreakLinkWarning = function (infoLine1Key, infoLine2Key, warningKey, confirmKey, cancelKey, localStorageKey) {
        var hideWarning = localStorageService.get(localStorageKey) === 'true';

        if(hideWarning) {
          return $q.resolve();
        }

        return $modal.open({
          templateUrl: 'partials/storage/break-link-warning-modal.html',
          controller: 'BreakLinkWarningModalCtrl',
          size: 'md',
          resolve: {
            infoLine1Key: function() { return infoLine1Key; },
            infoLine2Key: function() { return infoLine2Key; },
            warningKey: function() { return warningKey; },
            confirmKey: function() { return confirmKey; },
            cancelKey: function() { return cancelKey; },
            localStorageKey: function() { return localStorageKey; }
          }
        }).result;
      };

      factory.showRenameBreakLinkWarning = function() {
        var prefix = 'storage-client.rename.';

        return factory.showBreakLinkWarning(prefix + 'breaking-link1',
                                            prefix + 'breaking-link2',
                                            prefix + 'breaking-link-hide-warning',
                                            'common.ok',
                                            'common.cancel',
                                            'breakingLinkWarning.hideWarning');
      };

      factory.renameButtonClick = function (sourceName) {
        return factory.showRenameBreakLinkWarning().then(function () {
          var renameModal = $modal.open({
            templateUrl: 'partials/storage/rename-modal.html',
            controller: 'RenameModalCtrl',
            size: 'md',
            resolve: {
              sourceObject: function () {
                return fileSelectorFactory.getSelectedFiles()[0];
              }
            }
          });
        });
      };

      return factory;
    }
  ]);
