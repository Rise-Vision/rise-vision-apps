"use strict";

angular.module("risevision.common.components.purchase-flow")
  .factory("stripeLoader", ["$q", "$interval", "$window", "userState",
    "STRIPE_PROD_KEY", "STRIPE_TEST_KEY",
    function ($q, $interval, $window, userState, STRIPE_PROD_KEY, STRIPE_TEST_KEY) {
      var deferred = $q.defer();

      var checkInterval = $interval(function () {
        if ($window.Stripe) {
          $interval.cancel(checkInterval);

          deferred.resolve($window.Stripe);
        }
      }, 50);

      return function () {
        return deferred.promise.then(function (stripeClient) {
          var isTest = userState.getCopyOfUserCompany().isTest;

          stripeClient.setPublishableKey(isTest ? STRIPE_TEST_KEY : STRIPE_PROD_KEY);

          return stripeClient;
        });
      };
    }
  ]);
