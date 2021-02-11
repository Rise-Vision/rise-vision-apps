'use strict';

angular.module('risevision.apps.services')
  .service('imageBlobLoader', ['$q', function ($q) {
    return function (imageUrl) {
      var deferred = $q.defer();
      var xhr = new XMLHttpRequest();

      xhr.open('GET', imageUrl, true);
      xhr.responseType = 'arraybuffer';
      xhr.timeout = 10000;

      xhr.onload = function (e) {
        var arrayBufferView = new Uint8Array(this.response);
        var blob = new Blob([arrayBufferView], {
          type: 'image/jpeg'
        });
        var imageUrl = URL.createObjectURL(blob);
        var status = xhr.status;
        var resp = {
          status: status,
          imageUrl: status === 200 ? imageUrl : null,
          lastModified: status === 200 ? new Date(this.getResponseHeader(
            'last-modified')) : null
        };

        deferred.resolve(resp);
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
