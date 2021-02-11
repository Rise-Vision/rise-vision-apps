(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .directive('pendingOperations', ['downloadFactory',
      'pendingOperationsFactory',
      function (downloadFactory, pendingOperationsFactory) {
        return {
          restrict: 'E',
          scope: true,
          templateUrl: 'partials/storage/pending-operations-panel.html',
          link: function ($scope) {
            $scope.downloadFactory = downloadFactory;
            $scope.factory = pendingOperationsFactory;
          }
        };
      }
    ]);
})();
