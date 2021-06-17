import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { StripeLoaderService } from './stripe-loader.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private stripeLoader: StripeLoaderService) { }

  createPaymentMethod(type, element, details) {
    return this.stripeLoader.load().then(function (stripeClient) {
      return stripeClient.createPaymentMethod(type, element, details);
    });
  };

  handleCardAction(clientSecret) {
    return this.stripeLoader.load().then(function (stripeClient) {
      return stripeClient.handleCardAction(clientSecret);
    });
  };

  confirmCardSetup(clientSecret) {
    return this.stripeLoader.load().then(function (stripeClient) {
      return stripeClient.confirmCardSetup(clientSecret);
    });
  };

  initializeStripeElements(types, options) {
    return this.stripeLoader.load()
      .then(function (stripeClient) {
        return stripeClient.elements();
      })
      .then(function (elements) {
        return Promise.all(types.map(function (type) {
          return elements.create(type, options);
        }));
      });
  };
}

angular.module('risevision.apps.purchase')
  .factory('stripeService', downgradeInjectable(StripeService));