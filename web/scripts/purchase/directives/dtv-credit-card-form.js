'use strict';

angular.module('risevision.apps.purchase')
  .directive('creditCardForm', ['$templateCache', 'creditCardFactory',
    function ($templateCache, creditCardFactory) {
      return {
        restrict: 'E',
        scope: {
          paymentMethods: '=paymentMethodsObject',
          formObject: '='
        },
        template: $templateCache.get('partials/purchase/credit-card-form.html'),
        link: function ($scope) {
          creditCardFactory.initElements();

          $scope.getCardDescription = function (card) {
            return '***-' + card.last4 + ', ' + card.cardType + (card.isDefault ? ' (default)' : '');
          };

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
