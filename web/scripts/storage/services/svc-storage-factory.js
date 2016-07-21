'use strict';
angular.module('risevision.storage.services')
  .value('SELECTOR_TYPES', {
    SINGLE_FILE: 'single-file',
    MULTIPLE_FILE: 'multiple-file',
    SINGLE_FOLDER: 'single-folder',
    MULTIPLE_FILES_FOLDERS: 'multiple-files-folders'
  })
  .value('STORAGE_CLIENT_API', 'https://www.googleapis.com/storage/v1/b/')
  .factory('storageFactory', ['userState', '$modal', 'SELECTOR_TYPES',
    'STORAGE_CLIENT_API',
    function (userState, $modal, SELECTOR_TYPES, STORAGE_CLIENT_API) {
      var factory = {
        storageIFrame: false,
        storageFull: true,
        selectorType: '',
        folderPath: ''
      };
      
      factory.setSelectorType = function (type) {
        factory.selectorType = SELECTOR_TYPES.SINGLE_FILE;

        for (var k in SELECTOR_TYPES) {
          if (type === SELECTOR_TYPES[k]) {
            factory.selectorType = SELECTOR_TYPES[k];
            
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

      factory.canSelect = function (file) {
        return !file.currentFolder && !factory.fileIsTrash(file) &&
          (factory.fileIsFolder(file) && factory.isFolderSelector() ||
            !factory.fileIsFolder(file) && factory.isFileSelector());
      };

      factory.fileIsCurrentFolder = function (file) {
        return file.name === factory.folderPath;
      };

      factory.fileIsFolder = function (file) {
        return file.name.substr(-1) === '/';
      };

      factory.fileIsTrash = function (file) {
        return file.name === '--TRASH--/';
      };

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
