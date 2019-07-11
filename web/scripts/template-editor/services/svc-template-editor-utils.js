'use strict';

angular.module('risevision.template-editor.services')
  .constant('NEED_FINANCIAL_DATA_LICENSE', ['rise-data-financial'])
  .constant('CONTACT_US_URL', 'https://www.risevision.com/contact-us')
  .factory('templateEditorUtils', ['messageBox', 'NEED_FINANCIAL_DATA_LICENSE', '$modal', '$templateCache', '$window',
    'CONTACT_US_URL',
    function (messageBox, NEED_FINANCIAL_DATA_LICENSE, $modal, $templateCache, $window, CONTACT_US_URL) {
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

      svc.needsFinancialDataLicense = function (blueprint) {
        if (!blueprint) {
          return false;
        }
        return _.some(blueprint.components, function (component) {
          return _.includes(NEED_FINANCIAL_DATA_LICENSE, component.type);
        });
      };

      svc.showFinancialDataLicenseRequiredMessage = function () {
        var modalInstance = $modal.open({
          template: $templateCache.get('partials/template-editor/confirm-modal.html'),
          controller: 'confirmInstance',
          windowClass: 'madero-style centered-modal financial-data-license-message',
          resolve: {
            confirmationTitle: function () {
              return 'Financial Data License Required';
            },
            confirmationMessage: function () {
              return 'This template requires a Financial Data License to show on your Display(s), if you need one please contact <a href="mailto:sales@risevision.com">sales@risevision.com</a> to purchase.';
            },
            confirmationButton: function () {
              return 'Contact Us';
            },
            cancelButton: function () {
              return 'Close';
            }
          }
        });

        modalInstance.result.then(function () {
          modalInstance.dismiss();
          $window.open(CONTACT_US_URL, '_blank');
        });
      };

      return svc;
    }
  ]);
