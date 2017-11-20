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
                'https://cdn2.hubspot.net/hubfs/2700250/storage-file-icon@2x.png';

              if (file.isChecked) {
                classes.push('list-item--selected');
              }

              if (storageUtils.fileIsFolder(file)) {
                isSvg = true;
                imgSrc = 'https://cdn2.hubspot.net/hubfs/2700250/storage-folder-icon@2x.png';
                classes.push('list-item_folder');
                if (file.isChecked) {
                  classes.push('folder-extended');
                }
              } else {
                classes.push('single-item');
                if (file.isThrottled) {
                  classes.push('throttled-item');
                  imgSrc =
                    'http://s3.amazonaws.com/Rise-Images/Icons/file_throttled.png';
                } else {
                  if (!scope.storageFactory.canSelect(file) ||
                    scope.storageFactory.isDisabled(file)) {
                    classes.push('disabled-item');
                    isDisabled = true;
                  } else {
                    classes.push('list-type_image');
                  }
                  if (scope.file.metadata && scope.file.metadata.thumbnail) {
                    isSvg = false;
                    imgSrc = scope.file.metadata.thumbnail +
                      '' + '?_=' + scope.file.timeCreated;
                  } else {
                    if (scope.storageFactory.fileIsImage(scope.file)) {
                      isSvg = true;
                      imgSrc = 'https://cdn2.hubspot.net/hubfs/2700250/storage-file-icon@2x.png';
                    } else if (scope.storageFactory.fileIsVideo(scope
                        .file)) {
                      isSvg = true;
                      imgSrc = 'https://cdn2.hubspot.net/hubfs/2700250/storage-video-icon@2x.png';
                    }
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
