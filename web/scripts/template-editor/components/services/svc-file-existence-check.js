'use strict';

angular.module('risevision.template-editor.services')
  .service('fileExistenceCheckService', ['$q', '$log',
    function ($q, $log) {
      var service = {};

      service.requestMetadataFor = function(files, defaultThumbnailUrl) {
        return $q.resolve([]);
      };

      return service;
    }
  ]);
