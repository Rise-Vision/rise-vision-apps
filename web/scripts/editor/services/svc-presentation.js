'use strict';

/*jshint camelcase: false */

angular.module('risevision.editor.services')
  .constant('PRESENTAION_WRITABLE_FIELDS', [
    'name', 'layout', 'distribution', 'isTemplate', 'embeddedIds', 'productCode',
    'presentationType', 'templateAttributeData'
  ])
  .constant('PRESENTAION_SEARCH_FIELDS', [
    'name', 'id', 'revisionStatusName'
  ])
  .service('presentation', ['$q', '$log', 'coreAPILoader', 'userState',
    'pick', 'PRESENTAION_WRITABLE_FIELDS', 'PRESENTAION_SEARCH_FIELDS',
    function ($q, $log, coreAPILoader, userState, pick,
      PRESENTAION_WRITABLE_FIELDS, PRESENTAION_SEARCH_FIELDS) {

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
            createSearchQuery(PRESENTAION_SEARCH_FIELDS, search.query) : '';
          query += search.filter ? search.filter : '';

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'search': query,
            'cursor': cursor,
            'count': search.count,
            'sort': search.sortBy + (search.reverse ? ' desc' : ' asc')
          };
          $log.debug('list presentations called with', obj);
          coreAPILoader().then(function (coreApi) {
              return coreApi.presentation.list(obj);
            })
            .then(function (resp) {
              $log.debug('list presentations resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get list of presentations.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        get: function (presentationId) {
          var deferred = $q.defer();

          var obj = {
            'id': presentationId,
            'companyId': userState.getSelectedCompanyId()
          };

          $log.debug('get presentation called with', presentationId);
          coreAPILoader().then(function (coreApi) {
              return coreApi.presentation.get(obj);
            })
            .then(function (resp) {
              $log.debug('get presentation resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get presentation.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        add: function (presentation) {
          var deferred = $q.defer();

          var fields = pick.apply(this, [presentation].concat(
            PRESENTAION_WRITABLE_FIELDS));
          if (userState.isRiseAdmin()) {
            fields.isStoreProduct = presentation.isTemplate && presentation
              .isStoreProduct;
          }
          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'data': fields
          };
          coreAPILoader().then(function (coreApi) {
              return coreApi.presentation.add(obj);
            })
            .then(function (resp) {
              $log.debug('added presentation', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to add presentation.', e);
              deferred.reject(e);
            });
          return deferred.promise;
        },
        update: function (presentationId, presentation) {
          var deferred = $q.defer();

          var fields = pick.apply(this, [presentation].concat(
            PRESENTAION_WRITABLE_FIELDS));
          if (userState.isRiseAdmin()) {
            fields.isStoreProduct = presentation.isTemplate && presentation
              .isStoreProduct;
          }
          var obj = {
            'id': presentationId,
            'data': fields
          };

          $log.debug('update presentation called with', presentationId);
          coreAPILoader().then(function (coreApi) {
              return coreApi.presentation.patch(obj);
            })
            .then(function (resp) {
              $log.debug('update presentation resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to update presentation.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        delete: function (presentationId) {
          var deferred = $q.defer();

          var obj = {
            'id': presentationId
          };

          $log.debug('delete presentation called with', presentationId);
          coreAPILoader().then(function (coreApi) {
              return coreApi.presentation.delete(obj);
            })
            .then(function (resp) {
              $log.debug('delete presentation resp', resp);
              deferred.resolve(resp);
            })
            .then(null, function (e) {
              console.error('Failed to delete presentation.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        publish: function (presentationId) {
          var deferred = $q.defer();

          var obj = {
            'id': presentationId
          };

          $log.debug('publish presentation called with', presentationId);
          coreAPILoader().then(function (coreApi) {
              return coreApi.presentation.publish(obj);
            })
            .then(function (resp) {
              $log.debug('publish presentation resp', resp);
              deferred.resolve(resp);
            })
            .then(null, function (e) {
              console.error('Failed to publish presentation.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        restore: function (presentationId) {
          var deferred = $q.defer();

          var obj = {
            'id': presentationId
          };

          $log.debug('restore presentation called with', presentationId);
          coreAPILoader().then(function (coreApi) {
              return coreApi.presentation.restore(obj);
            })
            .then(function (resp) {
              $log.debug('restore presentation resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to restore presentation.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        buildFilterString: function (query, filter) {
          var result;

          result = query ?
            '(' + createSearchQuery(PRESENTAION_SEARCH_FIELDS, query) + ')' : '';

          result += result && filter ? ' AND ' : '';

          result += filter ? '(' + filter + ')' : '';

          return result;
        }
      };

      return service;
    }
  ]);
