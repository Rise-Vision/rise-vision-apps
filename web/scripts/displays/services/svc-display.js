(function () {
  'use strict';

  /*jshint camelcase: false */

  angular.module('risevision.displays.services')
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
    .service('display', ['$q', '$log', 'coreAPILoader', 'userState',
      'getDisplayStatus', 'screenshotRequester', 'imageBlobLoader', 'pick',
      'DISPLAY_WRITABLE_FIELDS',
      'DISPLAY_SEARCH_FIELDS',
      function ($q, $log, coreAPILoader, userState, getDisplayStatus,
        screenshotRequester, imageBlobLoader, pick,
        DISPLAY_WRITABLE_FIELDS, DISPLAY_SEARCH_FIELDS) {

        var createSearchQuery = function (fields, search) {
          var query = '';

          for (var i in fields) {
            query += 'OR ' + fields[i] + ':~\'' + search + '\' ';
          }

          query = query.substring(3);

          return query.trim();
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

                getDisplayStatus(displayIds).then(function (statuses) {
                  _mergeStatuses(result.items, statuses);
                }).finally(function () {
                  service.statusLoading = false;
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
                    _mergeStatus(item, statuses[0]);
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
          loadScreenshot: function (displayId) {
            var url =
              'https://storage.googleapis.com/risevision-display-screenshots/' +
              displayId + '.jpg';

            return imageBlobLoader(url);
          }
        };

        return service;
      }
    ]);

  function _mergeStatuses(items, statuses) {
    items.forEach(function (item) {
      item.lastConnectionTime = item.lastActivityDate;
    });

    statuses.forEach(function (s) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (s[item.id] !== undefined) {
          _mergeStatus(item, s);
          break;
        }
      }
    });
  }

  function _mergeStatus(item, lookup) {
    if (lookup[item.id] === true) {
      item.onlineStatus = 'online';
    }

    item.lastConnectionTime = !isNaN(lookup.lastConnectionTime) ? new Date(
      lookup.lastConnectionTime) : (item.lastActivityDate || '');
  }
})();
