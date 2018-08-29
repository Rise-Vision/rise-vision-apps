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
              .then(function (files) {
                return $scope.uploader.addToQueue(files);
              })
              .then(function () {
                element.prop('value', null);
              });
          });
        }
      };
    }]);
})();
