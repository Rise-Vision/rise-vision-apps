'use strict';

/*jshint camelcase: false */

angular.module('risevision.storage.services')
  .service('storage', ['$q', '$log', 'storageAPILoader', 'userState',
    function ($q, $log, storageAPILoader, userState) {
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
              $log.debug('Trial Started', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              $log.error('Failed to start trial', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },

        createFolder: function(folder) {
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
        }

      };      
      return service;
    }
  ]);
