'use strict';

angular.module('risevision.common.components.scrolling-list')
  .factory('BatchOperations', ['$q', '$timeout',
    function ($q, $timeout) {
      return function (operations) {
        if (!operations) {
          return {};
        }

        operations.queueLimit = operations.queueLimit || 5;

        var queue;

        var _reset = function() {
          queue = [];

          operations.activeOperation = null;
          operations.progress = 0;
          operations.totalItemCount = 0;
          operations.completedItemCount = 0;
        };

        _reset();

        operations.batch = function (items, method, operation) {
          if (!items || !items.length || !method) {
            return $q.resolve();
          }

          var cancelled = false;
          var deferred = $q.defer();
          var currItem = 0;
          operations.activeOperation = operation;
          operations.totalItemCount += items.length;

          var _pushItem = function() {
            var item = items[currItem++];

            queue.push(item);

            _executeOperation(item);
          };

          var _executeOperation = function (item) {
            method(item)
              .finally(function() {
                _.remove(queue, function(listItem) {
                  return listItem === item;
                });

                operations.completedItemCount++;
                operations.progress = Math.round(operations.completedItemCount / operations.totalItemCount * 100);

                if (cancelled) {
                  return;
                } else if (operations.totalItemCount === operations.completedItemCount) {
                  deferred.resolve();

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

            deferred.resolve();
          };

          _loadBatch();

          return deferred.promise;
        };

        return operations;
      };
    }
  ]);
