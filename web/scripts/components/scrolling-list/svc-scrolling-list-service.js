'use strict';

angular.module('risevision.common.components.scrolling-list')
  .service('ScrollingListService', ['$log', 'BaseList', 'BatchOperations', 'processErrorCode',
    function ($log, BaseList, BatchOperations, processErrorCode) {
      return function (listService, search) {
        var DB_MAX_COUNT = 40; //number of records to load at a time
        var factory = {};

        factory.items = new BaseList(DB_MAX_COUNT);
        factory.operations = new BatchOperations();

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

        var _clearList = function() {
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
                factory.items.add(result.items ? result.items : [], result.cursor);

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

          factory.items.list.forEach(function(item) {
            item.selected = factory.search.selectAll;
          });
        };

        factory.deselectAll = function () {
          if (!factory.items.list.length) {
            return;
          }

          factory.search.selectAll = false;

          factory.items.list.forEach(function(item) {
            item.selected = false;
          });
        };

        factory.getSelectedAction = function(actionCall, removeFromList) {
          return function() {
            var selected = factory.getSelected();
            var listError = false;

            if (!selected.length) {
              return;
            }

            _clearMessages();

            var execute = function (item) {
              return actionCall(item)
                .then(function() {
                  if (removeFromList) {
                    _.remove(factory.items.list, function(listItem) {
                      return listItem === item;
                    });
                  }
                })
                .catch(function(e) {
                  $log.error(processErrorCode(e), e);
            
                  listError = true;
                });
            };

            return factory.operations.batch(selected, execute)
              .finally(function() {  
                if (removeFromList) {
                  // reload list
                  factory.doSearch();                  
                }

                if (listError) {
                  factory.errorMessage = 'Something went wrong.';
                  factory.apiError = 'We weren’t able to delete one or more of the selected ' + 
                    factory.search.name.toLowerCase() + '. Please try again.';                  
                }
              });
          };
        };

        return factory;
      };
    }
  ]);
