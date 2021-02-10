'use strict';

/* Filters */
angular.module('risevision.storage.filters')
  .filter('fileTypeFilter', ['$filter', function ($filter) {
    var folderLabel = $filter('translate')('common.folder');

    return function (filename) {
      var re = /(?:\.([^.]+))?$/;

      if (filename.substr(-1) === '/') {
        return folderLabel;
      }

      var ext = re.exec(filename)[1];

      if (ext && ext.length <= 4) {
        ext = ext.toUpperCase();
        return ext;
      }

      return '';
    };
  }])
  .filter('fileNameFilter', ['$filter', function ($filter) {
    var trash = '--TRASH--/';

    var trashLabel = $filter('translate')('storage-client.trash');

    return function (filename, currentFolder) {
      var returnValue = filename;

      if (currentFolder && currentFolder.length > 0) {
        if (filename === currentFolder) {
          returnValue = filename.substr(0, filename.lastIndexOf('/',
            filename.length - 2) + 1);
        } else if (filename.indexOf(currentFolder) !== -1) {
          returnValue = filename.substr(currentFolder.length);
        }
      } else if (filename === trash) {
        returnValue = filename;
      }

      return (returnValue || '/').replace(trash, trashLabel + '/');
    };
  }])
  .filter('fileSizeFilter', function () {
    return function (size) {
      var sizeString = '';
      if (size === 0) {
        return '0 bytes';
      }

      if (!size) {
        return '';
      }

      if (size < 1000) {
        sizeString = size + ' bytes';
      } else if (size > 1024 && size < Math.pow(1024, 2)) {
        sizeString = Math.floor(size / (1024 / 10)) / 10.0 + ' KB';
      } else if (size >= Math.pow(1024, 2) && size < Math.pow(1024, 3)) {
        sizeString = Math.floor(size / (Math.pow(1024, 2) / 10)) / 10.0 +
          ' MB';
      } else if (size >= Math.pow(1024, 3)) {
        sizeString = Math.floor(size / (Math.pow(1024, 3) / 10)) / 10.0 +
          ' GB';
      }

      return sizeString;
    };
  })
  .filter('bandwidthUseFilter', ['fileSizeFilterFilter', '$translate',
    function (fileSizeFilter, $translate) {
      var lessThan1MB = '';

      $translate('storage-client.lessThan1MB').then(function (value) {
        lessThan1MB = value;
      });

      return function bandwidthUseFilter(bytes) {
        if (isNaN(bytes)) {
          return bytes;
        }

        return parseInt(bytes, 10) / Math.pow(1024, 2) < 1 ? lessThan1MB :
          fileSizeFilter(bytes);
      };
    }
  ])
  .filter('groupBy', function () {
    return function (items, groupedBy) {
      if (items) {
        var finalItems = [],
          thisGroup;
        for (var i = 0; i < items.length; i++) {
          if (!thisGroup) {
            thisGroup = [];
          }
          thisGroup.push(items[i]);
          if (((i + 1) % groupedBy) === 0) {
            finalItems.push(thisGroup);
            thisGroup = null;
          }
        }
        if (thisGroup) {
          finalItems.push(thisGroup);
        }
        return finalItems;
      }
    };
  })
  .filter('trashItemFilter', [function () {
    return function (itemName) {
      var trash = '--TRASH--/';

      if (itemName && itemName.indexOf(trash) === 0) {
        return itemName.substr(trash.length);
      } else {
        return itemName;
      }
    };
  }]);
