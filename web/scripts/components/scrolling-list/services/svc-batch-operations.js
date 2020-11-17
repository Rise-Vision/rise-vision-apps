'use strict';

angular.module('risevision.common.components.scrolling-list')
  .factory('BatchOperations', ['$q', '$timeout', 'batchOperationsTracker',
    function ($q, $timeout, batchOperationsTracker) {
      return function (operations) {
        if (!operations) {
          return {};
        }

        operations.queueLimit = operations.queueLimit || 1;

        var queue;

        var _reset = function () {
          queue = [];
          operations.hasErrors = false;
          operations.error = null;
          operations.activeOperation = null;
          operations.progress = 0;
          operations.totalItemCount = 0;
          operations.completedItemCount = 0;
        };

        _reset();

        operations.batch = function (items, method, operation, args) {
          if (!items || !items.length || !method) {
            return $q.resolve();
          }

          batchOperationsTracker('Batch Operation Started', operation, items);

          var cancelled = false;
          var deferred = $q.defer();
          var currItem = 0;
          operations.activeOperation = operation;
          operations.totalItemCount += items.length;

          var _pushItem = function () {
            var item = items[currItem++];

            queue.push(item);

            _executeOperation(item, args);
          };

          var _executeOperation = function (item, args) {
            method(item, args)
              .catch(function (err) {
                operations.hasErrors = true;
                operations.error = operations.error || err;
              })
              .finally(function () {
                _.remove(queue, function (listItem) {
                  return listItem === item;
                });

                operations.completedItemCount++;
                operations.progress = Math.round(operations.completedItemCount / operations.totalItemCount *
                  100);

                if (cancelled) {
                  return;
                } else if (operations.totalItemCount === operations.completedItemCount) {
                  if (operations.hasErrors) {
                    deferred.reject();
                  } else {
                    deferred.resolve();
                  }

                  $timeout(_reset, 2000);
                } else if (queue.length < operations.queueLimit && currItem < items.length) {
                  _pushItem();
                }
              });
          };

          var _loadBatch = function () {
            while (queue.length < operations.queueLimit && currItem < items.length) {
              _pushItem();
            }
          };

          operations.cancel = function () {
            cancelled = true;

            _reset();

            deferred.reject('cancelled');
          };

          _loadBatch();

          return deferred.promise
            .then(function() {
              batchOperationsTracker('Batch Operation Succeeded', operation, items);
            })
            .catch(function(err) {
              batchOperationsTracker('Batch Operation Failed', operation, items, {
                failureReason: err || ''
              });
              return $q.reject(err || operations.error);
            });
        };

        return operations;
      };
    }
  ]);
