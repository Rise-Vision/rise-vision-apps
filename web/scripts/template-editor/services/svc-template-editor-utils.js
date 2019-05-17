'use strict';

angular.module('risevision.template-editor.services')
  .factory('templateEditorUtils', [function () {
      var svc = {};

      svc.fileNameOf = function(path) {
        return path.split('/').pop();
      };

      svc.addOrRemove = function (list, oldItem, newItem) {
        var idx = _.findIndex(list, oldItem);

        if (idx >= 0) {
          list.splice(idx, 1);
        }
        else {
          list.push(newItem);
        }

        return list;
      };

      svc.addOrReplace = function (list, oldItem, newItem) {
        var idx = _.findIndex(list, oldItem);

        if (idx >= 0) {
          list.splice(idx, 1, newItem);
        }
        else {
          list.push(newItem);
        }

        return list;
      };

      svc.isFolder = function (path) {
        return path[path.length - 1] === '/';
      };

      svc.fileHasValidExtension = function (file, extensions) {
        return !extensions || extensions.length === 0 || _.some(extensions, function (extension) {
          return _.endsWith(file.toLowerCase(), extension.trim().toLowerCase());
        });
      };

      return svc;
    }]);
