'use strict';

/*jshint camelcase: false */

angular.module('risevision.editor.services')
  .service('store', ['$q', '$log', 'storeAPILoader', 'userState',
    function ($q, $log, storeAPILoader, userState) {
      var service = {
        product: {
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
                $log.error('Failed to get status of products.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          list: function (search, cursor) {
            var deferred = $q.defer();

            var companyId = userState.getSelectedCompanyId();
            var category = search.category;
            var productTag = search.productTag;

            var filterString = 'visibleTo:ALL';

            if (companyId) {
              filterString += ' OR visibleTo:' + companyId;
            }

            filterString = '(' + filterString + ')';
            filterString = filterString + ' AND (productTag:' + category +
              ')';

            if (productTag) {
              filterString = filterString + ' AND (productTag:' +
                productTag + ')';
            }

            if (search.rvaEntityId) {
              filterString += ' AND (rvaEntityId:' + search.rvaEntityId +
                ')';
            }

            if (search.query && search.query.length) {
              filterString += ' AND ' + search.query;
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
                $log.error('Failed to get list of products.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          }
        }
      };

      return service;
    }
  ]);
