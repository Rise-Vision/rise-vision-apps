'use strict';

angular.module('risevision.displays.services')
  .value('SCREEN_CONTROL_BUCKET', 'risevision-display-notifications')
  .value('SCREEN_CONTROL_FILENAME', 'screen-control.txt')
  .factory('displayControlFactory', ['$q', '$http', '$modal', 'displayFactory', 'display',
    'STORAGE_FILE_URL', 'SCREEN_CONTROL_BUCKET', 'SCREEN_CONTROL_FILENAME',
    function ($q, $http, $modal, displayFactory, displayService,
      STORAGE_FILE_URL, SCREEN_CONTROL_BUCKET, SCREEN_CONTROL_FILENAME) {
      var service = {};

      service.getConfiguration = function () {
        var deferred = $q.defer();
        var display = displayFactory.display;
        var bucketName = SCREEN_CONTROL_BUCKET;
        var configUrl = STORAGE_FILE_URL + bucketName + '/' + display.id + '/' + SCREEN_CONTROL_FILENAME;

        $http.get(configUrl)
          .then(function (resp) {
            if (resp.data) {
              display.screenControlConfiguration = resp.data;

              deferred.resolve(resp.data);
            } else {
              deferred.reject('Configuration file is empty: ' + resp.data);
            }
          })
          .catch(function (err) {
            if (err && err.code && err.code === 'InvalidBucketName') {
              deferred.reject(err);

              console.log('Configuration bucket is missing: ' + bucketName);
            } else {
              deferred.reject(err);
            }
          });

        return deferred.promise;
      };

      service.updateConfiguration = function (config) {
        var display = displayFactory.display;

        return displayService.uploadControlFile(display.id, config);
      };

      service.getDefaultConfiguration = function () {
        return 'interface=\n' +
          'serial-port=\n' +
          'serial-baud-rate=\n' +
          'serial-data-bits=\n' +
          'serial-parity=\n' +
          'serial-stop-bits=\n' +
          'serial-flow-control=\n' +
          'serial-screen-on-cmd=\n' +
          'serial-screen-off-cmd=';
      };

      service.openDisplayControlModal = function () {
        return $modal.open({
          templateUrl: 'partials/displays/display-control-modal.html',
          size: 'lg',
          controller: 'DisplayControlModalCtrl'
        });
      };

      return service;
    }
  ]);
