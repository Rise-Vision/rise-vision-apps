"use strict";
/*global gadgets: false */

angular.module("risevision.store.data-gadgets", [])
  .service("gadgetsService", ["$q",
    function ($q) {

      this.closeIFrame = function () {
        var deferred = $q.defer();
        gadgets.rpc.call("", "rscmd_closeSettings", function () {
          deferred.resolve(true);
        });
        return deferred.promise;
      };

      this.sendProductCode = function (productCode) {
        var deferred = $q.defer();
        var data = {
          params: productCode
        };
        gadgets.rpc.call("", "rscmd_saveSettings", function () {
          deferred.resolve(true);
        }, data);
        return deferred.promise;
      };

    }
  ]);
