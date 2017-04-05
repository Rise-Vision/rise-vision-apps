(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .directive('emptyState', ['SELECTOR_TYPES',
      function (SELECTOR_TYPES) {
        return {
          restrict: 'EA',
          templateUrl: 'partials/storage/empty-state.html',
          link: function ($scope) {
            $scope.isMultipleFilesFoldersSelector =
              $scope.storageFactory.selectorType === SELECTOR_TYPES.MULTIPLE_FILES_FOLDERS;
          }
        };
      }
    ]);
})();
