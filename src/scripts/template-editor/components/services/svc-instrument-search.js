'use strict';

angular.module('risevision.template-editor.services')
  .constant('INSTRUMENT_SEARCH_BASE_URL', 'https://contentfinancial2.appspot.com/_ah/api/financial/v1.00/')
  .service('instrumentSearchService', ['$q', '$log', '$http', 'INSTRUMENT_SEARCH_BASE_URL',
    function ($q, $log, $http, INSTRUMENT_SEARCH_BASE_URL) {
      var factory = {},
        popularSearchURL = INSTRUMENT_SEARCH_BASE_URL + 'instruments/common?category=CATEGORY',
        keywordSearchURL = INSTRUMENT_SEARCH_BASE_URL + 'instrument/search?category=CATEGORY&query=QUERY',
        results = {
          keyword: {},
          popular: {}
        };

      factory.keywordSearch = function (category, keyword) {
        var keywordProp = category + '|' + keyword;

        if (results.keyword[keywordProp]) {
          return $q.when(results.keyword[keywordProp]);
        }

        var capitalized = _capitalizeWords(category);

        return $http.get(keywordSearchURL.replace('CATEGORY', capitalized).replace('QUERY', keyword))
          .then(function (resp) {
            results.keyword[keywordProp] = _getValidItems(resp);
            return results.keyword[keywordProp];
          });
      };

      function _capitalizeWords(category) {
        var fragments = category.split(' ');

        return _.map(fragments, function (fragment) {
          return fragment ? (
            fragment.charAt(0).toUpperCase() +
            fragment.slice(1).toLowerCase()
          ) : '';
        }).join('%20');
      }

      function _getValidItems(resp) {
        var items = resp.data.items;

        return _.filter(items, function (item) {
          return !!item.symbol;
        });
      }

      factory.popularSearch = function (category) {
        if (results.popular[category]) {
          return $q.when(results.popular[category]);
        }

        return $http.get(popularSearchURL.replace('CATEGORY', category))
          .then(function (resp) {
            results.popular[category] = _getValidItems(resp);
            return results.popular[category];
          });
      };

      return factory;
    }
  ]);
