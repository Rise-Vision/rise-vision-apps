'use strict';
angular.module('risevision.storage.controllers')
  .controller('EmptyStateController', ['$scope', 'storageFactory',
    'SELECTOR_TYPES',
    function ($scope, storageFactory, SELECTOR_TYPES) {
      $scope.isMultipleFilesFoldersSelector =
        storageFactory.selectorType === SELECTOR_TYPES.MULTIPLE_FILES_FOLDERS;
    }
  ]);
