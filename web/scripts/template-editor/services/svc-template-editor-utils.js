'use strict';

angular.module('risevision.template-editor.services')
  .factory('templateEditorUtils', ['messageBox',
    function (messageBox) {
      var svc = {};

      svc.intValueFor = function (providedValue, defaultValue) {
        var intValue = parseInt(providedValue, 10);

        return isNaN(intValue) ? defaultValue : intValue;
      };

      svc.fileNameOf = function (path) {
        return path.split('/').pop();
      };

      svc.addOrRemove = function (list, oldItem, newItem) {
        var idx = _.findIndex(list, oldItem);

        if (idx >= 0) {
          list.splice(idx, 1);
        } else {
          list.push(newItem);
        }

        return list;
      };

      svc.addOrReplaceAll = function (list, oldItem, newItem) {
        var matchCount = 0;

        for (var i = 0; i < list.length; i++) {
          var item = list[i];

          if (_.isMatch(item, oldItem)) {
            matchCount++;
            list.splice(i, 1, newItem);
          }
        }

        if (matchCount === 0) {
          list.push(newItem);
        }
      };

      svc.isFolder = function (path) {
        return path[path.length - 1] === '/';
      };

      svc.fileNameOf = function (path) {
        var parts = path.split('/');

        if (svc.isFolder(path)) {
          return parts[parts.length - 2];
        } else {
          return parts.pop();
        }
      };

      svc.fileHasValidExtension = function (file, extensions) {
        return !extensions || extensions.length === 0 || _.some(extensions, function (extension) {
          return _.endsWith(file.toLowerCase(), extension.trim().toLowerCase());
        });
      };

      svc.hasRegularFileItems = function (folderItems) {
        var regularFiles = _.filter(folderItems, function (item) {
          return !svc.isFolder(item.name);
        });

        return regularFiles.length > 0;
      };

      svc.findElement = function (selector) {
        return document.querySelector(selector) && angular.element(document.querySelector(selector));
      };

      svc.showMessageWindow = function (title, message, buttonLabel) {
        var partial = 'partials/template-editor/message-box.html';
        var windowClass = 'madero-style centered-modal';

        messageBox(title, message, buttonLabel, windowClass, partial);
      };

      svc.showInvalidExtensionsMessage = function (validExtensions) {
        var title = 'This file type is not supported';
        var message = svc.getValidExtensionsMessage(validExtensions);

        svc.showMessageWindow(title, message);
      };

      svc.getValidExtensionsMessage = function (validExtensions) {
        var prefix = validExtensions;
        var suffix = '';

        if (validExtensions.length > 1) {
          prefix = validExtensions.slice(0, validExtensions.length - 1);
          suffix = ' and ' + validExtensions[validExtensions.length - 1].toUpperCase();
        }

        return 'Rise Vision supports ' + prefix.join(', ').toUpperCase() + suffix + '.';
      };

      return svc;
    }
  ]);
