'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.purchase')
  .service('stripeService', ['$q', '$log', '$window', 'stripeLoader',
    function ($q, $log, $window, stripeLoader) {

      this.createPaymentMethod = function (type, element, details) {
        return stripeLoader().then(function (stripeClient) {
          return stripeClient.createPaymentMethod(type, element, details);
        });
      };

      this.handleCardAction = function (clientSecret) {
        return stripeLoader().then(function (stripeClient) {
          return stripeClient.handleCardAction(clientSecret);
        });
      };

      this.confirmCardSetup = function (clientSecret) {
        return stripeLoader().then(function (stripeClient) {
          return stripeClient.confirmCardSetup(clientSecret);
        });
      };

      this.initializeStripeElements = function (types, options) {
        return stripeLoader()
          .then(function (stripeClient) {
            return stripeClient.elements();
          })
          .then(function (elements) {
            return $q.all(types.map(function (type) {
              return elements.create(type, options);
            }));
          });
      };
    }
  ]);
