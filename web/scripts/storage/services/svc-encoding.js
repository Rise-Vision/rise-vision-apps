'use strict';

angular.module('risevision.storage.services')
  .service('encoding', ['$q', '$log', '$http', 'storageAPILoader', 'userState',
    function ($q, $log, $http, storageAPILoader, userState) {
      $log.debug('Loading encoding service');
      var switchURL = 'https://storage.googleapis.com/risemedialibrary/encoding-switch-on';
      var masterSwitchPromise = $http({method: 'HEAD', url: switchURL});

      var service = {};

      service.isApplicable = function(fileType) {
        $log.debug('Checking encoding applicability for ' + fileType);

        if (fileType.indexOf('video/') !== 0) { return $q.resolve(false); }

        return masterSwitchPromise
        .then(function() {return true;}, function() {return false;});
      };

      service.getResumableUploadURI = function(fileName) {
        var deferred = $q.defer();
        var obj = {
          companyId: userState.getSelectedCompanyId(),
          fileName: encodeURIComponent(fileName),
        };

        $log.debug('Retrieving encoding upload destination', obj);

        storageAPILoader().then(function (storageApi) {
          return storageApi.getEncodingUploadURI(obj);
        })
        .then(function (resp) {
          deferred.resolve(resp.result);
        })
        .then(null, function (e) {
          $log.error('Error getting resumable upload URI', e);
          deferred.reject(e);
        });

        return deferred.promise;
      };

      service.startEncoding = function(item) {
        var deferred = $q.defer();
        var obj = {
          taskToken: item.taskToken,
          fileUUID: item.tusURL.split('/').pop(),
          fileName: item.file.name,
          companyId: userState.getSelectedCompanyId()
        };

        $log.debug('Requesting encoding start', obj);

        storageAPILoader().then(function (storageApi) {
          return storageApi.startEncodingTask(obj);
        })
        .then(function (resp) {
          deferred.resolve({
            statusURL: resp.result.message,
            fileName: resp.result.fileName
          });
        })
        .then(null, function (e) {
          $log.error('Error starting encoding task', e);
          deferred.reject(e);
        });

        return deferred.promise;
      };

      service.monitorStatus = function(item, onProgress) {
        var statusURL = item.encodingStatusURL;

        $log.debug('Checking status at ' + statusURL);

      };

      service.acceptEncodedFile = function() {
      };

      return service;
    }
  ]);
