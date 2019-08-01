'use strict';

angular.module('risevision.template-editor.services')
  .service('fileMetadataUtilsService', function () {
    var service = {};

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

    return service;
  });
