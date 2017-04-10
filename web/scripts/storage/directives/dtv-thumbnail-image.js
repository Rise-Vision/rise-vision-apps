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
              var isSvg = false;
              var imgSrc =
                'https://s3.amazonaws.com/Rise-Images/Icons/file.png';

              if (file.isChecked) {
                classes.push('selected-border');
              }

              if (storageUtils.fileIsFolder(file)) {
                isSvg = true;
                imgSrc = 'riseWidgetFolder';
                classes.push('folder');
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
                    classes.push('placeholder-item');
                  }
                  if (scope.file.metadata && scope.file.metadata.thumbnail) {
                    imgSrc = scope.file.metadata.thumbnail +
                      '=s100-ci' + '?_=' + scope.file.timeCreated;
                  } else {
                    if (scope.storageFactory.fileIsImage(scope.file)) {
                      isSvg = true;
                      imgSrc = 'riseWidgetImage';
                    } else if (scope.storageFactory.fileIsVideo(scope
                        .file)) {
                      isSvg = true;
                      imgSrc = 'riseWidgetVideo';
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
