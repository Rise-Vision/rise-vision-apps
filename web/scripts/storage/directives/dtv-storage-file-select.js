(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .directive('storageFileSelect', [function () {
      return {
        scope: {
          uploader: '='
        },
        link: function ($scope, element) {
          element.bind('change', function () {
            $scope.uploader.removeExif(this.files)
              .then($scope.uploader.compress)
              .then(function (fileItems) {
                return $scope.uploader.addToQueue(fileItems);
              })
              .then(function () {
                element.prop('value', null);
              });
          });
        }
      };
    }]);
})();
