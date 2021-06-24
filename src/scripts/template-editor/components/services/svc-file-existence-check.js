'use strict';

angular.module('risevision.template-editor.services')
  .service('fileExistenceCheckService', ['$q', '$log', 'storageAPILoader', 'fileMetadataUtilsService', 'environment',
    function ($q, $log, storageAPILoader, fileMetadataUtilsService, environment) {
      var service = {};

      function _requestFileData(companyId, file) {
        var search = {
          'companyId': companyId,
          'file': file
        };

        return storageAPILoader()
          .then(function (storageApi) {
            return storageApi.files.get(search);
          });
      }

      function _isDefaultImageOnTestAppsEnvironment(fileName) {
        if (environment.APPS_ENV !== 'TEST') {
          return false;
        }

        // all default files for Rise Vision templates are defined under this GCS bucket
        var regex = /^risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f[/]Template Library[/].+/;

        return regex.test(fileName);
      }

      function _getThumbnailDataFor(fileName, defaultThumbnailUrl) {
        var invalidThumbnailData = {
          exists: false,
          timeCreated: '',
          url: ''
        };
        var regex = /risemedialibrary-([0-9a-f-]{36})[/](.+)/g;
        var match = regex.exec(fileName);

        if (!match) {
          $log.error('Filename is not a valid Rise Storage path: ' + fileName);

          return $q.resolve(invalidThumbnailData);
        } else if (_isDefaultImageOnTestAppsEnvironment(fileName)) {
          return $q.resolve({
            exists: true,
            timeCreated: '',
            url: defaultThumbnailUrl
          });
        }

        return _requestFileData(match[1], match[2])
          .then(function (resp) {
            var file = resp && resp.result && resp.result.result &&
              resp.result.files && resp.result.files[0];

            if (!file) {
              return invalidThumbnailData;
            }

            var url = fileMetadataUtilsService.thumbnailFor(file, defaultThumbnailUrl);

            return {
              exists: !!url,
              timeCreated: fileMetadataUtilsService.timeCreatedFor(file),
              url: url
            };
          })
          .catch(function (error) {
            $log.error(error);

            return invalidThumbnailData;
          });
      }

      function _loadMetadata(fileNames, defaultThumbnailUrl) {
        var promises = _.map(fileNames, function (fileName) {
          return _getThumbnailDataFor(fileName, defaultThumbnailUrl)
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
        var fileNames = fileMetadataUtilsService.filesAttributeToArray(files);

        return _loadMetadata(fileNames, defaultThumbnailUrl);
      };

      return service;
    }
  ]);
