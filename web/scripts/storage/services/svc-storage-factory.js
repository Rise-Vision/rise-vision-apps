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
    }
  })
  .value('STORAGE_CLIENT_API', 'https://www.googleapis.com/storage/v1/b/')
  .factory('storageFactory', ['userState', '$filter', '$modal',
    'SELECTOR_TYPES', 'SELECTOR_FILTERS', 'STORAGE_CLIENT_API',
    function (userState, $filter, $modal, SELECTOR_TYPES, SELECTOR_FILTERS,
      STORAGE_CLIENT_API) {
      var factory = {
        storageIFrame: false,
        storageFull: true,
        selectorType: '',
        selectorFilter: SELECTOR_FILTERS.ALL,
        folderPath: ''
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

      factory.getBucketName = function () {
        return 'risemedialibrary-' + userState.getSelectedCompanyId();
      };

      factory.getFolderSelfLinkUrl = function () {
        return STORAGE_CLIENT_API + factory.getBucketName() + '/o?prefix=';
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

      var _isFilteredFile = function (file) {
        if (factory.fileIsFolder(file)) {
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
      }

      factory.canSelect = function (file) {
        return !factory.fileIsTrash(file) && !file.isThrottled &&
          (factory.fileIsFolder(file) && factory.isFolderSelector() ||
            !factory.fileIsFolder(file) && factory.isFileSelector()) &&
          !_isFilteredFile(file);
      };

      factory.isDisabled = function (file) {
        return _isFilteredFile(file) ||
          !factory.fileIsFolder(file) && !factory.isFileSelector();
      };

      factory.fileIsFolder = function (file) {
        return file.name.substr(-1) === '/' || file.name === '';
      };

      factory.fileIsTrash = function (file) {
        return file.name === '--TRASH--/';
      };

      factory.fileIsImage = function (file) {
        return _fileHasExtension(file, SELECTOR_FILTERS.IMAGES.extensions);
      }

      factory.fileIsVideo = function (file) {
        return _fileHasExtension(file, SELECTOR_FILTERS.VIDEOS.extensions);
      }


      factory.isTrashFolder = function () {
        return factory.folderPath === '--TRASH--/';
      };

      factory.addFolder = function () {
        $modal.open({
          templateUrl: 'partials/storage/new-folder-modal.html',
          controller: 'NewFolderModalCtrl',
          size: 'md'
        });
      };

      return factory;
    }
  ]);
