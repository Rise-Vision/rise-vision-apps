(function (angular) {
  "use strict";

  angular.module("risevision.core.company", [
    "risevision.common.gapi",
    "risevision.core.cache",
    "risevision.core.util"
  ])

  .constant("COMPANY_WRITABLE_FIELDS", [
    "name", "street", "unit", "city", "province", "country",
    "postalCode", "timeZoneOffset", "telephone", "fax", "companyStatus",
    "mailSyncEnabled", "sellerId", "isTest", "shipToUseCompanyAddress",
    "shipToName", "shipToStreet", "shipToUnit", "shipToCity",
    "shipToProvince", "shipToPostalCode", "shipToCountry", "website",
    "companySize", "companyIndustry", "billingContactEmails", "shareCompanyPlan", "settings"
  ])

  .constant("ALERTS_WRITABLE_FIELDS", [
    "alertSettings"
  ])

  .constant("COMPANY_SEARCH_FIELDS", [
    "name", "id", "street", "unit", "city", "province", "country",
    "postalCode", "telephone", "fax",
    "shipToName", "shipToStreet", "shipToCity", "shipToPostalCode"
  ])

  // New service format:
  .factory("company", ["$q", "$log", "coreAPILoader", "pick",
    "ALERTS_WRITABLE_FIELDS",
    function ($q, $log, coreAPILoader, pick, ALERTS_WRITABLE_FIELDS) {
      var service = {
        updateAlerts: function (companyId, company) {
          var deferred = $q.defer();
          var fields = pick.apply(this, [company].concat(
            ALERTS_WRITABLE_FIELDS));
          var obj = {
            "id": companyId,
            "data": fields
          };
          $log.debug("updateAlerts called", companyId, fields);

          coreAPILoader().then(function (coreApi) {
            return coreApi.company.patch(obj);
          })
            .then(function (resp) {
              $log.debug("update Alerts resp", resp);
              deferred.resolve(resp.result);
            })
            .then(null, function (e) {
              $log.error("Failed to update Alerts.", e);
              deferred.reject(e);
            });

          return deferred.promise;
        }
      };

      return service;
    }
  ])

  // Old services:
  .factory("createCompany", ["$q", "coreAPILoader", "COMPANY_WRITABLE_FIELDS",
    "pick",
    function ($q, coreAPILoader, COMPANY_WRITABLE_FIELDS, pick) {
      return function (parentCompanyId, company) {
        var deferred = $q.defer();
        coreAPILoader().then(function (coreApi) {
          var fields = pick.apply(this, [company].concat(
            COMPANY_WRITABLE_FIELDS));
          var request = coreApi.company.add({
            parentId: parentCompanyId,
            data: fields
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

  .factory("getCompany", ["coreAPILoader", "$q", "$log",
    function (coreAPILoader, $q, $log) {
      return function (id) { //get a company either by id or authKey
        $log.debug("getCompany called", id);

        var deferred = $q.defer();
        coreAPILoader().then(function (coreApi) {
          var criteria = {};
          if (id) {
            criteria.id = id;
          }
          var request = coreApi.company.get(criteria);
          request.execute(function (resp) {
            $log.debug("getCompany resp", resp);
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

  .factory("lookupCompany", ["coreAPILoader", "$q", "$log",
    function (coreAPILoader, $q, $log) {
      return function (authKey) { //get a company either by id or authKey
        $log.debug("lookupCompany called", authKey);

        var deferred = $q.defer();
        coreAPILoader().then(function (coreApi) {
          var request = coreApi.company.lookup({
            authKey: authKey
          });
          request.execute(function (resp) {
            $log.debug("lookupCompany resp", resp);
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

  .factory("moveCompany", ["coreAPILoader", "$q", "$log",
    function (coreAPILoader, $q, $log) {
      return function (authKey, newParentId) { //get a company either by id or authKey
        var deferred = $q.defer();
        coreAPILoader().then(function (coreApi) {
          var request = coreApi.company.move({
            authKey: authKey,
            newParentId: newParentId
          });
          request.execute(function (resp) {
            $log.debug("moveCompany resp", resp);
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

  .factory("updateCompany", ["$q", "$log", "coreAPILoader", "pick",
    "COMPANY_WRITABLE_FIELDS",
    function ($q, $log, coreAPILoader, pick, COMPANY_WRITABLE_FIELDS) {
      return function (companyId, fields) {
        var deferred = $q.defer();
        fields = pick.apply(this, [fields].concat(COMPANY_WRITABLE_FIELDS));
        $log.debug("updateCompany called", companyId, fields);
        // fields.validate = validationRequired || false;
        coreAPILoader().then(function (coreApi) {
          var request = coreApi.company.patch({
            id: companyId,
            data: fields
          });
          request.execute(function (resp) {
            $log.debug("updateCompany resp", resp);
            if (resp.result && resp.result.item) {
              deferred.resolve(resp.result.item);
            } else {
              deferred.reject(resp);
            }
          });
        });

        return deferred.promise;
      };
    }
  ])

  .factory("regenerateCompanyField", ["$q", "$log", "coreAPILoader",
    function ($q, $log, coreAPILoader) {
      return function (companyId, fieldName) {
        var deferred = $q.defer();
        $log.debug("regenerateField called", companyId, fieldName);
        coreAPILoader().then(function (coreApi) {
          var request = coreApi.company.regenerateField({
            "id": companyId,
            "fieldName": fieldName
          });
          request.execute(
            function (resp) {
              $log.debug("regenerateField resp", resp);
              if (!resp.error) {
                deferred.resolve(resp);
              } else {
                deferred.reject(resp.message);
              }
            },
            function (resp) {
              deferred.reject("call failed " + resp);
            }
          );
        });

        return deferred.promise;
      };
    }
  ])

  .factory("deleteCompany", ["coreAPILoader", "$q", "$log",
    function (coreAPILoader, $q, $log) {
      return function (id) { //get a company either by id or authKey
        $log.debug("deleteCompany called", id);

        var deferred = $q.defer();
        coreAPILoader().then(function (coreApi) {
          var criteria = {};
          if (id) {
            criteria.id = id;
          }
          var request = coreApi.company.delete(criteria);
          request.execute(function (resp) {
            $log.debug("deleteCompany resp", resp);
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

  .service("companyService", ["coreAPILoader", "$q", "$log", "getCompany",
    "COMPANY_SEARCH_FIELDS",
    function (coreAPILoader, $q, $log, getCompany, COMPANY_SEARCH_FIELDS) {

      var createSearchQuery = function (fields, search) {
        var query = "";

        for (var i = 0; i < fields.length; i++) {
          query += "OR " + fields[i] + ":~\"" + search + "\" ";
        }

        query = query ? query.substring(3) : "";

        return query.trim();
      };

      this.getCompanies = function (search, cursor) {
        var deferred = $q.defer();

        var query = search.query ? createSearchQuery(COMPANY_SEARCH_FIELDS,
          search.query) : "";

        var obj = {
          "companyId": search.companyId,
          "search": query,
          "cursor": cursor,
          "count": search.count,
          "sort": search.sortBy + (search.reverse ? " desc" : " asc")
        };

        $log.debug("getCompanies called with", obj);
        coreAPILoader().then(function (coreApi) {
          var request = coreApi.company.list(obj);
          request.execute(function (resp) {
            $log.debug("getCompanies resp", resp);
            deferred.resolve(resp);
          });
        });
        return deferred.promise;
      };

      this.loadSelectedCompany = function (selectedCompanyId, userCompany) {
        //this funtion assumes user and user.company are loaded
        var deferred = $q.defer();
        if (selectedCompanyId && selectedCompanyId !== userCompany.id) {
          getCompany(selectedCompanyId).then(function (res) {
            if (res.code === 0 && res.item) {
              deferred.resolve(res.item);
            } else {
              deferred.resolve(userCompany);
            }
          });
        } else {
          deferred.resolve(userCompany);
        }
        return deferred.promise;
      };

    }
  ])

  .factory("enableCompanyProduct", ["$q", "$log", "coreAPILoader",
    function ($q, $log, coreAPILoader) {
      return function (companyId, productCode, displayStatusMap) {
        var deferred = $q.defer();

        $log.debug("enableCompanyProduct called", companyId, productCode, displayStatusMap);

        coreAPILoader().then(function (coreApi) {
          var request = coreApi.company.enableProduct({
            id: companyId,
            productCode: productCode,
            data: displayStatusMap
          });
          request.execute(function (resp) {
            $log.debug("enableCompanyProduct resp", resp);
            if (resp.result) {
              deferred.resolve(resp);
            } else {
              deferred.reject(resp);
            }
          });
        });

        return deferred.promise;
      };
    }
  ])

  .filter("fullAddress", function () {
    return function (company) {
      var res = (company.street ? company.street + ", " : "") +
        (company.city ? company.city + ", " : "") +
        (company.province ? company.province + ", " : "") +
        (company.country ? company.country + ", " : "") +
        (company.postalCode ? company.postalCode + ", " : "");
      if (res) {
        res = res.substr(0, res.length - 2);
      }
      return res;
    };
  });

})(angular);
