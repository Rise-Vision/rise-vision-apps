'use strict';

angular.module('risevision.template-editor.services')
  .service('fileMetadataUtilsService', ['templateEditorUtils', 'storageUtils',
    function (templateEditorUtils, storageUtils) {
      var service = {};

      function _addFileToSet(selectedImages, defaultThumbnailUrl, file, alwaysAppend) {
        if (!file.bucket) {
          file.bucket = storageUtils.getBucketName();
        }

        var filePath = file.bucket + '/' + file.name;
        var initialLength = selectedImages.length;
        var timeCreated = service.timeCreatedFor(file);
        var thumbnail = service.thumbnailFor(file, defaultThumbnailUrl);

        var newFile = {
          file: filePath,
          exists: true,
          'time-created': timeCreated,
          'thumbnail-url': thumbnail
        };

        templateEditorUtils.addOrReplaceAll(selectedImages, {
          file: filePath
        }, newFile);

        if (alwaysAppend && initialLength === selectedImages.length) {
          selectedImages.push(newFile);
        }
      }

      service.thumbnailFor = function (item, defaultThumbnailUrl) {
        if (item.metadata && item.metadata.thumbnail) {
          return item.metadata.thumbnail + '?_=' + service.timeCreatedFor(item);
        } else {
          return defaultThumbnailUrl;
        }
      };

      service.timeCreatedFor = function (item) {
        return item.timeCreated && item.timeCreated.value;
      };

      service.extractFileNamesFrom = function (metadata) {
        return _.map(metadata, function (entry) {
          return entry.file;
        });
      };

      service.filesAttributeFor = function (metadata) {
        return service.extractFileNamesFrom(metadata).join('|');
      };

      service.filesAttributeToArray = function (files) {
        var fileNames;

        if (files) {
          fileNames = Array.isArray(files) ?
            angular.copy(files) : files.split('|');
        } else {
          fileNames = [];
        }

        return fileNames;
      };

      service.metadataWithFile = function (previousMetadata, defaultThumbnailUrl, files, alwaysAppend) {
        var metadata = _.cloneDeep(previousMetadata);

        files.forEach(function (file) {
          _addFileToSet(metadata, defaultThumbnailUrl, file, alwaysAppend);
        });

        return metadata;
      };

      service.metadataWithFileRemoved = function (previousMetadata, entry) {
        var idx = previousMetadata.indexOf(entry);
        var metadata = _.cloneDeep(previousMetadata);

        if (idx >= 0) {
          metadata.splice(idx, 1);

          return metadata;
        }
      };

      service.getUpdatedFileMetadata = function (currentMetadata, newMetadata) {
        if (!currentMetadata) {
          return newMetadata;
        } else {
          var atLeastOneOriginalEntryIsStillSelected = false;
          var metadataCopy = angular.copy(currentMetadata);

          _.each(newMetadata, function (entry) {
            var currentEntry = _.find(metadataCopy, {
              file: entry.file
            });

            if (currentEntry) {
              atLeastOneOriginalEntryIsStillSelected = true;
              currentEntry.exists = entry.exists;
              currentEntry['thumbnail-url'] = entry['thumbnail-url'];
              currentEntry['time-created'] = entry['time-created'];
            }
          });

          return atLeastOneOriginalEntryIsStillSelected ? metadataCopy : null;
        }
      };

      return service;
    }
  ]);
