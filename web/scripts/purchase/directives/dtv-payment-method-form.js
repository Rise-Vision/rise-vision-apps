'use strict';

angular.module('risevision.apps.purchase')
  .directive('paymentMethodForm', ['$templateCache', 'creditCardFactory',
    function ($templateCache, creditCardFactory) {
      return {
        restrict: 'E',
        scope: {
          formObject: '=',
          showInvoiceOption: '=',
          contactEmail: '='
        },
        template: $templateCache.get('partials/purchase/payment-method-form.html'),
        link: function ($scope) {
          $scope.paymentMethods = creditCardFactory.paymentMethods;
        }
      };
    }
  ]);
