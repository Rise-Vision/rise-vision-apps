/**
 * Created by rodrigopavezi on 10/16/14.
 */
"use strict";

angular.module("risevision.common.app", [
  "risevision.common.gapi",
  "risevision.core.util"

])
  .constant("APP_WRITABLE_FIELDS", [
    "name", "description", "clientId", "url"
  ])
  .factory("listApps", ["$q", "riseAPILoader", "$log",
    function ($q, riseAPILoader, $log) {
      return function (companyId) {
        $log.debug("listApps called", companyId);

        var deferred = $q.defer();
        riseAPILoader().then(function (riseApi) {
          var criteria = {};
          if (companyId) {
            criteria.companyId = companyId;
          }

          var request = riseApi.app.list(criteria);
          request.execute(function (resp) {
            $log.debug("listApps resp", resp);
            if (resp.result) {
              deferred.resolve(resp.items);
            } else {
              deferred.reject(resp);
            }
          });

        });
        return deferred.promise;
      };
    }
  ])
  .factory("getApp", ["$q", "riseAPILoader", "$log",
    function ($q, riseAPILoader, $log) {
      return function (id) {
        $log.debug("getApp called", id);

        var deferred = $q.defer();
        riseAPILoader().then(function (riseApi) {
          var criteria = {};
          if (id) {
            criteria.id = id;
          }

          var request = riseApi.app.get(criteria);
          request.execute(function (resp) {
            $log.debug("getApp resp", resp);
            if (resp.result) {
              deferred.resolve(resp.item);
            } else {
              deferred.reject(resp);
            }
          });
        });
        return deferred.promise;
      };
    }
  ])
  .factory("createApp", ["$q", "riseAPILoader", "$log", "pick",
    "APP_WRITABLE_FIELDS",
    function ($q, riseAPILoader, $log, pick, APP_WRITABLE_FIELDS) {
      return function (companyId, userId, app) {
        $log.debug("createApp called", companyId, userId, app);

        var deferred = $q.defer();
        riseAPILoader().then(function (riseApi) {
          var fields = pick.apply(this, [app].concat(APP_WRITABLE_FIELDS));
          var request = riseApi.app.add({
            companyId: companyId,
            userId: userId,
            data: JSON.stringify(fields)
          });

          request.execute(function (resp) {
            if (resp.result) {
              deferred.resolve(resp.item);
            } else {
              deferred.reject(resp);
            }
          }, deferred.reject);
        });
        return deferred.promise;
      };
    }
  ])
  .factory("updateApp", ["$q", "riseAPILoader", "$log", "pick",
    "APP_WRITABLE_FIELDS",
    function ($q, riseAPILoader, $log, pick, APP_WRITABLE_FIELDS) {
      return function (id, app) {
        $log.debug("updateApp called", id, app);

        var deferred = $q.defer();
        riseAPILoader().then(function (riseApi) {
          var fields = pick.apply(this, [app].concat(APP_WRITABLE_FIELDS));
          var request = riseApi.app.update({
            id: id,
            data: JSON.stringify(fields)
          });

          request.execute(function (resp) {
            if (resp.result) {
              deferred.resolve(resp.item);
            } else {
              deferred.reject(resp);
            }
          }, deferred.reject);
        });
        return deferred.promise;
      };
    }
  ])
  .factory("deleteApp", ["$q", "riseAPILoader", "$log",
    function ($q, riseAPILoader, $log) {
      return function (id) {
        $log.debug("deleteApp called", id);

        var deferred = $q.defer();
        riseAPILoader().then(function (riseApi) {
          var criteria = {};
          if (id) {
            criteria.id = id;
          }
          var request = riseApi.app.delete(criteria);
          request.execute(function (resp) {
            $log.debug("deleteApp resp", resp);
            if (resp.result) {
              deferred.resolve(resp.item);
            } else {
              deferred.reject(resp);
            }
          });
        });
        return deferred.promise;
      };
    }
  ]);
