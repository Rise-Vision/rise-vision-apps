'use strict';
angular.module('risevision.storage.services')
  .value('SELECTOR_TYPES', {
    SINGLE_FILE: 'single-file',
    MULTIPLE_FILE: 'multiple-file',
    SINGLE_FOLDER: 'single-folder'
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

      factory.getBucketName = function () {
        return 'risemedialibrary-' + userState.getSelectedCompanyId();
      };

      factory.getFolderSelfLinkUrl = function () {
        return STORAGE_CLIENT_API + factory.getBucketName() + '/o?prefix=';
      };

      factory.isSingleFileSelector = function () {
        return factory.selectorType === SELECTOR_TYPES.SINGLE_FILE;
      };

      factory.isMultipleFileSelector = function () {
        return factory.selectorType === SELECTOR_TYPES.MULTIPLE_FILE;
      };

      factory.isSingleFolderSelector = function () {
        return factory.selectorType === SELECTOR_TYPES.SINGLE_FOLDER;
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
