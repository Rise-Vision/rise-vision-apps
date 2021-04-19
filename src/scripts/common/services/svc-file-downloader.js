'use strict';

angular.module('risevision.apps.services')
  .service('fileDownloader', ['$q', function ($q) {
    return function (url, filepath) {
      var deferred = $q.defer();
      var xhr = new XMLHttpRequest();

      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.timeout = 15000;

      xhr.onload = function () {
        if (xhr.status === 200) {
          var blob = xhr.response;
          var file = new File([blob], filepath);
          deferred.resolve(file);  
        } else {
          deferred.reject({
            status: xhr.status,
            err: 'Status Error'
          });
        }
      };

      xhr.onerror = xhr.ontimeout = function (err) {
        deferred.reject({
          status: xhr.status,
          err: err
        });
      };

      xhr.send();

      return deferred.promise;
    };
  }]);
