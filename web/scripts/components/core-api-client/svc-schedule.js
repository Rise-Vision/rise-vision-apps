(function (angular) {
  "use strict";

  angular.module("risevision.core.schedule", [
    "risevision.common.gapi",
    "risevision.core.cache",
    "risevision.core.util"
  ])

  .service("scheduleService", ["coreAPILoader", "$q", "$log",
    function (coreAPILoader, $q, $log) {
      //query a given's companys list of display schedules
      this.list = function (companyId, search, cursor, count, sort) {
        var deferred = $q.defer();
        var obj = {
          "companyId": companyId,
          "search": search,
          "cursor": cursor,
          "count": count,
          "sort": sort
        };
        $log.debug("getSchedules called with", obj);
        coreAPILoader().then(function (coreApi) {
          var request = coreApi.schedule.list(obj);
          request.execute(function (resp) {
            $log.debug("getSchedules resp", resp);
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
  ]);
})(angular);
