'use strict';

angular.module('risevision.widgets.services')
  .constant('STORAGE_FILE_URL_BASE', 'storage.googleapis.com/risemedialibrary-')
  .constant('STORAGE_FOLDER_URL_BASE', 'googleapis.com/storage/')
  .factory('commonSettings', ['STORAGE_FILE_URL_BASE', 'STORAGE_FOLDER_URL_BASE',
    function (STORAGE_FILE_URL_BASE, STORAGE_FOLDER_URL_BASE) {

      var factory = {};

      var _getStorageType = function (storageUrl) {
        if (storageUrl.indexOf(STORAGE_FILE_URL_BASE) !== -1) {
          return 'file';
        }

        if (storageUrl.indexOf(STORAGE_FOLDER_URL_BASE) !== -1) {
          return 'folder';
        }

        return null;
      };

      var _getCompanyId = function (storageUrl) {
        var p = storageUrl.split('risemedialibrary-');

        return p[1].slice(0, p[1].indexOf('/'));
      };

      factory.getStorageUrlData = function (url) {
        var storage = {};

        if (_getStorageType(url) === 'file') {
          var str = url.split(STORAGE_FILE_URL_BASE)[1];
          str = decodeURIComponent(str.slice(str.indexOf('/') + 1));
          var arr = str.split('/');

          storage.companyId = _getCompanyId(url);
          storage.fileName = arr.pop();
          storage.folder = arr.length > 0 ? arr.join('/') : '';

          if (storage.folder !== '') {
            // add ending '/' to the folder path
            storage.folder += '/';
          }
        } else if (_getStorageType(url) === 'folder') {
          var params = url.split('?');

          for (var i = 0; i < params.length; i++) {
            var pair = params[i].split('=');

            if (pair[0] === 'prefix' && typeof pair[1] !== 'undefined' && pair[1] !== '') {
              storage.companyId = _getCompanyId(url);
              storage.folder = decodeURIComponent(pair[1]);
              storage.fileName = '';
              break;
            }
          }
        }

        return storage;
      };

      return factory;
    }
  ]);
