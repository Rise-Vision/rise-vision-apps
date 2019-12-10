'use strict';
angular.module('risevision.storage.services')
  .factory('UploadURIService', ['$q', '$log', 'storage', 'processErrorCode',
    function uploadURIService($q, $log, storage, processErrorCode) {
      var svc = {};

      svc.getURI = function getURI(file) {
        if (!file.name) {
          return $q.reject({
            message: 'Invalid Params'
          });
        }

        return storage.getResumableUploadURI(file.name, file.type)
          .then(function (resp) {
            return resp;
          })
          .then(null, function (e) {
            var type = file.type === 'folder' ? 'Folder' : 'File';
            var message = processErrorCode(type, 'upload', e);

            return $q.reject({
              message: message,
              status: e.status
            });
          });
      };

      return svc;
    }
  ]);
