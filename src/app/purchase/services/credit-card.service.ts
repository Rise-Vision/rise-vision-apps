import { Injectable } from '@angular/core';
import { AddressService, UserAuthFactory, UserState } from 'src/app/ajs-upgraded-providers';
import { StripeElementsService } from './stripe-elements.service';
import { StripeService } from './stripe.service';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { PaymentSourcesService } from './payment-sources.service';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  public paymentMethods;

  constructor(
    private stripeService: StripeService, 
    private userState: UserState, 
    private userAuthFactory: UserAuthFactory, 
    private paymentSourcesFactory: PaymentSourcesService,
    private stripeElementsFactory: StripeElementsService,
    private addressService: AddressService) {      
  }
  

  selectNewCreditCard() {
    this.paymentMethods.selectedCard = this.paymentMethods.newCreditCard;
  };

  _loadCreditCards() {
    this.paymentSourcesFactory.init()
      .then( () => {
        if (this.paymentSourcesFactory.selectedCard) {
          this.paymentMethods.selectedCard = this.paymentSourcesFactory.selectedCard;
        }
      });
  };

  initPaymentMethods(loadExistingCards) {
    this.paymentMethods = {
      newCreditCard: {
        isNew: true,
        address: {},
        useBillingAddress: false
      }
    };

    // Select New Card by default
    this.selectNewCreditCard();

    return this.userAuthFactory.authenticate()
      .then( () => {
        var company = this.userState.getCopyOfSelectedCompany();
        if (company.id) {
          this.paymentMethods.newCreditCard.useBillingAddress = true;
          this.paymentMethods.newCreditCard.billingAddress = this.addressService.copyAddress(company);

          if (loadExistingCards) {
            this._loadCreditCards();
          }
        }
      });
  };

  validatePaymentMethod() {
    this.paymentMethods.tokenError = null;

    if (!this.paymentMethods.selectedCard.isNew) {
      return Promise.resolve();
    } else {
      var element = this.stripeElementsFactory.stripeElements.cardNumber;
      var address = this.paymentMethods.newCreditCard && this.paymentMethods.newCreditCard.address;
      if (this.paymentMethods.newCreditCard && this.paymentMethods.newCreditCard.useBillingAddress) {
        address = this.paymentMethods.newCreditCard.billingAddress;
      }

      var details = {
        billing_details: {
          name: this.paymentMethods.newCreditCard && this.paymentMethods.newCreditCard.name,
          address: address ? {
            city: address.city,
            country: address.country,
            postal_code: address.postalCode,
            state: address.province
          } : {}
        }
      };

      return this.stripeService.createPaymentMethod('card', element, details)
        .then( (response) => {
          if (response.error) {
            this.paymentMethods.tokenError = response.error.message;

            return Promise.reject(response.error);
          } else {
            this.paymentMethods.paymentMethodResponse = response;

            return Promise.resolve();
          }
        });
    }
  };

  getPaymentMethodId() {
    if (this.paymentMethods.paymentMethodResponse) {
      return this.paymentMethods.paymentMethodResponse.paymentMethod.id;
    } else if (this.paymentMethods.selectedCard && this.paymentMethods.selectedCard.payment_source) {
      return this.paymentMethods.selectedCard.payment_source.reference_id;
    } else {
      return null;
    }
  };

  handleCardAction(intentSecret?) {
    return this.stripeService.handleCardAction(intentSecret)
      .then( (result) => {
        if (result.error) {
          this.paymentMethods.tokenError = result.error;
          return Promise.reject(result.error);
        }
      })
      .catch( (error) => {
        console.log(error);
        this.paymentMethods.tokenError =
          'Something went wrong, please retry or contact support@risevision.com';
        return Promise.reject(error);
      });
  };

  confirmCardSetup(intentSecret?) {
    return this.stripeService.confirmCardSetup(intentSecret)
      .then( (result) => {
        if (result.error) {
          this.paymentMethods.tokenError = result.error;
          return Promise.reject(result.error);
        }
      })
      .catch( (error) => {
        console.log(error);
        this.paymentMethods.tokenError =
          'Something went wrong, please retry or contact support@risevision.com';
        return Promise.reject(error);
      });
  };

}

angular.module('risevision.apps.purchase')
  .factory('creditCardFactory', downgradeInjectable(CreditCardService));