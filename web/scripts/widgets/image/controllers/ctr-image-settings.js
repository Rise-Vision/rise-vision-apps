'use strict';

angular.module('risevision.widgets.image')
  .controller('ImageSettingsController', ['$scope', '$rootScope',
    'commonSettings',
    function ($scope, $rootScope, commonSettings) {
      $scope.isFolder = false;

      $scope.$on('fileSelectorClick', function (event, type) {
        $scope.isFolder = (type === 'single-folder') ? true : false;
      });

      $scope.$watch('settings.additionalParams.selector.url', function (url) {
        if (typeof url !== 'undefined' && url !== '') {
          $scope.settings.additionalParams.storage = commonSettings.getStorageUrlData(url);
        }
      });

      // Legacy URL setting
      $scope.$watch('settings.additionalParams.url', function (url) {
        var storage = {};

        if (typeof url !== 'undefined' && url !== '') {
          storage = commonSettings.getStorageUrlData(url);

          if (Object.keys(storage).length !== 0) {
            // Storage file
            $scope.settings.additionalParams.selector = {
              'selection': 'single-file',
              'storageName': storage.folder + storage.fileName,
              'url': url
            };
          } else {
            // Third party file
            $scope.settings.additionalParams.selector = {
              'selection': 'custom',
              'storageName': '',
              'url': url
            };
          }

          // ensure this value is empty so it no longer gets used
          $scope.settings.additionalParams.url = '';
        }
      });

      $scope.$watch('settings.additionalParams.resume', function (resume) {
        if (typeof resume === 'undefined') {
          $scope.settings.additionalParams.resume = true;
        }
      });

    }
  ]);
