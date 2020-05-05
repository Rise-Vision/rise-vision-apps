'use strict';

angular.module('risevision.storage.services')
  .service('encoding', ['$q', '$log', '$http', 'storageAPILoader', 'userState',
    function ($q, $log, $http, storageAPILoader, userState) {
      $log.debug('Loading encoding service');
      var switchURL = 'https://storage.googleapis.com/risemedialibrary/encoding-switch';
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

      return service;
    }
  ]);
