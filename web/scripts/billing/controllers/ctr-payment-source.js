'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.controllers')
  .controller('PaymentSourceCtrl', ['$scope', '$loading', '$state', 'userState',
  'subscriptionFactory', 'creditCardFactory', 'addressService',
    function ($scope, $loading, $state, userState, subscriptionFactory, creditCardFactory,
      addressService) {
      $scope.subscriptionFactory = subscriptionFactory;
      $scope.creditCardFactory = creditCardFactory;

      $scope.$watchGroup(['subscriptionFactory.loading', 'creditCardFactory.loading'], function (values) {
        if (values[0] || values[1] || values[2]) {
          $loading.start('payment-source-loader');
        } else {
          $loading.stop('payment-source-loader');
        }
      });

      $scope.contactEmail = userState.getUserEmail();

      creditCardFactory.initPaymentMethods(false)
        .finally(function() {
          creditCardFactory.paymentMethods.paymentMethod = 'card';
          creditCardFactory.paymentMethods.newCreditCard.billingAddress = addressService.copyAddress(userState.getCopyOfSelectedCompany());
        });

      $scope.addPaymentMethod = function(subscriptionId) {
        if (creditCardFactory.paymentMethods.paymentMethod === 'invoice') {
          subscriptionFactory.changePaymentToInvoice(subscriptionId, creditCardFactory.paymentMethods.purchaseOrderNumber)
            .then(function() {
              if (!factory.apiError) {
                $state.go('apps.billing.subscription', {
                  subscriptionId: subscriptionId
                });
              }
            });
        } else {
          if (!$scope.form.paymentMethodsForm.$valid) {
            return;
          }

          //
        }
      };
    }
  ]);
