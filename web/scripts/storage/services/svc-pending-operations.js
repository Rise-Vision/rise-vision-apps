'use strict';
angular.module('risevision.storage.services')
  .factory('pendingOperationsSvc', [
    function () {
      var factory = {};

      factory.pendingOperations = [];
      factory.isPOCollapsed = true;

      factory.addPendingOperation = function (file, action) {
        if(!findByFileName(file.name)) {
          file.action = action;

          factory.pendingOperations.push(file);
        }
      };

      factory.addPendingOperations = function (files, action) {
        files.forEach(function(file) {
          factory.addPendingOperation(file, action);
        });
      };

      factory.removePendingOperation = function (file) {
        var existing = findByFileName(file.name);
        var position = existing ? factory.pendingOperations.indexOf(existing) : -1;

        if (position >= 0) {
          factory.pendingOperations.splice(position, 1);
        }
      };

      factory.removePendingOperations = function(pendingFiles) {
        // Removed completed pending operations
        for (var i = factory.pendingOperations.length - 1; i >= 0; i--) {
          var file = factory.pendingOperations[i];

          if (pendingFiles.indexOf(file) >= 0) {
            factory.pendingOperations.splice(i, 1);
          }
        }
      };

      factory.getActivePendingOperations = function () {
        console.log("Getting active blah", factory.pendingOperations);
        return factory.pendingOperations.filter(function (op) {
          return !op.actionFailed;
        });
      };

      function findByFileName(fileName) {
        var existing = factory.pendingOperations.filter(function(f) {
          return f.name === fileName;
        });

        return existing.length > 0 ? existing[0] : null;
      }

      return factory;
    }
  ]);
