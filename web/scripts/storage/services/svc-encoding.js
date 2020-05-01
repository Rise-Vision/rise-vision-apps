'use strict';

angular.module('risevision.storage.services')
  .service('encoding', ['$log', 'storageAPILoader',
    function ($log, storageAPILoader) {
      $log.debug('Loading encoding service');

      var service = {};
      return service;
    }
  ]);
