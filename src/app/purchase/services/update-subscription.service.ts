import { Injectable } from '@angular/core';
import { AjsState, AnalyticsFactory, Billing, PlansService, ProcessErrorCode, SubscriptionFactory, UserState } from 'src/app/ajs-upgraded-providers';
import { PricingService } from './pricing.service';
import * as _ from 'lodash';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class UpdateSubscriptionService {

  public userEmail;
  public loading;
  public errorMessage;
  public apiError;  
  public purchase;
  public estimate;
  public _purchaseAction;

  constructor(private $state: AjsState,
    private userState: UserState,
    private billing: Billing,
    private analyticsFactory: AnalyticsFactory,
    private pricingFactory: PricingService,
    private subscriptionFactory: SubscriptionFactory,
    private processErrorCode: ProcessErrorCode,
    private plansService: PlansService) { 

      this.userEmail = userState.getUserEmail();
    }

    _clearMessages() {
      this.loading = false;

      this.errorMessage = '';
      this.apiError = '';
    };

    init(purchaseAction) {
      this._clearMessages();

      this._purchaseAction = purchaseAction;
      this.purchase = {};
      this.purchase.completed = false;
      this.purchase.licensesToAdd = purchaseAction === 'add' ? this.$state.params.displayCount : 0;
      this.purchase.licensesToRemove = purchaseAction === 'remove' ? this.$state.params.displayCount : 0;
      this.purchase.couponCode = '';

      this.subscriptionFactory.getSubscription(this.$state.params.subscriptionId).then( () => {
        this.purchase.planId = this.subscriptionFactory.getItemSubscription().plan_id;

        if (this.purchase.planId && purchaseAction === 'annual') {
          this.purchase.planId = this.purchase.planId.replace('1m', '1y');

        } else if (purchaseAction === 'unlimited') {
          var productCode = this.plansService.getUnlimitedPlan().productCode;
          var currency = this.subscriptionFactory.getItemSubscription().currency_code.toLowerCase();
          this.purchase.planId = productCode + '-' + currency + '01y';
        }

        this.getEstimate();
      });
    };

    getCurrentDisplayCount() {
      var currentDisplayCount = this.subscriptionFactory.getItemSubscription().plan_quantity;

      return currentDisplayCount || 0;
    };

    _getChangeInLicenses() {
      if (this._purchaseAction === 'unlimited') {
        return null;
      }
      var licensesToAdd = this.purchase.licensesToAdd || 0;
      var licensesToRemove = this.purchase.licensesToRemove || 0;

      return licensesToAdd - licensesToRemove;
    };

    getTotalDisplayCount() {
      if (this._purchaseAction === 'unlimited') {
        return null;
      }
      return this.getCurrentDisplayCount() + this._getChangeInLicenses();
    };

    _getTrackingProperties() {
      return {
        subscriptionId: this.subscriptionFactory.getItemSubscription().id,
        planType: this._purchaseAction === 'unlimited' ? 'unlimited' : 'volume',
        paymentTerm: this.purchase.planId.endsWith('m') ? 'monthly' : 'yearly',
        changeInLicenses: this._getChangeInLicenses(),
        totalLicenses: this.getTotalDisplayCount(),
        companyId: this.subscriptionFactory.getItemSubscription().customer_id
      };
    };

    _updatePerDisplayPrice() {
      if (!this.estimate.next_invoice_estimate) {
        return;
      }

      var currentDisplayCount = this.getCurrentDisplayCount();
      var displayCount = this.getTotalDisplayCount();

      var lineItem = this.estimate.next_invoice_estimate.line_items[0];
      var isMonthly = lineItem.entity_id.endsWith('m');

      var educationDiscount = _.find(this.estimate.next_invoice_estimate.line_item_discounts, {
        coupon_id: 'EDUCATION'
      });
      var isEducation = !!educationDiscount;

      this.purchase.currentPricePerDisplay = this.pricingFactory.getPricePerDisplay(isMonthly,
        currentDisplayCount, isEducation);
      this.purchase.newPricePerDisplay = this.pricingFactory.getPricePerDisplay(isMonthly, displayCount,
        isEducation);
    };

    getEstimate() {
      this._clearMessages();

      this.loading = true;

      var couponCode = this.purchase.couponCode;
      var displayCount = this.getTotalDisplayCount();
      var subscriptionId = this.subscriptionFactory.getItemSubscription().id;
      var companyId = this.subscriptionFactory.getItemSubscription().customer_id;
      var planId = this.purchase.planId;

      return this.billing.estimateSubscriptionUpdate(displayCount, subscriptionId, planId, companyId, couponCode)
        .then( (result) => {
          this.estimate = result.item;

          if (this._purchaseAction !== 'unlimited') {
            this._updatePerDisplayPrice();
          }

          this.analyticsFactory.track('Subscription Update Estimated', this._getTrackingProperties());
        })
        .catch( (e) => {
          this.errorMessage = 'Something went wrong.';
          this.apiError = this.processErrorCode(e);
        })
        .finally( () => {
          this.loading = false;
        });
    };

    getCreditTotal() {
      if (!this.estimate || !this.estimate.credit_note_estimates) {
        return 0;
      }

      var total = this.estimate.credit_note_estimates.reduce( (total, note) => {
        return total + note.total;
      }, 0);

      return total / 100;
    };

    _wait(delay) {
      return new Promise(function(resolve) {
          setTimeout(resolve, delay);
      });
    }

    completePayment() {
      this._clearMessages();

      this.loading = true;

      var couponCode = this.purchase.couponCode;
      var displayCount = this.getTotalDisplayCount();
      var subscriptionId = this.subscriptionFactory.getItemSubscription().id;
      var companyId = this.subscriptionFactory.getItemSubscription().customer_id;
      var planId = this.purchase.planId;

      return this.billing.updateSubscription(displayCount, subscriptionId, planId, companyId, couponCode)
        .then( () => {
          this.analyticsFactory.track('Subscription Updated', this._getTrackingProperties());
          return this._wait(10000);
        })
        .then( () => {
          this.purchase.completed = true;

          return this.userState.reloadSelectedCompany()
            .catch( (err) => {
              console.debug('Failed to reload company', err);
            });
        })
        .catch( (e) => {
          this.errorMessage = 'Something went wrong.';
          this.apiError = this.processErrorCode(e);
        })
        .finally( () => {
          this.loading = false;
        });
    };
}

angular.module('risevision.apps.purchase')
  .factory('updateSubscriptionFactory', downgradeInjectable(UpdateSubscriptionService));