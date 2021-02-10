'use strict';

angular.module('risevision.storage.services')
  .factory('fileRetriever', ['$q',
    function ($q) {
      var svc = {};

      svc.retrieveFile = function (url, userData) {
        var request = new XMLHttpRequest();
        var response = {};
        var defer = $q.defer();

        request.addEventListener('load', function () {
          response.size = Number(request.getResponseHeader(
            'Content-Length'));
          response.data = new Uint8Array(request.response);
          response.userData = userData;

          defer.resolve(response);
        }, false);

        request.addEventListener('error', function (error) {
          defer.reject(error);
        }, false);

        request.open('GET', url);
        request.responseType = 'arraybuffer';
        request.send();

        return defer.promise;
      };

      return svc;
    }
  ]);
