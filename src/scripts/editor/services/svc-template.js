'use strict';

/*jshint camelcase: false */

angular.module('risevision.editor.services')
  .constant('TEMPLATE_SEARCH_FIELDS', [
    'name', 'id'
  ])
  .service('template', ['$q', '$log', 'coreAPILoader', 'userState',
    'TEMPLATE_SEARCH_FIELDS',
    function ($q, $log, coreAPILoader, userState, TEMPLATE_SEARCH_FIELDS) {

      var createSearchQuery = function (fields, search) {
        var query = '';
        for (var i in fields) {
          query += 'OR ' + fields[i] + ':~\"' + search + '\" ';
        }
        query = query.substring(3);
        return query.trim();
      };

      var service = {
        list: function (search, cursor) {
          var deferred = $q.defer();

          var query = search.query ?
            createSearchQuery(TEMPLATE_SEARCH_FIELDS, search.query) :
            '';
          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'search': query,
            'cursor': cursor,
            'count': search.count,
            'sort': search.sortBy + (search.reverse ? ' desc' : ' asc')
          };
          $log.debug('list templates called with', obj);
          coreAPILoader().then(function (coreApi) {
              return coreApi.template.list(obj);
            })
            .then(function (resp) {
              $log.debug('list template resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get list of templates.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        }

      };

      return service;
    }
  ]);
