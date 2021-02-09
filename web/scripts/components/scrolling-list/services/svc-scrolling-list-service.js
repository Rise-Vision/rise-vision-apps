'use strict';

angular.module('risevision.common.components.scrolling-list')
  .service('ScrollingListService', ['$log', 'BaseList', 'BatchOperations', 'processErrorCode',
    function ($log, BaseList, BatchOperations, processErrorCode) {
      return function (listService, search, listOperations) {
        var DB_MAX_COUNT = 40; //number of records to load at a time
        var factory = {};

        factory.items = new BaseList(DB_MAX_COUNT);
        factory.batchOperations = new BatchOperations(listOperations);

        factory.search = search ? search : {};
        _.defaults(factory.search, {
          sortBy: 'name',
          count: DB_MAX_COUNT,
          reverse: false,
          name: 'Items',
          selectAll: false
        });

        var _clearMessages = function () {
          factory.loadingItems = false;

          factory.errorMessage = '';
          factory.apiError = '';
        };

        var _clearList = function () {
          factory.items.clear();
          factory.search.selectAll = false;
        };

        factory.load = function () {
          _clearMessages();

          if (!factory.items.list.length || !factory.items.endOfList &&
            factory.items.cursor) {
            factory.loadingItems = true;

            listService(factory.search, factory.items.cursor)
              .then(function (result) {
                factory.items.add(result.items ? result.items : [], result.cursor || result.nextPageToken);

                factory.search.selectAll = false;
              })
              .then(null, function (e) {
                factory.errorMessage = 'Failed to load ' + factory.search.name + '.';
                factory.apiError = processErrorCode(factory.search.name, 'load', e);

                $log.error(factory.errorMessage, e);
              })
              .finally(function () {
                factory.loadingItems = false;
              });
          }
        };

        factory.load();

        factory.sortBy = function (cat) {
          _clearList();

          if (cat !== factory.search.sortBy) {
            factory.search.sortBy = cat;
            factory.search.reverse = false;
          } else {
            factory.search.reverse = !factory.search.reverse;
          }

          factory.load();
        };

        factory.doSearch = function () {
          _clearList();

          factory.load();
        };

        factory.getSelected = function () {
          return _.filter(factory.items.list, {
            selected: true
          });
        };

        var _filterSelected = function (selected, filter) {
          return _.filter(selected, filter);
        };

        var _groupBySelected = function (selected, groupBy) {
          return _.chain(selected)
            .groupBy(groupBy)
            .map(function (value, key) {
              var result = {};

              result[groupBy] = key;
              result.items = value;

              return result;
            })
            .value();
        };

        var _allSelected = function () {
          var deselectedIndex = _.findIndex(factory.items.list, function (item) {
            return !item.selected;
          });

          return deselectedIndex === -1;
        };

        factory.select = function (item) {
          if (!item) {
            return;
          }

          item.selected = !item.selected;

          factory.search.selectAll = _allSelected();
        };

        factory.selectAll = function () {
          if (!factory.items.list.length) {
            return;
          }

          factory.search.selectAll = !factory.search.selectAll;

          factory.items.list.forEach(function (item) {
            item.selected = factory.search.selectAll;
          });
        };

        factory.deselectAll = function () {
          if (!factory.items.list.length) {
            return;
          }

          factory.search.selectAll = false;

          factory.items.list.forEach(function (item) {
            item.selected = false;
          });
        };

        var _getExecuteAction = function (operation) {
          var originalAction = operation.actionCall;

          return function (item, args) {
            return originalAction(item, args)
              .then(function () {
                if (operation.isDelete) {
                  _.remove(factory.items.list, function (listItem) {
                    return listItem === item;
                  });
                }
              })
              .catch(function (e) {
                $log.error(processErrorCode(e), e);

                if (!factory.errorMessage) {
                  factory.errorMessage = 'Something went wrong.';
                  factory.apiError = 'We weren\'t able to perform \'' + operation.name.toLowerCase() +
                    '\' in one or more of the selected ' +
                    factory.search.name.toLowerCase() + '. Please try again.';
                }
                throw e;
              });
          };
        };

        var _updateSelectedAction = function (operation) {
          var execute = _getExecuteAction(operation);

          operation.onClick = function (skipBeforeBatchAction) {
            var selected = factory.getSelected();

            if (!selected.length) {
              return;
            }

            if (operation.filter) {
              selected = _filterSelected(selected, operation.filter);
            }

            var batchSelected = selected;
            if (operation.groupBy) {
              batchSelected = _groupBySelected(selected, operation.groupBy);
            }

            _clearMessages();

            var batchAction;
            if (operation.beforeBatchAction && !skipBeforeBatchAction) {
              batchAction = operation.beforeBatchAction(selected)
                .then(function (args) {
                  return factory.batchOperations.batch(batchSelected, execute, operation, args);
                });
            } else {
              batchAction = factory.batchOperations.batch(batchSelected, execute, operation, null);
            }

            return batchAction.then(function () {
              if (!factory.errorMessage && operation.isDelete) {
                // reload list
                factory.doSearch();
              }
            }).catch(function (err) {
              if (operation.showActionError && operation.showActionError(err)) {
                factory.apiError = processErrorCode(factory.search.name, operation.name.toLowerCase(), err);
              }

              throw err;
            });
          };
        };

        var _updateActions = function () {
          if (!listOperations || !listOperations.operations) {
            return;
          }

          _.each(listOperations.operations, function (operation) {
            operation.isDelete = operation.name === 'Delete';

            _updateSelectedAction(operation);
          });
        };

        _updateActions();

        return factory;
      };
    }
  ]);
