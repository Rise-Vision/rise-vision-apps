"use strict";

/*jshint camelcase: false */

angular.module("risevision.common.components.distribution-selector.services")
  .constant("DISPLAY_SEARCH_FIELDS", [
    "name", "id"
  ])
  .service("displayService", ["$q", "$log", "coreAPILoader", "userState",
    "DISPLAY_SEARCH_FIELDS",
    function ($q, $log, coreAPILoader, userState, DISPLAY_SEARCH_FIELDS) {

      var createSearchQuery = function (fields, search) {
        var query = "";

        for (var i in fields) {
          query += "OR " + fields[i] + ":~\"" + search + "\" ";
        }

        query = query.substring(3);

        //restrict the search result to contain only displays from the selected company
        query = query + " AND companyId=" + userState.getSelectedCompanyId();

        return query.trim();
      };

      var service = {
        list: function (search, cursor) {
          var deferred = $q.defer();

          var query = search.query ?
            createSearchQuery(DISPLAY_SEARCH_FIELDS, search.query) : "";

          var obj = {
            "companyId": userState.getSelectedCompanyId(),
            "search": query,
            "cursor": cursor,
            "count": search.count,
            "sort": search.sortBy + (search.reverse ? " desc" : " asc")
          };
          $log.debug("list displays called with", obj);

          coreAPILoader().then(function (coreApi) {
            return coreApi.display.list(obj);
          })
            .then(function (resp) {
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              console.error("Failed to get list of displays.", e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ]);
