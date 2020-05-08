'use strict';

angular.module('risevision.template-editor.services')
  .factory('templateEditorUtils', ['messageBox', '$window',
    function (messageBox, $window) {
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

      svc.isStaging = function () {
        try {
          var hostname = $window.location.hostname;

          return hostname.includes('apps-stage-');
        } catch (err) {
          console.log('can\'t access hostname of window.location');
        }

        return false;
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

      svc.repeat = function (value, times) {
        var items = [];

        for (var i = 0; i < times; i++) {
          items.push(value);
        }

        return items;
      };

      svc.padNumber = function (number, minLength) {
        var numberStr = String(number);
        var numberLen = numberStr.length || 0;

        if (numberLen < minLength) {
          return svc.repeat('0', minLength - numberLen).join('') + numberStr;
        } else {
          return numberStr;
        }
      };

      svc.formatISODate = function (dateString) {
        var date = new Date(dateString);

        if (isNaN(date.getTime())) {
          return null;
        } else {
          return svc.padNumber(date.getUTCFullYear(), 4) + '-' + svc.padNumber(date.getUTCMonth() + 1, 2) + '-' +
            svc.padNumber(date.getUTCDate(), 2);
        }
      };

      svc.absoluteTimeToMeridian = function (timeString) {
        var regex = /^(\d{1,2}):(\d{1,2})$/;
        var parts = regex.exec(timeString);

        if (parts) {
          var hours = Number(parts[1]);
          var minutes = Number(parts[2]);
          var meridian = hours >= 12 ? 'PM' : 'AM';

          if (hours >= 24) {
            return null;
          } else if (hours === 0) {
            hours = 12;
          } else if (hours > 12) {
            hours = hours % 12;
          }

          if (minutes >= 60) {
            return null;
          }

          return svc.padNumber(hours, 2) + ':' + svc.padNumber(minutes, 2) + ' ' + meridian;
        } else {
          return null;
        }
      };

      svc.meridianTimeToAbsolute = function (timeString) {
        var regex = /^(\d{1,2}):(\d{1,2}) (\D{2})$/;
        var parts = regex.exec(timeString);

        if (parts) {
          var meridian = parts[3];
          var hours = Number(parts[1]) + (meridian === 'PM' ? 12 : 0);
          var minutes = Number(parts[2]);

          if (hours > 24) {
            return null;
          } else if (hours === 12) {
            hours = 0;
          } else if (hours === 24) {
            hours = 12;
          }

          if (minutes >= 60) {
            return null;
          }

          if (meridian !== 'AM' && meridian !== 'PM') {
            return null;
          }

          return svc.padNumber(hours, 2) + ':' + svc.padNumber(minutes, 2);
        } else {
          return null;
        }
      };

      return svc;
    }
  ]);
