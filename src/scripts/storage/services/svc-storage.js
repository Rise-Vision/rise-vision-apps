'use strict';

/*jshint camelcase: false */

angular.module('risevision.storage.services')
  .service('storage', ['$q', '$log', 'storageAPILoader',
    'userState', '$window', 'processErrorCode',
    function ($q, $log, storageAPILoader, userState, $window, processErrorCode) {
      var service = {
        files: {
          get: function (search) {
            var deferred = $q.defer();

            var obj = {
              'companyId': userState.getSelectedCompanyId()
            };

            if (search.folderPath) {
              obj.folder = search.folderPath;
            }
            if (search.file) {
              obj.file = search.file;
            }

            $log.debug('Storage files get called with', obj);

            storageAPILoader().then(function (storageApi) {
                return storageApi.files.get(obj);
              })
              .then(function (resp) {
                $log.debug('status storage files resp', resp);

                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                var apiError = processErrorCode('Files', 'list', e);
                console.error('Failed to get storage files', apiError);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          delete: function (selectedFileNames) {
            var deferred = $q.defer();

            var obj = {
              'companyId': userState.getSelectedCompanyId(),
              'files': selectedFileNames
            };

            $log.debug('Storage delete called with', obj);

            storageAPILoader().then(function (storageApi) {
                return storageApi.files.delete(obj);
              })
              .then(function (resp) {
                $log.debug('status storage delete resp', resp);

                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to delete files', e);
                deferred.reject(e);
              });

            return deferred.promise;
          }
        },
        trash: {
          move: function (selectedFileNames) {
            var deferred = $q.defer();

            var obj = {
              'companyId': userState.getSelectedCompanyId(),
              'files': selectedFileNames
            };

            $log.debug('Storage trash move called with', obj);

            storageAPILoader().then(function (storageApi) {
                return storageApi.trash.move(obj);
              })
              .then(function (resp) {
                $log.debug('status storage trash move resp', resp);

                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to move files to trash', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          restore: function (selectedFileNames) {
            var deferred = $q.defer();

            var obj = {
              'companyId': userState.getSelectedCompanyId(),
              'files': selectedFileNames
            };

            $log.debug('Storage trash restore called with', obj);

            storageAPILoader().then(function (storageApi) {
                return storageApi.trash.restore(obj);
              })
              .then(function (resp) {
                $log.debug('status storage trash restore resp', resp);

                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to restore files from trash', e);
                deferred.reject(e);
              });

            return deferred.promise;
          }
        },

        createFolder: function (folder) {
          var deferred = $q.defer();

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'folder': folder
          };

          $log.debug('Creating folder: ', obj);

          storageAPILoader().then(function (storageApi) {
              return storageApi.createFolder(obj);
            })
            .then(function (resp) {
              $log.debug('Folder created', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to create folder', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },

        getFolderContents: function (folderName) {
          var deferred = $q.defer();

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'folderName': folderName
          };

          $log.debug('Retrieving folder contents: ', obj);

          storageAPILoader().then(function (storageApi) {
              return storageApi.getFolderContents(obj);
            })
            .then(function (resp) {
              $log.debug('Folder contents retrieved', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to retrieve folder contents', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },

        getResumableUploadURI: function (fileName, fileType) {
          var deferred = $q.defer();

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'fileName': encodeURIComponent(fileName),
            'fileType': fileType,
            'origin': $window.location.origin
          };

          $log.debug('getting resumable upload URI: ', obj);

          storageAPILoader().then(function (storageApi) {
              return storageApi.getResumableUploadURI(obj);
            })
            .then(function (resp) {
              $log.debug('getting resumable upload URI finished', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Error getting resumable upload URI', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },

        getSignedDownloadURI: function (file) {
          var deferred = $q.defer();

          var obj = {
            companyId: userState.getSelectedCompanyId(),
            fileName: encodeURIComponent(file.name),
            fileType: file.type
          };

          $log.debug('getting signed download URI: ', obj);

          storageAPILoader().then(function (storageApi) {
              return storageApi.getSignedDownloadURI(obj);
            })
            .then(function (resp) {
              $log.debug('getting signed download URI finished', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Error getting signed download URI', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },

        rename: function (sourceName, destinationName) {
          var deferred = $q.defer();

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'sourceName': sourceName,
            'destinationName': destinationName
          };

          $log.debug('Storage rename called with', obj);

          if (sourceName === destinationName) {
            deferred.reject({
              status: 400,
              result: {
                error: {
                  message: 'must-be-different'
                }
              }
            });
          } else {
            storageAPILoader().then(function (storageApi) {
                return storageApi.files.rename(obj);
              })
              .then(function (resp) {
                $log.debug('status storage rename resp', resp);

                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to rename storage objects', e);
                deferred.reject(e);
              });
          }

          return deferred.promise;
        },

        duplicate: function (sourceName) {
          var deferred = $q.defer();

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'sourceName': sourceName
          };

          $log.debug('Storage duplicate called with', obj);

          storageAPILoader().then(function (storageApi) {
              return storageApi.files.duplicate(obj);
            })
            .then(function (resp) {
              $log.debug('status storage duplicate resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to duplicate storage objects', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },

        refreshFileMetadata: function (fileName) {
          return _refreshFileMetadata(fileName, 3);

          function _refreshFileMetadata(fileName, remainingAttempts) {
            console.log('Attempt #' + remainingAttempts + ' to get metadata for: ' + fileName);

            return service.files.get({
                file: fileName
              })
              .then(function (resp) {
                var file = resp && resp.files && resp.files[0];

                if (file && (!file.metadata || file.metadata['needs-thumbnail-update'] !== 'true')) {
                  return $q.resolve(file);
                } else if (file && remainingAttempts > 0) {
                  return _refreshFileMetadata(fileName, remainingAttempts - 1);
                } else {
                  return $q.reject();
                }
              });
          }
        }


      };
      return service;
    }
  ]);
