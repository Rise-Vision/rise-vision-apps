'use strict';

angular.module('risevision.apps.purchase')
  .directive('creditCardForm', ['$templateCache', 'creditCardFactory', 'paymentSourcesFactory',
  'stripeElementsFactory',
    function ($templateCache, creditCardFactory, paymentSourcesFactory, stripeElementsFactory) {
      return {
        restrict: 'E',
        scope: {
          formObject: '='
        },
        template: $templateCache.get('partials/purchase/credit-card-form.html'),
        link: function ($scope) {
          $scope.creditCardFactory = creditCardFactory;
          $scope.paymentSourcesFactory = paymentSourcesFactory;

          stripeElementsFactory.init();

          $scope.stripeElementError = function (elementId) {
            var element = document.getElementById(elementId);

            if (!element) {
              return false;
            } else if ($scope.formObject.$submitted || element.className.indexOf('dirty') !== -1) {
              return element.className.indexOf('StripeElement--invalid') !== -1 ||
                element.className.indexOf('StripeElement--empty') !== -1;
            }
          };

        }
      };
    }
  ]);
