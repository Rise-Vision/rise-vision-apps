(function () {
  "use strict";

  angular.module("risevision.common.subscription-status", [
    "risevision.common.gapi"
  ])
    .service("subscriptionStatusService", ["$http", "$q", "storeAPILoader",
      "$log",
      function ($http, $q, storeAPILoader, $log) {
        var responseType = ["On Trial", "Trial Expired", "Subscribed",
          "Suspended", "Cancelled", "Free", "Not Subscribed",
          "Product Not Found", "Company Not Found", "Error"
        ];
        var responseCode = ["on-trial", "trial-expired", "subscribed",
          "suspended", "cancelled", "free", "not-subscribed",
          "product-not-found", "company-not-found", "error"
        ];
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // a and b are javascript Date objects
        function dateDiffInDays(a, b) {
          return Math.floor((b.getTime() - a.getTime()) / _MS_PER_DAY);
        }

        this.get = function (productCode, companyId) {
          var deferred = $q.defer();

          var obj = {
            "companyId": companyId,
            "productCodes": productCode
          };

          storeAPILoader().then(function (storeApi) {
            var request = storeApi.product.status(obj);
            request.execute(function (resp) {
              $log.debug("getProductStatus resp", resp);
              if (resp.result) {
                var subscriptionStatus = resp.items[0];

                subscriptionStatus.plural = "";

                var statusIndex = responseType.indexOf(
                  subscriptionStatus.status);

                if (statusIndex >= 0) {
                  subscriptionStatus.statusCode = responseCode[
                    statusIndex];
                }

                if (subscriptionStatus.status === "") {
                  subscriptionStatus.status = "N/A";
                  subscriptionStatus.statusCode = "na";
                  subscriptionStatus.subscribed = false;
                } else if (subscriptionStatus.status === responseType[0] ||
                  subscriptionStatus.status === responseType[2] ||
                  subscriptionStatus.status === responseType[5]) {
                  subscriptionStatus.subscribed = true;
                } else {
                  subscriptionStatus.subscribed = false;
                }

                if (subscriptionStatus.statusCode === "not-subscribed" &&
                  subscriptionStatus.trialPeriod && subscriptionStatus.trialPeriod >
                  0) {
                  subscriptionStatus.statusCode = "trial-available";
                  subscriptionStatus.subscribed = true;
                }

                if (subscriptionStatus.expiry && subscriptionStatus.statusCode ===
                  "on-trial") {
                  subscriptionStatus.expiry = new Date(
                    subscriptionStatus.expiry);

                  if (subscriptionStatus.expiry instanceof Date && !
                    isNaN(subscriptionStatus.expiry.valueOf())) {
                    subscriptionStatus.expiry = dateDiffInDays(new Date(),
                      subscriptionStatus.expiry);
                  }

                  if (subscriptionStatus.expiry === 0) {
                    subscriptionStatus.plural = "-zero";
                  } else if (subscriptionStatus.expiry > 1) {
                    subscriptionStatus.plural = "-many";
                  }
                }

                deferred.resolve(subscriptionStatus);
              } else {
                deferred.reject(resp);
              }
            });
          });

          return deferred.promise;
        };

      }
    ]);
}());
