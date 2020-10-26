'use strict';

angular.module('risevision.apps.purchase')
  .factory('stripeLoader', ['$q', '$interval', '$window', 'userState',
    'STRIPE_PROD_KEY', 'STRIPE_TEST_KEY',
    function ($q, $interval, $window, userState, STRIPE_PROD_KEY, STRIPE_TEST_KEY) {
      var deferred = $q.defer();

      var isTest = userState.getCopyOfUserCompany().isTest;

      var checkInterval = $interval(function () {
        if ($window.Stripe) {
          $interval.cancel(checkInterval);

          deferred.resolve($window.Stripe(isTest ? STRIPE_TEST_KEY : STRIPE_PROD_KEY));
        }
      }, 50);

      return function () {
        return deferred.promise.then(function (stripeClient) {
          return stripeClient;
        });
      };
    }
  ]);
