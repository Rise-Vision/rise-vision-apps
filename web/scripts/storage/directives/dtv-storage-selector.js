(function () {

  'use strict';

  // Declare legacy selector [error without it]
  angular.module('risevision.widget.common.storage-selector', []);
  angular.module('risevision.storage.directives')
    .directive('storageSelector', ['storageUtils',
      function (storageUtils) {
        return {
          restrict: 'EA',
          scope: {
            type: '@',
            label: '@',
            selected: '='
          },
          templateUrl: 'partials/storage/storage-selector.html',
          link: function ($scope) {
            $scope.open = function () {
              storageUtils.openSelector($scope.type)
                .then(function (files) {
                  var fileUrls = storageUtils.getFileUrls(files);

                  // emit an event with name 'files', passing the array of files selected from storage and the selector type
                  $scope.$emit('picked', fileUrls, $scope.type);
                });
            };

          }
        };
      }
    ]);
})();
