'use strict';
angular.module('risevision.storage.services')
  .value('SELECTOR_TYPES', {
    SINGLE_FILE: 'single-file',
    MULTIPLE_FILE: 'multiple-file',
    SINGLE_FOLDER: 'single-folder',
    MULTIPLE_FILES_FOLDERS: 'multiple-files-folders'
  })
  .value('SELECTOR_FILTERS', {
    ALL: {
      name: '',
      extensions: null
    },
    IMAGES: {
      name: 'images',
      extensions: [
        'jpg', 'jpeg', 'png', 'bmp', 'svg', 'gif', 'webp'
      ]
    },
    VIDEOS: {
      name: 'videos',
      extensions: [
        'webm', 'mp4', 'ogg', 'ogv'
      ]
    },
    FOLDERS: {
      name: 'folders',
      extensions: [
        '/'
      ]
    }
  })
  .service('StorageFactory', ['storageUtils', '$filter', '$modal',
    'SELECTOR_TYPES', 'SELECTOR_FILTERS',
    function (storageUtils, $filter, $modal,
      SELECTOR_TYPES, SELECTOR_FILTERS) {
      return function () {
        var factory = {
          storageFull: true,
          selectorType: '',
          selectorFilter: SELECTOR_FILTERS.ALL,
        };

        factory.setSelectorType = function (type, filter) {
          factory.selectorType = SELECTOR_TYPES.SINGLE_FILE;
          factory.selectorFilter = SELECTOR_FILTERS.ALL;

          for (var j in SELECTOR_TYPES) {
            if (type === SELECTOR_TYPES[j]) {
              factory.selectorType = SELECTOR_TYPES[j];

              break;
            }
          }

          for (var k in SELECTOR_FILTERS) {
            if (filter === SELECTOR_FILTERS[k].name) {
              factory.selectorFilter = SELECTOR_FILTERS[k];

              break;
            }
          }
        };

        factory.isMultipleSelector = function () {
          return factory.storageFull ||
            factory.selectorType === SELECTOR_TYPES.MULTIPLE_FILE ||
            factory.selectorType === SELECTOR_TYPES.MULTIPLE_FILES_FOLDERS;
        };

        factory.isFileSelector = function () {
          return factory.storageFull ||
            factory.selectorType === SELECTOR_TYPES.SINGLE_FILE ||
            factory.selectorType === SELECTOR_TYPES.MULTIPLE_FILE ||
            factory.selectorType === SELECTOR_TYPES.MULTIPLE_FILES_FOLDERS;
        };

        factory.isFolderSelector = function () {
          return factory.storageFull ||
            factory.selectorType === SELECTOR_TYPES.SINGLE_FOLDER ||
            factory.selectorType === SELECTOR_TYPES.MULTIPLE_FILES_FOLDERS;
        };

        factory.isFolderFilter = function () {
          return factory.selectorFilter === SELECTOR_FILTERS.FOLDERS;
        };

        var _isFilteredFile = function (file) {
          if (storageUtils.fileIsFolder(file)) {
            return false;
          }

          var filtered = false;

          if (factory.selectorFilter.extensions) {
            filtered = !_fileHasExtension(file, factory.selectorFilter.extensions);
          }

          return filtered;
        };

        var _fileHasExtension = function (file, allowedExtensions) {
          var fileType = $filter('fileTypeFilter')(file.name);
          return allowedExtensions.indexOf(fileType.toLowerCase()) !== -1;
        };

        factory.canSelect = function (file) {
          return !storageUtils.fileIsTrash(file) && !file.isThrottled &&
            (storageUtils.fileIsFolder(file) && factory.isFolderSelector() ||
              !storageUtils.fileIsFolder(file) && factory.isFileSelector()
            ) &&
            !_isFilteredFile(file);
        };

        factory.isDisabled = function (file) {
          return _isFilteredFile(file) ||
            !storageUtils.fileIsFolder(file) && !factory.isFileSelector();
        };

        factory.fileIsImage = function (file) {
          return _fileHasExtension(file, SELECTOR_FILTERS.IMAGES.extensions);
        };

        factory.fileIsVideo = function (file) {
          return _fileHasExtension(file, SELECTOR_FILTERS.VIDEOS.extensions);
        };

        return factory;
      };
    }
  ]);
