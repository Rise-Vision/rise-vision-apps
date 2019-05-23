'use strict';

angular.module('risevision.template-editor.services')
  .factory('templateEditorUtils', ['messageBox', function (messageBox) {
    var svc = {};

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

    svc.addOrReplace = function (list, oldItem, newItem) {
      var idx = _.findIndex(list, oldItem);

      if (idx >= 0) {
        list.splice(idx, 1, newItem);
      } else {
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

    svc.findElement = function (selector) {
      return document.querySelector(selector) && angular.element(document.querySelector(selector));
    };

    svc.showMessageWindow = function (title, message, buttonLabel) {
      var partial = 'partials/template-editor/message-box.html';
      var windowClass = 'template-editor-message-box';

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
  }]);
