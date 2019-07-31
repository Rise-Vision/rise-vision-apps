'use strict';

angular.module('risevision.template-editor.services')
  .service('fileExistenceCheckService', ['$q', '$log',
    function ($q, $log) {
      var service = {};

      function _loadMetadata(metadata, fileNames) {
        var promises = _.map(fileNames, function (fileName) {
          return _getThumbnailDataFor(fileName)
            .then(function (data) {
              return {
                file: fileName,
                exists: data.exists,
                'time-created': data.timeCreated,
                'thumbnail-url': data.url
              };
            })
            .catch(function (error) {
              $log.error(error);
            });
        });

        return $q.all(promises).then(function (results) {
          var metadata = [];

          _.reject(results, _.isNil).forEach(function (file) {
            metadata.push(file);
          });

          return metadata;
        });
      }

      service.requestMetadataFor = function (files, defaultThumbnailUrl) {
        var fileNames;

        if (files) {
          fileNames = Array.isArray(files) ?
            angular.copy(files) : files.split('|');
        } else {
          fileNames = [];
        }

        return _loadMetadata(fileNames);
      };

      return service;
    }
  ]);
