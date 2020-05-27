'use strict';
angular.module('risevision.storage.services')
  .factory('UploadURIService', ['$q', '$log', 'storage', 'encoding', 'processErrorCode',
    function uploadURIService($q, $log, storage, encoding, processErrorCode) {
      var svc = {};

      svc.getURI = function getURI(file, forceStorage) {
        if (!file.name) {
          return $q.reject({
            message: 'Invalid Params'
          });
        }

        return encoding.isApplicable(file.type)
          .then(function (useEncoding) {
            var applicableService = useEncoding ? encoding : storage;

            if (forceStorage) {
              applicableService = storage;
            }
            return applicableService.getResumableUploadURI(file.name, file.type);
          })
          .then(function (resp) {
            return resp;
          })
          .then(null, function (e) {
            var type = file.type === 'folder' ? 'Folder' : 'File';
            var message = e && e.result && e.result.error && e.result.error.message === 'Unencodable overwrite' ?
              e.result.error.message : processErrorCode(type, 'upload', e);

            $log.debug('Failed upload uri request');
            return $q.reject({
              message: message,
              status: e.status
            });
          });
      };

      return svc;
    }
  ]);
