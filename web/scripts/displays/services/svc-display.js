(function () {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.displays.services')
    .value('PLAYER_PRO_PRODUCT_CODE', 'c4b368be86245bf9501baaa6e0b00df9719869fd')
    .value('PLAYER_PRO_PRODUCT_ID', '2048')
    .constant('DISPLAY_WRITABLE_FIELDS', [
      'name', 'status', 'useCompanyAddress', 'addressDescription', 'street',
      'unit', 'city', 'province', 'country', 'postalCode', 'timeZoneOffset',
      'restartEnabled', 'restartTime', 'browserUpgradeMode', 'width',
      'height',
      'orientation'
    ])
    .constant('DISPLAY_SEARCH_FIELDS', [
      'name', 'id', 'street', 'unit', 'city', 'province', 'country',
      'postalCode'
    ])
    .service('display', ['$rootScope', '$q', '$log', 'coreAPILoader',
      'userState', 'getDisplayStatus', 'screenshotRequester', 'pick', 
      'getProductSubscriptionStatus', 'getCompanySubscriptionStatus', 'SUBSCRIPTION_STATUS_MAP',
      'DISPLAY_WRITABLE_FIELDS', 'DISPLAY_SEARCH_FIELDS', 'PLAYER_PRO_PRODUCT_CODE',
      function ($rootScope, $q, $log, coreAPILoader, userState,
        getDisplayStatus, screenshotRequester, pick,
        getProductSubscriptionStatus, getCompanySubscriptionStatus, SUBSCRIPTION_STATUS_MAP,
        DISPLAY_WRITABLE_FIELDS, DISPLAY_SEARCH_FIELDS, PLAYER_PRO_PRODUCT_CODE) {

        var companiesStatus = {};
        var createSearchQuery = function (fields, search) {
          var query = '';

          for (var i in fields) {
            query += 'OR ' + fields[i] + ':~\'' + search + '\' ';
          }

          query = query.substring(3);

          return query.trim();
        };

        var _loadCompaniesProStatus = function (displays, forceReload) {
          var promises = [];

          displays.forEach(function (display) {
            var companyId = display.companyId;

            if (!companiesStatus[companyId] || forceReload) {
              companiesStatus[companyId] = {};
              promises.push(
                getCompanySubscriptionStatus(PLAYER_PRO_PRODUCT_CODE, companyId)
                .then(function(resp) {
                  if (resp.status === 'Not Subscribed' && resp.trialPeriod && Number(resp.trialPeriod) > 0) {
                    resp.status = 'Trial Available';
                  }

                  resp.statusCode = SUBSCRIPTION_STATUS_MAP[resp.status];
                  companiesStatus[companyId] = resp;
                }));
            }
          });

          return $q.all(promises);
        };

        var _mergeConnectionStatuses = function (items, statuses) {
          items.forEach(function (item) {
            item.lastConnectionTime = item.lastActivityDate;
          });

          statuses.forEach(function (s) {
            for (var i = 0; i < items.length; i++) {
              var item = items[i];

              if (s[item.id] !== undefined) {
                _mergeConnectionStatus(item, s);
                break;
              }
            }
          });
        };

        var _mergeConnectionStatus = function (item, lookup) {
          if (lookup[item.id] === true) {
            item.onlineStatus = 'online';
          }

          item.lastConnectionTime = !isNaN(lookup.lastConnectionTime) ? new Date(
            lookup.lastConnectionTime) : (item.lastActivityDate || '');
        };

        var _mergeProSubscriptionStatus = function (items, statusMap) {
          items.forEach(function (item) {
            var companyStatus = companiesStatus[item.companyId];

            if (companyStatus.statusCode === 'subscribed') {
              item.proSubscription = statusMap[item.id];
            }
            else {
              item.proSubscription = companyStatus;
            }
          });
        };

        var service = {
          list: function (search, cursor) {
            var deferred = $q.defer();

            var query = search.query ?
              createSearchQuery(DISPLAY_SEARCH_FIELDS, search.query) :
              '';

            var obj = {
              'companyId': userState.getSelectedCompanyId(),
              'search': query,
              'cursor': cursor,
              'count': search.count,
              'sort': search.sortBy + (search.reverse ? ' desc' :
                ' asc')
            };
            $log.debug('list displays called with', obj);
            coreAPILoader().then(function (coreApi) {
                return coreApi.display.list(obj);
              })
              .then(onGetListSuccess)
              .catch(onFailure);

            return deferred.promise;

            function onGetListSuccess(resp) {
              var result = resp.result;

              //eager digest
              deferred.resolve(result);

              if (result.items) {
                var displayIds = result.items.map(function (item) {
                  return item.id;
                });

                service.statusLoading = true;
                service.susbscriptionLoading = true;

                getDisplayStatus(displayIds).then(function (statuses) {
                    _mergeConnectionStatuses(result.items, statuses);

                    $rootScope.$broadcast('displaysLoaded', result.items);
                  })
                  .finally(function () {
                    service.statusLoading = false;
                  });

                _loadCompaniesProStatus(result.items)
                  .then(function () {
                    return getProductSubscriptionStatus(PLAYER_PRO_PRODUCT_CODE, displayIds);
                  })
                  .then(function (statusMap) {
                    _mergeProSubscriptionStatus(result.items, statusMap);
                  })
                  .finally(function () {
                    service.susbscriptionLoading = false;
                  });
              }
            }

            function onFailure(e) {
              console.error('Failed to get list of displays.', e);
              deferred.reject(e);
            }
          },
          get: function (displayId) {
            var deferred = $q.defer();

            var obj = {
              'id': displayId
            };

            $log.debug('get display called with', displayId);
            coreAPILoader().then(function (coreApi) {
                return coreApi.display.get(obj);
              })
              .then(function (resp) {
                $log.debug('get display resp', resp);
                deferred.resolve(resp.result);

                var item = resp.result.item;
                if (item) {
                  service.statusLoading = true;

                  getDisplayStatus([item.id]).then(function (statuses) {
                    _mergeConnectionStatus(item, statuses[0]);

                    $rootScope.$broadcast('displaysLoaded', [item]);
                  }).finally(function () {
                    service.statusLoading = false;
                  });
                }
              })
              .then(null, function (e) {
                console.error('Failed to get display.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          add: function (display) {
            var deferred = $q.defer();

            var fields = pick.apply(this, [display].concat(
              DISPLAY_WRITABLE_FIELDS));
            var obj = {
              'companyId': userState.getSelectedCompanyId(),
              'data': fields
            };
            coreAPILoader().then(function (coreApi) {
                return coreApi.display.add(obj);
              })
              .then(function (resp) {
                $log.debug('added display', resp);
                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to add display.', e);
                deferred.reject(e);
              });
            return deferred.promise;
          },
          update: function (displayId, display) {
            var deferred = $q.defer();

            var fields = pick.apply(this, [display].concat(
              DISPLAY_WRITABLE_FIELDS));
            var obj = {
              'id': displayId,
              'data': fields
            };

            $log.debug('update display called with', displayId);
            coreAPILoader().then(function (coreApi) {
                return coreApi.display.patch(obj);
              })
              .then(function (resp) {
                $log.debug('update display resp', resp);
                deferred.resolve(resp.result);
              })
              .then(null, function (e) {
                console.error('Failed to update display.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          delete: function (displayId) {
            var deferred = $q.defer();

            var obj = {
              'id': displayId
            };

            $log.debug('delete display called with', displayId);
            coreAPILoader().then(function (coreApi) {
                return coreApi.display.delete(obj);
              })
              .then(function (resp) {
                $log.debug('delete display resp', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to delete display.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          getCompanyProStatus: function (companyId, forceReload) {
            var deferred = $q.defer();

            _loadCompaniesProStatus([{ companyId: companyId }], forceReload)
            .then(function() {
              deferred.resolve(companiesStatus[companyId]);
            })
            .catch(function(e) {
              deferred.reject(e);
            });

            return deferred.promise;
          },
          restart: function (displayId) {
            var deferred = $q.defer();

            var obj = {
              'id': displayId
            };

            $log.debug('restart display called with', displayId);
            coreAPILoader().then(function (coreApi) {
                return coreApi.display.restart(obj);
              })
              .then(function (resp) {
                $log.debug('restart display resp', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to restart display.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          reboot: function (displayId) {
            var deferred = $q.defer();

            var obj = {
              'id': displayId
            };

            $log.debug('reboot display called with', displayId);
            coreAPILoader().then(function (coreApi) {
                return coreApi.display.reboot(obj);
              })
              .then(function (resp) {
                $log.debug('reboot display resp', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to reboot display.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          },
          hasSchedule: function (display) {
            return display && display.scheduleId && display.scheduleId !==
              'DEMO';
          },
          requestScreenshot: function (displayId) {
            $log.debug('request screenshot called with', displayId);

            return screenshotRequester(function (clientId) {
                return coreAPILoader().then(function (coreApi) {
                  return coreApi.display.requestScreenshot({
                    id: displayId,
                    clientId: clientId
                  });
                });
              })
              .then(function (resp) {
                $log.debug('request screenshot resp', resp);
                return resp;
              })
              .then(null, function (e) {
                console.error('Failed screenshot request', e);
                return $q.reject(e);
              });
          },
          uploadControlFile: function (displayId, controlFileContents) {
            var deferred = $q.defer();

            $log.debug('uploadControlFile called with', displayId, controlFileContents);
            coreAPILoader().then(function (coreApi) {
                return coreApi.display.uploadControlFile({
                  'id': displayId,
                  'controlFileContents': controlFileContents
                });
              })
              .then(function (resp) {
                $log.debug('uploadControlFile resp', resp);
                deferred.resolve(resp);
              })
              .then(null, function (e) {
                console.error('Failed to upload control file.', e);
                deferred.reject(e);
              });

            return deferred.promise;
          }
        };

        return service;
      }
    ]);
})();
