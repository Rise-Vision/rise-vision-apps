(function () {

  'use strict';

  // Declare legacy selector [error without it]
  angular.module('risevision.widget.common.storage-selector', []);
  angular.module('risevision.storage.directives')
    .directive('storageSelector', ['$modal', '$log', 'SELECTOR_TYPES',
      'storageFactory',
      function ($modal, $log, SELECTOR_TYPES, storageFactory) {
        return {
          restrict: 'EA',
          scope: {
            type: '@',
            label: '@',
            selected: '='
          },
          templateUrl: 'partials/storage/storage-selector.html',
          link: function ($scope) {
            storageFactory.storageFull = false;
            storageFactory.selectorType = $scope.type ?
              $scope.type : SELECTOR_TYPES.SINGLE_FILE;

            $scope.open = function () {
              $scope.modalInstance = $modal.open({
                templateUrl: 'partials/storage/storage-modal.html',
                controller: 'StorageSelectorModalController',
                size: 'lg'
              });

              $scope.modalInstance.result.then(function (files) {
                $log.info('Files selected: ' + files);

                // emit an event with name 'files', passing the array of files selected from storage and the selector type
                $scope.$emit('picked', files, storageFactory.selectorType);

              }, function () {

              });

            };
          }
        };
      }
    ]);
})();
