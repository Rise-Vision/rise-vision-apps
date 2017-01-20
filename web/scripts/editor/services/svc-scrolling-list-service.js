'use strict';

angular.module('risevision.editor.services')
  .service('ScrollingListService', ['BaseList',
    function (BaseList) {
      return function (listService, search) {
        var DB_MAX_COUNT = 40; //number of records to load at a time
        var factory = {};

        factory.items = new BaseList(DB_MAX_COUNT);

        factory.search = search ? search : {};
        _.defaults(factory.search, {
          sortBy: 'name',
          count: DB_MAX_COUNT,
          reverse: false
        });

        factory.load = function () {
          if (!factory.items.list.length || !factory.items.endOfList &&
            factory.items.cursor) {
            factory.loadingItems = true;

            listService(factory.search, factory.items.cursor)
              .then(function (result) {
                factory.items.add(result.items ? result.items : [],
                  result.cursor);
              })
              .then(null, function (e) {
                factory.error =
                  'Failed to load the list. Please try again later.';
              })
              .finally(function () {
                factory.loadingItems = false;
              });
          }
        };

        factory.load();

        factory.sortBy = function (cat) {
          factory.items.clear();

          if (cat !== factory.search.sortBy) {
            factory.search.sortBy = cat;
            factory.search.reverse = false;
          } else {
            factory.search.reverse = !factory.search.reverse;
          }

          factory.load();
        };

        factory.doSearch = function () {
          factory.items.clear();

          factory.load();
        };

        return factory;
      };
    }
  ]);
