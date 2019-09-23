"use strict";

/*jshint camelcase: false */

angular.module("risevision.common.components.purchase-flow")
  .constant("STRIPE_ERRORS", {
    invalid_number: "Invalid Card Number.",
    incorrect_number: "Invalid Card Number.",
    invalid_cvc: "Invalid Security Code.",
    incorrect_cvc: "Invalid Security Code.",
    invalid_expiry_month: "Invalid Exp. Month.",
    invalid_expiry_year: "Invalid Exp. Year.",
    incorrect_zip: "Invalid ZIP / Postal Code. The ZIP / Postal Code provided is not associated with the billing address of this card.",
    expired_card: "The card provided has expired.",
    card_declined: "The card was declined. Please confirm all information is correct. If the problem continues try a different card.",
    missing: "No card associated with the account.",
    processing_error: "An unexpected error has occurred. Please try again."
  })
  .service("stripeService", ["$q", "$log", "$window", "stripeLoader", "STRIPE_ERRORS",
    function ($q, $log, $window, stripeLoader, STRIPE_ERRORS) {

      this.validateCard = function (card, isNew) {
        var errors = [];

        if (!$window.Stripe) {
          errors.push(STRIPE_ERRORS.processing_error);

          return errors;
        }

        if (isNew) {
          card.number = card.number ? card.number.trim() : "";

          if (!$window.Stripe.card.validateCardNumber(card.number)) {
            errors.push(STRIPE_ERRORS.invalid_number);
          }
          if (!$window.Stripe.card.validateCVC(card.cvc)) {
            errors.push(STRIPE_ERRORS.invalid_cvc);
          }
        }

        if (!$window.Stripe.card.validateExpiry(card.expMonth, card.expYear)) {
          errors.push("Invalid Expiry Date.");
        }

        return errors;
      };

      var _processStripeError = function (errorCode) {
        var message = STRIPE_ERRORS[errorCode];

        if (!message) {
          message = STRIPE_ERRORS.processing_error;
        }

        return message;
      };

      this.createToken = function (card, address) {
        var deferred = $q.defer();

        card.tokenError = null;
        var cardObject = {
          number: card.number,
          cvc: card.cvc,
          exp_month: card.expMonth,
          exp_year: card.expYear,
          name: card.name,
          //address fields
          address_line1: address.street,
          address_line2: address.unit,
          address_city: address.city,
          address_state: address.province,
          address_zip: address.postalCode,
          address_country: address.country
        };

        stripeLoader().then(function (stripeClient) {
          stripeClient.card.createToken(cardObject, function (status, response) {
            if (response && response.card && !response.error) {
              $log.debug("Create Token response: ", response);

              deferred.resolve(response);
            } else {
              console.error("Failed to get Card Token: ", response);

              card.tokenError = _processStripeError(response && response.error && response.error.code);

              deferred.reject();
            }
          });
        });

        return deferred.promise;
      };
    }
  ]);
