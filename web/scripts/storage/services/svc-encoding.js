'use strict';

angular.module('risevision.storage.services')
  .service('encoding', ['$q', '$log', '$http', 'storageAPILoader', 'userState', '$timeout',
    function ($q, $log, $http, storageAPILoader, userState, $timeout) {
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
            statusURL: resp.result.message
          });
        })
        .then(null, function (e) {
          $log.error('Error starting encoding task', e);
          deferred.reject(e);
        });

        return deferred.promise;
      };

      service.monitorStatus = function(item, onProgress, retry) {
        var statusURL = item.encodingStatusURL;
        var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        if (retry === undefined) {retry = 0;}

        $log.debug('Checking status at ' + statusURL);

        return $timeout(5000)
        .then(function() {
          return $http({
            method: 'POST',
            headers: headers,
            url: statusURL,
            data: 'task_tokens=' + item.taskToken
          });
        })
        .then(function(resp) {
          $log.debug('Status: ', resp.data);

          if (resp.data.error) {return $q.reject(resp.data.error);}

          var taskStatus = resp.data.statuses[item.taskToken];
          if (!taskStatus) {
            return service.monitorStatus(item, onProgress, retry + 1);
          }

          if (taskStatus.status_url) { // jshint ignore:line
            item.encodingStatusURL = taskStatus.status_url; // jshint ignore:line
          }

          if (taskStatus.error) {
            return $q.reject(taskStatus.error_description); // jshint ignore:line
          }

          if (taskStatus.percent !== 100) {
            onProgress(taskStatus.percent);

            return service.monitorStatus(item, onProgress);
          }

          onProgress(taskStatus.percent);
        })
        .then(null, function(e) {
          if (retry > 2) {return $q.reject(e);}
          return service.monitorStatus(item, onProgress, retry + 1);
        });
      };

      service.acceptEncodedFile = function(fileName) {
        var deferred = $q.defer();
        var obj = {
          companyId: userState.getSelectedCompanyId(),
          fileName: fileName,
        };

        $log.debug('Accepting encoded file', obj);

        storageAPILoader().then(function (storageApi) {
          return storageApi.acceptEncodedFile(obj);
        })
        .then(function (resp) {
          deferred.resolve(resp.result);
        })
        .then(null, function (e) {
          $log.error('Error accepting encoded file', e);
          deferred.reject(e);
        });

        return deferred.promise;
      };

      return service;
    }
  ]);
