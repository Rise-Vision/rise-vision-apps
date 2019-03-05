'use strict';

angular.module('risevision.template-editor.services')
  .constant('INSTRUMENT_SEARCH_BASE_URL', 'https://contentfinancial2.appspot.com/_ah/api/financial/v1.00/')
  .service('instrumentSearchService', ['$q', '$log', '$http', 'INSTRUMENT_SEARCH_BASE_URL',
    function ($q, $log, $http, INSTRUMENT_SEARCH_BASE_URL) {
      var factory = {},
        popularSearchURL = INSTRUMENT_SEARCH_BASE_URL + "instruments/common?category=CATEGORY",
        keywordSearchURL = INSTRUMENT_SEARCH_BASE_URL + "instrument/search?category=CATEGORY&query=QUERY",
        results = {
          keyword: {},
          popular: {}
        };

      factory.keywordSearch = function( category, keyword ) {
        var keywordProp = category + "|" + keyword;

        if ( results.keyword[ keywordProp ] ) {
          return $q.when( results.keyword[ keywordProp ] );
        }

        return $http.get( keywordSearchURL.replace( "CATEGORY", category ).replace( "QUERY", keyword ) )
          .then( function( resp ) {
            results.keyword[ keywordProp ] = resp.data.items;
            return results.keyword[ keywordProp ];
          } );
      };

      factory.popularSearch = function( category ) {
        if ( results.popular[ category ] ) {
          return $q.when( results.popular[ category ] );
        }

        return $http.get( popularSearchURL.replace( "CATEGORY", category ) )
          .then( function( resp ) {
            results.popular[ category ] = resp.data.items;
            return results.popular[ category ];
          } );
      };

      return factory;
    }
  ]);
