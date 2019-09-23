(function (angular) {
  "use strict";


  angular.module("risevision.common.currency", [
    "risevision.common.gapi"
  ])

  .factory("currencyService", ["$q", "storeAPILoader", "$log",
    function ($q, storeAPILoader, $log) {

      var deferred = null;
      var currency = {
        defaultItem: null
      };

      var CurrencyItem = function (obj) {
        this.country = obj.country;
        this.currencyCode = obj.currencyCode;
        this.description = obj.description;
        this.bankAccountCode = obj.bankAccountCode;
        this.bankAccountDescription = obj.bankAccountDescription;

        this.getName = function () {
          return this.currencyCode.toUpperCase();
        };

        this.pickPrice = function (priceUSD, priceCAD) {
          switch (this.currencyCode.toUpperCase()) {
          case "CAD":
            return priceCAD;
          default:
            return priceUSD;
          }
        };
      };

      currency.getByCountry = function (country) {
        if (country) {
          for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].country && this.items[i].country.toUpperCase() ===
              country.toUpperCase()) {
              return this.items[i];
            }
          }
        }
        return this.defaultItem;
      };

      currency.setItems = function (newItems) {
        this.items = [];
        //set default currency
        for (var i = 0; i < newItems.length; i++) {
          var ci = new CurrencyItem(newItems[i]);
          this.items.push(ci);
          if (!ci.country) {
            this.defaultItem = ci;
          }
        }
      };

      return function () {

        if (deferred !== null) {
          return deferred.promise;
        }

        deferred = $q.defer();

        $log.debug("currencyService called");
        storeAPILoader().then(function (storeAPI) {
          var request = storeAPI.currency.list();
          request.execute(function (resp) {
            $log.debug("currencyService resp", resp);
            if (!resp.error) {
              currency.setItems(resp.items);
              deferred.resolve(currency);
            } else {
              console.error("currencyService error: ", resp.error);
              deferred.reject(resp.error);
            }
          });
        });

        return deferred.promise;
      };

    }
  ]);

})(angular);
