import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Billing, ConfirmModal, ProcessErrorCode } from 'src/app/ajs-upgraded-providers';
import { CardDescriptionPipe } from '../pipes/card-description.pipe';

@Injectable({
  providedIn: 'root'
})
export class PaymentSourcesService {

  public loading;
  public apiError;
  public existingCreditCards;
  public selectedCard;

  constructor(private confirmModal: ConfirmModal, private billing: Billing, private processErrorCode: ProcessErrorCode) { }

  _clearMessages() {
    this.loading = false;

    this.apiError = '';
  };

  _loadCreditCards() {
    this.loading = true;

    return this.billing.getCreditCards({
        count: 40
      })
      .then((result) => {
        this.existingCreditCards = result.items;

        if (result.items[0]) {
          this.selectedCard = result.items[0];
        }
      })
      .finally( () => {
        this.loading = false;
      });
  };

  init() {
    this._clearMessages();

    this.existingCreditCards = [];
    delete this.selectedCard;

    return this._loadCreditCards();
  };

  _deletePaymentSource(paymentSourceId) {
    this.loading = true;

    return this.billing.deletePaymentSource(paymentSourceId)
      .then( () => {
        this.init();
      })
      .catch( (e) => {
        this.loading = false;

        this._showErrorMessage(e);
      });
  };

  removePaymentMethod(card) {
    var description = new CardDescriptionPipe().transform(card.payment_source.card);

    this.confirmModal('Remove Payment Method',
      'Are you sure you want to remove this payment method? The <strong>' +
      description +
      '</strong> will be removed from your company.',
      'Yes, Remove', 'Cancel', 'madero-style centered-modal',
      'partials/components/confirm-modal/madero-confirm-modal.html', 'sm'
    ).then( () => {
      this._deletePaymentSource(card.payment_source.id);
    });
  };

  _showErrorMessage(e) {
    this.apiError = this.processErrorCode(e);

    console.error(this.apiError, e);
  };
}

angular.module('risevision.apps.purchase')
  .factory('paymentSourcesFactory', downgradeInjectable(PaymentSourcesService));