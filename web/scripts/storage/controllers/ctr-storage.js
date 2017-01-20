'use strict';
angular.module('risevision.storage.controllers')
  .controller('StorageController', ['$scope', 'storageFactory',
    function ($scope, storageFactory) {
      storageFactory.storageFull = true;
      storageFactory.setSelectorType();
    }
  ]);
