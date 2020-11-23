(function (angular) {

  'use strict';

  angular.module('risevision.apps.purchase')
    .factory('creditCardFactory', ['$rootScope', 'stripeService',
      function ($rootScope, stripeService) {
        var factory = {
          stripeElements: {}
        };

        var elementOptions = {
          style: {
            base: {
              backgroundColor: '#FFF',
              color: '#020620',
              fontFamily: 'Helvetica,Arial,sans-serif',
              fontSize: '14px',
              fontSmoothing: 'antialiased',
              fontWeight: 400,
              iconColor: '#020620',
              '::placeholder': {
                color: '#777',
              },
            },
            invalid: {
              iconColor: '#020620',
              color: '#020620',
            }
          },
        };

        var stripeElements = [
          'cardNumber',
          'cardExpiry',
          'cardCvc'
        ];

        var stripeElementSelectors = [
          '#new-card-number',
          '#new-card-expiry',
          '#new-card-cvc'
        ];

        factory.initElements = function() {
          stripeService.initializeStripeElements(stripeElements, elementOptions)
            .then(function (elements) {
              elements.forEach(function (el, idx) {
                factory.stripeElements[stripeElements[idx]] = el;
                el.mount(stripeElementSelectors[idx]);

                el.on('blur', function () {
                  $rootScope.$digest();
                });

                el.on('change', function (event) {
                  var element = document.querySelector(stripeElementSelectors[idx]);

                  if (element) {
                    element.classList.add('dirty');
                  }

                  $rootScope.$digest();
                });
              });
            });  
        };

        return factory;
      }
    ]);

})(angular);
