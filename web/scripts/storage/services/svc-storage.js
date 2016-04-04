'use strict';

/*jshint camelcase: false */

angular.module('risevision.storage.services')
  .service('storage', ['$rootScope', '$q', '$log', 'storageAPILoader',
    'userState', '$window',
    function ($rootScope, $q, $log, storageAPILoader, userState, $window) {
      var service = {
        files: {
          get: function (search) {
            var deferred = $q.defer();

            var obj = {
              'companyId': userState.getSelectedCompanyId()
            };

            if (search.folderPath) {
              obj.folder = decodeURIComponent(search.folderPath);
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
                $log.error('Failed to get storage files', e);
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
                $log.error('Failed to delete files', e);
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
                $log.error('Failed to move files to trash', e);
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
                $log.error('Failed to restore files from trash', e);
                deferred.reject(e);
              });

            return deferred.promise;
          }
        },
        startTrial: function () {
          var deferred = $q.defer();

          var obj = {
            'companyId': userState.getSelectedCompanyId()
          };

          $log.debug('Starting trial for: ', obj);

          storageAPILoader().then(function (storageApi) {
              return storageApi.startTrial(obj);
            })
            .then(function (resp) {
              $rootScope.$emit('refreshSubscriptionStatus',
                'trial-available');

              $log.debug('Trial Started', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              $log.error('Failed to start trial', e);
              deferred.reject(e);
            });

          return deferred.promise;
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
              $log.error('Failed to create folder', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },

        getResumableUploadURI: function (fileName, fileType) {
          var deferred = $q.defer();

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'fileName': fileName,
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
              $log.error('Error getting resumable upload URI', e);
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
              $log.error('Error getting signed download URI', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },

        notifyGCMTargetsChanged: function (files) {
          var deferred = $q.defer();

          var obj = {
            companyId: userState.getSelectedCompanyId(),
            targets: files
          };

          $log.debug('notifying GCM Targets Changed: ', obj);

          storageAPILoader().then(function (storageApi) {
              return storageApi.notifyGCMTargetsChanged(obj);
            })
            .then(function (resp) {
              $log.debug('notifying GCM Targets Changed finished', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              $log.error('Error notifying GCM Targets Changed', e);
              deferred.reject(e);
            });

          return deferred.promise;
        }

      };
      return service;
    }
  ]);
