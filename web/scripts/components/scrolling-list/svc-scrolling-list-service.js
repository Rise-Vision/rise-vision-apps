'use strict';

angular.module('risevision.common.components.scrolling-list')
  .service('ScrollingListService', ['$log', 'BaseList', 'processErrorCode',
    function ($log, BaseList, processErrorCode) {
      return function (listService, search) {
        var DB_MAX_COUNT = 40; //number of records to load at a time
        var factory = {};

        factory.items = new BaseList(DB_MAX_COUNT);

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

        factory.select = function (item) {
          if (!item) {
            return;
          }

          item.selected = !item.selected;

          var deselectedIndex = _.findIndex(factory.items.list, function (item) {
            return !item.selected;
          });

          factory.search.selectAll = deselectedIndex === -1;          
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

        return factory;
      };
    }
  ]);
