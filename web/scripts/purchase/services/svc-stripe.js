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

      var elements;

      this.prepareNewElementsGroup = function () {
        elements = stripeLoader().then(function (stripeClient) {
          return stripeClient.elements();
        });
      };

      this.createElement = function (type, options) {
        return elements.then(function (els) {
          return els.create(type, options);
        });
      };

      this.authenticate3ds = function (secret) {
        return stripeLoader().then(function (stripeClient) {
          return stripeClient.handleCardAction(secret);
        });
      };
    }
  ]);
