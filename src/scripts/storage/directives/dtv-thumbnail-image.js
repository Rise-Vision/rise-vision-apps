(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .directive('thumbnailImage', ['storageUtils',
      function (storageUtils) {
        return {
          restrict: 'A',
          link: function (scope) {
            scope.$watch('file', function (file) {
              var classes = [];
              var isDisabled = false;
              var isSvg = true;
              var imgSrc =
                'https://s3.amazonaws.com/Rise-Images/UI/storage-file-icon%402x.png';

              if (file.isChecked) {
                classes.push('list-item--selected');
              }

              if (storageUtils.fileIsFolder(file)) {
                imgSrc = 'https://s3.amazonaws.com/Rise-Images/UI/storage-folder-icon%402x.png';
                classes.push('list-item_folder');
              } else {
                classes.push('single-item');
                if (file.isThrottled) {
                  classes.push('list-item--throttled');
                } else {
                  if (!scope.storageFactory.canSelect(file) ||
                    scope.storageFactory.isDisabled(file)) {
                    classes.push('list-item--disabled');
                    isDisabled = true;
                  } else {
                    classes.push('list-type_image');
                  }

                  if (scope.file.metadata && scope.file.metadata.thumbnail) {
                    isSvg = false;
                    imgSrc = scope.file.metadata.thumbnail + '?_=' +
                      (scope.file.timeCreated && scope.file.timeCreated.value);
                    if (imgSrc.indexOf('http://') === 0) {
                      imgSrc = imgSrc.replace('http://', 'https://');
                    }
                  } else if (scope.storageFactory.fileIsImage(scope.file)) {
                    imgSrc = 'https://s3.amazonaws.com/Rise-Images/UI/storage-image-icon%402x.png';
                  } else if (scope.storageFactory.fileIsVideo(scope.file)) {
                    imgSrc = 'https://s3.amazonaws.com/Rise-Images/UI/storage-video-icon%402x.png';
                  }
                }
              }

              scope.gridItemClasses = classes;
              scope.imgClasses = isDisabled && !file.isThrottled ?
                'disabled' : '';
              scope.imgSrc = imgSrc;
              scope.isSvg = isSvg;
            }, true);
          }
        };
      }
    ]);
})();
