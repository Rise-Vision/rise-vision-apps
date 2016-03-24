(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .directive('storageFileSelect', [function () {
      return {
        link: function (scope, element, attributes) {
          var uploader = scope.$eval(attributes.uploader);

          element.bind('change', function () {
            uploader.addToQueue(this.files).then(function () {
              element.prop('value', null);
            });
          });
        }
      };
    }]);
})();
