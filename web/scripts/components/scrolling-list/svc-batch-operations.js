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

          svc.isActive = false;
          svc.progress = 0;
          svc.totalItemCount = 0;
          svc.completedItemCount = 0;
        };

        _reset();

        svc.batch = function (items, method) {
          if (!items || !items.length || !method) {
            return $q.resolve();
          }

          var deferred = $q.defer();
          var currItem = 0;
          svc.isActive = true;        
          svc.totalItemCount += items.length;

          var _executeOperation = function (item, method) {
            method(item)
              .finally(function() {
                _.remove(queue, function(listItem) {
                  return listItem === item;
                });

                svc.completedItemCount++;
                svc.progress = Math.round(svc.completedItemCount / svc.totalItemCount * 100);

                if (svc.totalItemCount === svc.completedItemCount) {
                  deferred.resolve();

                  _reset();
                }
              });
          };

          var loadBatch = function () {
            if (currItem < items.length) {
              while (queue.length < svc.queueLimit && currItem < items.length) {
                var item = items[currItem++];

                queue.push(item);

                _executeOperation(item, method);
              }

              $timeout(loadBatch, 500);
            }
          };

          loadBatch();

          return deferred.promise;
        };

        return svc;
      };
    }
  ]);
