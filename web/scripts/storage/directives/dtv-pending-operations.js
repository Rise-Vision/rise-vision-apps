(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .directive('pendingOperations', ['downloadFactory', 'pendingOperationsSvc',
      function (downloadFactory, pendingOperationsSvc) {
        return {
          restrict: 'E',
          scope: true,
          templateUrl: 'partials/storage/pending-operations-panel.html',
          link: function ($scope) {
            $scope.downloadFactory = downloadFactory;
            $scope.factory = pendingOperationsSvc;
          }
        };
      }
    ]);
})();
