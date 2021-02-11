'use strict';
angular.module('risevision.storage.services')
  .factory('pendingOperationsFactory', [
    function () {
      var factory = {};

      factory.pendingOperations = [];
      factory.isPOCollapsed = true;
      factory.statusDetails = {
        code: 200,
        message: ''
      };

      var _clearFailedOperations = function () {
        for (var i = factory.pendingOperations.length - 1; i >= 0; i--) {
          if (factory.pendingOperations[i].actionFailed) {
            factory.pendingOperations[i].actionFailed = false;

            factory.pendingOperations.splice(i, 1);
          }
        }
      };

      factory.addPendingOperation = function (file, action) {
        _clearFailedOperations();

        if (!findByFileName(file.name)) {
          file.action = action;
          file.actionFailed = false;

          factory.pendingOperations.push(file);
        }
      };

      factory.addPendingOperations = function (files, action) {
        files.forEach(function (file) {
          factory.addPendingOperation(file, action);
        });
      };

      factory.removePendingOperation = function (file) {
        var existing = findByFileName(file.name);
        var position = existing ? factory.pendingOperations.indexOf(
          existing) : -1;

        if (position >= 0) {
          factory.pendingOperations[position].actionFailed = false;

          factory.pendingOperations.splice(position, 1);
        }
      };

      factory.removePendingOperations = function (pendingFiles) {
        // Removed completed pending operations
        for (var i = factory.pendingOperations.length - 1; i >= 0; i--) {
          var file = factory.pendingOperations[i];

          if (pendingFiles.indexOf(file) >= 0) {
            factory.pendingOperations.splice(i, 1);
          }
        }
      };

      factory.getActivePendingOperations = function () {
        return factory.pendingOperations.filter(function (op) {
          return !op.actionFailed;
        });
      };

      factory.markPendingOperationFailed = function (file) {
        var existing = findByFileName(file.name);

        if (existing) {
          file.actionFailed = true;
        }
      };

      function findByFileName(fileName) {
        var existing = factory.pendingOperations.filter(function (f) {
          return f.name === fileName;
        });

        return existing.length > 0 ? existing[0] : null;
      }

      return factory;
    }
  ]);
