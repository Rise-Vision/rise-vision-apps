'use strict';

/*jshint camelcase: false */

angular.module('risevision.schedules.services')
  .constant('SCHEDULE_WRITABLE_FIELDS', [
    'name', 'content', 'distribution', 'distributeToAll',
    'timeDefined', 'startDate', 'endDate', 'startTime', 'endTime',
    'recurrenceType', 'recurrenceFrequency', 'recurrenceAbsolute',
    'recurrenceDayOfWeek', 'recurrenceDayOfMonth', 'recurrenceWeekOfMonth',
    'recurrenceMonthOfYear', 'recurrenceDaysOfWeek'
  ])
  .constant('SCHEDULE_SEARCH_FIELDS', [
    'name', 'id'
  ])
  .service('schedule', ['$q', '$log', 'coreAPILoader', 'userState',
    'pick', 'SCHEDULE_WRITABLE_FIELDS', 'SCHEDULE_SEARCH_FIELDS',
    function ($q, $log, coreAPILoader, userState, pick,
      SCHEDULE_WRITABLE_FIELDS, SCHEDULE_SEARCH_FIELDS) {

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
            createSearchQuery(SCHEDULE_SEARCH_FIELDS, search.query) : '';
          query += search.filter ? (search.query ? ' AND ' : '') + search.filter : '';

          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'search': query,
            'cursor': cursor,
            'count': search.count,
            'sort': search.sortBy + (search.reverse ? ' desc' : ' asc')
          };
          $log.debug('list schedules called with', obj);
          coreAPILoader().then(function (coreApi) {
              return coreApi.schedule.list(obj);
            })
            .then(function (resp) {
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get list of schedules.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        get: function (scheduleId) {
          var deferred = $q.defer();

          var obj = {
            'id': scheduleId
          };

          $log.debug('get schedule called with', scheduleId);
          coreAPILoader().then(function (coreApi) {
              return coreApi.schedule.get(obj);
            })
            .then(function (resp) {
              $log.debug('get schedule resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to get schedule.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        add: function (schedule, forceDistribution) {
          var deferred = $q.defer();

          var fields = pick.apply(this, [schedule].concat(SCHEDULE_WRITABLE_FIELDS));
          fields.forceDistribution = forceDistribution;
          var obj = {
            'companyId': userState.getSelectedCompanyId(),
            'data': fields
          };
          coreAPILoader().then(function (coreApi) {
              return coreApi.schedule.add(obj);
            })
            .then(function (resp) {
              $log.debug('added schedule', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to add schedule.', e);
              deferred.reject(e);
            });
          return deferred.promise;
        },
        update: function (scheduleId, schedule, forceDistribution) {
          var deferred = $q.defer();

          var fields = pick.apply(this, [schedule].concat(SCHEDULE_WRITABLE_FIELDS));
          fields.forceDistribution = forceDistribution;

          var obj = {
            'id': scheduleId,
            'data': fields
          };

          $log.debug('update schedule called with', scheduleId);
          coreAPILoader().then(function (coreApi) {
              return coreApi.schedule.patch(obj);
            })
            .then(function (resp) {
              $log.debug('update schedule resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to update schedule.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        delete: function (scheduleId) {
          var deferred = $q.defer();

          var obj = {
            'id': scheduleId
          };

          $log.debug('delete schedule called with', scheduleId);
          coreAPILoader().then(function (coreApi) {
              return coreApi.schedule.delete(obj);
            })
            .then(function (resp) {
              $log.debug('delete schedule resp', resp);
              deferred.resolve(resp);
            })
            .then(null, function (e) {
              console.error('Failed to delete schedule.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        addPresentation: function (scheduleIds, playlistItem) {
          var deferred = $q.defer();

          var obj = {
            'scheduleIds': scheduleIds,
            'playlistItem': playlistItem
          };

          $log.debug('addPresentation to schedule called with', scheduleIds);
          coreAPILoader().then(function (coreApi) {
              return coreApi.schedule.addPresentation(obj);
            })
            .then(function (resp) {
              $log.debug('addPresentation to schedule resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to add presentation to schedule.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        },
        removePresentation: function (scheduleIds, presentationId) {
          var deferred = $q.defer();

          var obj = {
            'scheduleIds': scheduleIds,
            'presentationId': presentationId
          };

          $log.debug('removePresentation from schedule called with', scheduleIds);
          coreAPILoader().then(function (coreApi) {
              return coreApi.schedule.removePresentation(obj);
            })
            .then(function (resp) {
              $log.debug('removePresentation from schedule resp', resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error('Failed to remove presentation from schedule.', e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ]);
