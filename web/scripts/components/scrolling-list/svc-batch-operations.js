'use strict';

angular.module('risevision.common.components.scrolling-list')
  .factory('BatchOperations', ['$q', '$timeout',
    function ($q, $timeout) {
      return function () {
        var svc = {};
        svc.queueLimit = 5;

        var queue;

        var _reset = function() {
          queue = [];

          svc.activeOperation = '';
          svc.progress = 0;
          svc.totalItemCount = 0;
          svc.completedItemCount = 0;
        };

        _reset();

        svc.batch = function (items, method, name) {
          if (!items || !items.length || !method) {
            return $q.resolve();
          }

          var cancelled = false;
          var deferred = $q.defer();
          var currItem = 0;
          svc.activeOperation = name;
          svc.totalItemCount += items.length;

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

                svc.completedItemCount++;
                svc.progress = Math.round(svc.completedItemCount / svc.totalItemCount * 100);

                if (cancelled) {
                  return;
                } else if (svc.totalItemCount === svc.completedItemCount) {
                  deferred.resolve();

                  $timeout(_reset, 2000);
                } else if (queue.length < svc.queueLimit && currItem < items.length) {
                  _pushItem();
                }
              });
          };

          var _loadBatch = function () {
            while (queue.length < svc.queueLimit && currItem < items.length) {
              _pushItem();
            }
          };

          svc.cancel = function () {
            cancelled = true;

            _reset();

            deferred.resolve();
          };

          _loadBatch();

          return deferred.promise;
        };

        return svc;
      };
    }
  ]);
