'use strict';

angular.module('risevision.storage.services')
  .service('encoding', ['$log', '$http', 'storageAPILoader',
    function ($log, $http, storageAPILoader) {
      $log.debug('Loading encoding service');

      var switchURL = 'https://storage.googleapis.com/risemedialibrary/encoding-switch';
      var masterSwitch = false;
      $http({method: 'HEAD', url: switchURL})
      .then(function () {masterSwitch = true;}, function () {masterSwitch = false;});

      var service = {};
      return service;
    }
  ]);
