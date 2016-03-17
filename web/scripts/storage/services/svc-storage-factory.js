'use strict';
angular.module('risevision.storage.services')
  .value('SELECTOR_TYPES', {
    SINGLE_FILE: 'single-file',
    MULTIPLE_FILE: 'multiple-file',
    SINGLE_FOLDER: 'single-folder'
  })
  .factory('storageFactory', ['$modal', 'SELECTOR_TYPES',
    function ($modal, SELECTOR_TYPES) {
      var factory = {
        storageIFrame: false,
        storageFull: true,
        selectorType: '',
        folderPath: ''
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
