'use strict';

angular.module('risevision.apps.purchase')

  .value('PURCHASE_STEPS', [{
    name: 'Subscription Details',
    index: 0
  }, {
    name: 'Billing Address',
    index: 1,
    formName: 'billingAddressForm'
  }, {
    name: 'Payment Method',
    index: 2,
    formName: 'paymentMethodsForm'
  }, {
    name: 'Purchase Review',
    index: 3
  }])

  .controller('PurchaseCtrl', ['$scope', '$loading', 'purchaseFactory', 'addressFactory',
    'taxExemptionFactory', 'PURCHASE_STEPS', '$location', 'redirectTo',
    function ($scope, $loading, purchaseFactory, addressFactory, taxExemptionFactory,
      PURCHASE_STEPS, $location, redirectTo) {
      $scope.form = {};
      $scope.factory = purchaseFactory;
      $scope.taxExemptionFactory = taxExemptionFactory;

      purchaseFactory.init();
      taxExemptionFactory.init(purchaseFactory.getEstimate);

      $scope.PURCHASE_STEPS = PURCHASE_STEPS;
      $scope.currentStep = 0;
      $scope.finalStep = false;

      $scope.$watchGroup(['factory.loading', 'taxExemptionFactory.loading'], function (values) {
        if (values[0] || values[1]) {
          $loading.start('purchase-loader');
        } else {
          $loading.stop('purchase-loader');
        }
      });

      var _isFormValid = function () {
        var step = PURCHASE_STEPS[$scope.currentStep];
        var formName = step.formName;
        var form = $scope.form[formName];

        return !form || form.$valid;
      };

      $scope.validateAddress = function (addressObject, contactObject) {
        if (!_isFormValid()) {
          return;
        }

        purchaseFactory.loading = true;

        addressFactory.validateAddress(addressObject)
          .finally(function () {
            purchaseFactory.loading = false;

            if (!addressObject.validationError) {
              addressFactory.updateContact(contactObject);
              addressFactory.updateAddress(addressObject, contactObject);

              $scope.setNextStep();
            }
          });
      };

      $scope.applyTaxExemption = function () {
        if (!taxExemptionFactory.taxExemption.sent) {
          taxExemptionFactory.taxExemption.show = !taxExemptionFactory.taxExemption.show;
        }
      };

      $scope.completePayment = function () {
        return purchaseFactory.completePayment()
          .then(function () {
            if (!purchaseFactory.purchase.checkoutError) {
              $scope.setNextStep();
            }
          });
      };

      $scope.completeCardPayment = function () {
        if (!_isFormValid()) {
          return;
        }

        purchaseFactory.validatePaymentMethod()
          .then(function() {
            return purchaseFactory.preparePaymentIntent();
          })
          .then($scope.completePayment);
      };

      var _refreshEstimate = function () {
        if ($scope.currentStep === 1 || $scope.currentStep === 2) {
          purchaseFactory.getEstimate();
        }
      };

      $scope.setNextStep = function () {
        // Note: Ensure to check if the form is valid before calling
        if (($scope.finalStep && $scope.currentStep < 1) || $scope.currentStep === 1) {
          $scope.currentStep = 2;

          $scope.finalStep = true;
        } else {
          $scope.currentStep++;
        }

        _refreshEstimate();
      };

      $scope.setPreviousStep = function () {
        if ($scope.currentStep > 0) {
          $scope.currentStep--;
        }
      };

      $scope.setCurrentStep = function (index) {
        purchaseFactory.purchase.checkoutError = null;

        $scope.currentStep = index;

        _refreshEstimate();
      };

      $scope.close = function () {
        if (!purchaseFactory.purchase.reloadingCompany) {
          $location.path(redirectTo);
        } else {
          purchaseFactory.loading = true;

          $scope.$watch('factory.purchase.reloadingCompany', function (loading) {
            if (!loading) {
              purchaseFactory.loading = false;

              $location.path(redirectTo);
            }
          });
        }
      };

    }

  ]);
