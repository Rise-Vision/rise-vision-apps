(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .directive('selectedFilesCount', [
      function () {
        return {
          restrict: 'EA',
          scope: {
            checkedItemsCount: '=',
          },
          templateUrl: 'partials/storage/selected-files-count.html',
        };
      }
    ]);
})();
