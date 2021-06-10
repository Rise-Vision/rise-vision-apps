import { Inject, Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { StripeService } from './stripe.service';

@Injectable({
  providedIn: 'root'
})
export class StripeElementsService {

  constructor(@Inject('$rootScope') private $rootScope:any, private stripeService: StripeService) { }

  public stripeElements = {};

  init() {
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

    this.stripeService.initializeStripeElements(stripeElements, elementOptions)
      .then( (elements) => {
        elements.forEach((el:any, idx) => {
          this.stripeElements[stripeElements[idx]] = el;
          el.mount(stripeElementSelectors[idx]);

          el.on('blur', () => {
            this.$rootScope.$digest();
          });

          el.on('change', (event) => {
            var element = document.querySelector(stripeElementSelectors[idx]);

            if (element) {
              element.classList.add('dirty');
            }

            this.$rootScope.$digest();
          });
        });
      });
  };
}

angular.module('risevision.apps.purchase')
  .factory('stripeElementsFactory', downgradeInjectable(StripeElementsService));