'use strict';

angular.module('risevision.apps.purchase')

  .controller('PurchaseLicensesCtrl', ['$scope', '$state', '$loading', 'purchaseLicensesFactory',
    'helpWidgetFactory', '$location', 'redirectTo',
    function ($scope, $state, $loading, purchaseLicensesFactory, helpWidgetFactory, $location,
      redirectTo) {
      $scope.helpWidgetFactory = helpWidgetFactory;
      $scope.form = {};
      $scope.factory = purchaseLicensesFactory;

      purchaseLicensesFactory.init();

      $scope.$watch('factory.loading', function (loading) {
        if (loading) {
          $loading.start('purchase-licenses-loader');
        } else {
          $loading.stop('purchase-licenses-loader');
        }
      });

      var _isFormValid = function () {
        var form = $scope.form.purchaseLicensesForm;

        return !form || form.$valid;
      };

      $scope.completePayment = function () {
        if (!_isFormValid()) {
          return;
        }

        return purchaseLicensesFactory.completePayment();
      };

      $scope.completeCardPayment = function (element) {
        if (!_isFormValid()) {
          return;
        }

        purchaseLicensesFactory.validatePaymentMethod(element)
          .then(purchaseLicensesFactory.preparePaymentIntent)
          .then(purchaseLicensesFactory.completePayment);
      };

      $scope.close = function () {
        if (!purchaseLicensesFactory.purchase.reloadingCompany) {
          $location.path(redirectTo);
        } else {
          purchaseLicensesFactory.loading = true;

          $scope.$watch('factory.purchase.reloadingCompany', function (loading) {
            if (!loading) {
              purchaseLicensesFactory.loading = false;

              $location.path(redirectTo);
            }
          });
        }
      };

    }

  ]);
