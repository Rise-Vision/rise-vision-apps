'use strict';

/*jshint camelcase: false */

angular.module('risevision.store.product', [
    'risevision.common.gapi'
  ])
  .service('storeProduct', ['$q', '$log', 'storeAPILoader', 'userState',
    function ($q, $log, storeAPILoader, userState) {
      var service = {
        get: function (id, idType) {
          var deferred = $q.defer();

          var obj = {
            'id': id,
            'idType': idType
          };

          $log.debug('Store product get called with', obj);

          storeAPILoader().then(function (storeApi) {
              return storeApi.product.get(obj);
            })
            .then(function (resp) {
              $log.debug('get store product resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get product.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        status: function (productCodes) {
          var deferred = $q.defer();

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'productCodes': productCodes
          };

          $log.debug('Store product status called with', obj);

          storeAPILoader().then(function (storeApi) {
              return storeApi.product.status(obj);
            })
            .then(function (resp) {
              $log.debug('status store products resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get status of products.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        list: function (search, cursor) {
          var deferred = $q.defer();

          var companyId = userState.getSelectedCompanyId();
          var category = search.category;

          var filterString = 'visibleTo:ALL';

          if (companyId) {
            filterString += ' OR visibleTo:' + companyId;
          }

          filterString = '(' + filterString + ')';

          if (category === 'Templates') {
            filterString = filterString + ' AND (productTag: Templates OR productTag: HTMLTemplates)';
          } else {
            filterString = filterString + ' AND (productTag:' + category + ')';
          }

          if (search.rvaEntityId) {
            filterString += ' AND (rvaEntityId:' + search.rvaEntityId +
              ')';
          }

          if (search.query && search.query.length) {
            filterString += ' AND \"' + search.query + '\"';
          }

          if (search.filter && search.filter.length) {
            filterString += ' AND ' + search.filter;
          }

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'search': filterString,
            'cursor': cursor,
            'count': search.count,
            'sort': 'defaultOrderWeight ASC'
          };

          $log.debug('Store product list called with', obj);

          storeAPILoader().then(function (storeApi) {
              return storeApi.product.list(obj);
            })
            .then(function (resp) {
              $log.debug('list store products resp', resp);

              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get list of products.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ]);
