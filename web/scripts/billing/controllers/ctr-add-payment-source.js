'use strict';

/*jshint camelcase: false */

angular.module('risevision.apps.billing.controllers')
  .controller('AddPaymentSourceCtrl', ['$scope', '$loading', '$state', 'userState',
  'subscriptionFactory', 'creditCardFactory', 'addPaymentSourceFactory',
    function ($scope, $loading, $state, userState, subscriptionFactory, creditCardFactory,
    addPaymentSourceFactory) {
      $scope.subscriptionFactory = subscriptionFactory;
      $scope.creditCardFactory = creditCardFactory;
      $scope.addPaymentSourceFactory = addPaymentSourceFactory;

      $scope.$watchGroup(['subscriptionFactory.loading', 'addPaymentSourceFactory.loading'], function (values) {
        if (values[0] || values[1]) {
          $loading.start('payment-source-loader');
        } else {
          $loading.stop('payment-source-loader');
        }
      });

      $scope.contactEmail = userState.getUserEmail();

      addPaymentSourceFactory.init();

      var _goToSubscriptionPage = function(subscriptionId) {
        $state.go('apps.billing.subscription', {
          subscriptionId: subscriptionId
        });
      };

      $scope.addPaymentMethod = function(subscriptionId) {
        if (creditCardFactory.paymentMethods.paymentMethod === 'invoice') {
          var purchaseOrderNumber = creditCardFactory.paymentMethods.purchaseOrderNumber;

          addPaymentSourceFactory.changePaymentToInvoice(subscriptionId, purchaseOrderNumber)
            .then(function() {
              _goToSubscriptionPage(subscriptionId);
            });
        } else {
          if (!$scope.form.paymentMethodsForm.$valid) {
            return;
          }

          addPaymentSourceFactory.changePaymentSource(subscriptionId)
            .then(function() {
              _goToSubscriptionPage(subscriptionId);
            });
        }
      };
    }
  ]);
