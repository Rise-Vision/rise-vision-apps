import { Inject, Injectable } from '@angular/core';
import { AddressService, ContactService, PlansService, PurchaseFlowTracker, StoreService, UserState } from 'src/app/ajs-upgraded-providers';
import { CreditCardService } from './credit-card.service';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  public static readonly RPP_ADDON_ID = 'c4b368be86245bf9501baaa6e0b00df9719869fd';
  public loading = false;
  public purchase;

  constructor(
    @Inject('$rootScope') private $rootScope:any,
    private userState: UserState,
    private storeService: StoreService,
    private addressService: AddressService,
    private contactService: ContactService,
    private creditCardFactory: CreditCardService,
    private purchaseFlowTracker: PurchaseFlowTracker,
    private plansService: PlansService) {

    }

    _setupVolumePlan(displays, isMonthly) {
      var volumePlan = this.plansService.getVolumePlan();
      var period = !isMonthly ? 'Yearly' : 'Monthly';
      var s = displays > 1 ? 's' : '';
      var planName = '' + displays + ' Display License' + s + ' (' + period + ')';
      var plan = {
        name: planName,
        productId: volumePlan.productId,
        productCode: volumePlan.productCode,
        displays: displays,
        isMonthly: isMonthly,
        additionalDisplayLicenses: 0,
        yearly: {
          billAmount: volumePlan.yearly.billAmount
        },
        monthly: {
          billAmount: volumePlan.monthly.billAmount
        }
      };
      this.purchase.plan = plan;
    };

    init() {
      this.purchase = {};
      this._setupVolumePlan(5, false);
      this.purchase.couponCode = '';

      this.purchase.billingAddress = this.addressService.copyAddress(this.userState.getCopyOfSelectedCompany());

      this.purchase.contact = this.contactService.copyContactObj(this.userState.getCopyOfProfile());

      this.purchase.estimate = {};

      return this.creditCardFactory.initPaymentMethods(false)
        .finally( () => {
          this.creditCardFactory.paymentMethods.paymentMethod = 'card';
          this.creditCardFactory.paymentMethods.newCreditCard.billingAddress = this.purchase.billingAddress;

          var invoiceDate = new Date();
          invoiceDate.setDate(invoiceDate.getDate() + 30);
          this.creditCardFactory.paymentMethods.invoiceDate = invoiceDate;
        });

    };

    pickUnlimitedPlan() {
      var unlimitedPlan = this.plansService.getUnlimitedPlan();
      var plan = {
        name: unlimitedPlan.name,
        productId: unlimitedPlan.productId,
        productCode: unlimitedPlan.productCode,
        isMonthly: false,
        additionalDisplayLicenses: 0,
        yearly: {
          billAmount: unlimitedPlan.yearly.billAmount
        }
      };
      this.purchase.plan = plan;
      this.purchaseFlowTracker.trackProductAdded(this.purchase.plan);
    };

    pickVolumePlan(displays, isMonthly, total) {
      this._setupVolumePlan(displays, isMonthly);
      if (isMonthly) {
        this.purchase.plan.monthly.billAmount = total;
      } else {
        this.purchase.plan.yearly.billAmount = total;
      }
      this.purchaseFlowTracker.trackProductAdded(this.purchase.plan);
    };

    preparePaymentIntent() {
      var paymentMethods = this.creditCardFactory.paymentMethods;

      if (paymentMethods.paymentMethod === 'invoice') {
        return Promise.resolve();
      } else if (paymentMethods.paymentMethod === 'card') {
        var jsonData = this._getOrderAsJson();

        this.loading = true;

        return this.storeService.preparePurchase(jsonData)
          .then( (response) => {
            if (response.error) {
              this.purchase.checkoutError = response.error;
              return Promise.reject(response.error);
            } else {
              paymentMethods.intentResponse = response;
              if (response.authenticationRequired) {
                return this.creditCardFactory.handleCardAction(response.intentSecret);
              } else {
                return Promise.resolve();
              }
            }
          })
          .catch( (error) => {
            this.purchase.checkoutError = error.message || 'Something went wrong, please retry';
            return Promise.reject(error);
          })
          .finally( () => {
            this.loading = false;
          });
      }
    };

    validatePaymentMethod() {
      this.purchase.checkoutError = null;

      if (this.creditCardFactory.paymentMethods.paymentMethod === 'invoice') {
        // TODO: Check Invoice credit (?)
        return Promise.resolve();
      } else if (this.creditCardFactory.paymentMethods.paymentMethod === 'card') {
        this.loading = true;

        return this.creditCardFactory.validatePaymentMethod()
          .finally( () => {
            this.loading = false;
          });
      }
    };

    _getBillingPeriod() {
      return this.purchase.plan.isMonthly ? '01m' : '01y';
    };

    _getCurrency() {
      return (this.purchase.billingAddress.country === 'CA') ? 'cad' : 'usd';
    };

    _getChargebeePlanId() {
      return this.purchase.plan.productCode + '-' + this._getCurrency() + this._getBillingPeriod();
    };

    _getChargebeeAddonId() {
      return PurchaseService.RPP_ADDON_ID + '-' + this._getCurrency() + this._getBillingPeriod() +
      this.purchase.plan.productCode.substring(0, 3);
    };

    _getTrackingProperties() {
      return {
        displaysCount: this.purchase.plan.displays,
        paymentTerm: this.purchase.plan.isMonthly ? 'monthly' : 'yearly',
        paymentMethod: this.creditCardFactory.paymentMethods.paymentMethod,
        discount: this.purchase.estimate.couponAmount,
        subscriptionPlan: this.purchase.plan.name,
        currency: this.purchase.estimate.currency,
        revenueTotal: this.purchase.estimate.total
      };
    };

    getEstimate() {
      this.loading = true;

      return this.storeService.calculateTaxes(this.purchase.billingAddress.id, this._getChargebeePlanId(),
          this.purchase.plan.displays,
          this._getChargebeeAddonId(),
          this.purchase.plan.additionalDisplayLicenses, this.purchase.billingAddress, this.purchase
          .couponCode)
        .then( (result) => {
          var estimate: any = {};

          estimate.currency = this._getCurrency();
          estimate.taxesCalculated = true;
          estimate.taxes = result.taxes || [];
          estimate.total = result.total;
          estimate.subTotal = result.subTotal;
          estimate.coupons = result.coupons || [];
          estimate.couponAmount = result.couponAmount;
          estimate.totalTax = result.totalTax;
          estimate.shippingTotal = result.shippingTotal;

          this.purchase.estimate = estimate;

          this.purchaseFlowTracker.trackPlaceOrderClicked(this._getTrackingProperties());
        })
        .catch( (result) => {
          this.purchase.estimate.estimateError = result && result.message ? result.message :
            'An unexpected error has occurred. Please try again.';
        })
        .finally( () => {
          this.loading = false;
        });
    };

    _getOrderAsJson() {
      //clean up items
      var paymentMethods = this.creditCardFactory.paymentMethods;
      var newItems = [{
        id: this._getChargebeePlanId(),
        qty: this.purchase.plan.displays
      }, {
        id: this._getChargebeeAddonId(),
        qty: this.purchase.plan.additionalDisplayLicenses
      }];

      var card = paymentMethods.selectedCard;
      var cardData = paymentMethods.paymentMethod === 'invoice' ? null : {
        cardId: card.id,
        intentId: paymentMethods.intentResponse ? paymentMethods.intentResponse.intentId : null,
        isDefault: card.isDefault ? true : false
      };

      var obj = {
        billTo: this.addressService.copyAddress(this.purchase.billingAddress),
        shipTo: this.addressService.copyAddress(this.purchase.billingAddress),
        couponCode: this.purchase.couponCode,
        items: newItems,
        purchaseOrderNumber: paymentMethods.purchaseOrderNumber,
        card: cardData,
        paymentMethodId: this.creditCardFactory.getPaymentMethodId()
      };

      return JSON.stringify(obj);
    };

    _wait(delay) {
      return new Promise(function(resolve) {
          setTimeout(resolve, delay);
      });
    }

    completePayment() {
      var jsonData = this._getOrderAsJson();

      this.purchase.checkoutError = null;
      this.loading = true;

      return this.storeService.purchase(jsonData)
        .then( () => {
          this.purchase.reloadingCompany = true;

          this.purchaseFlowTracker.trackOrderPayNowClicked(this._getTrackingProperties());

          this._wait(10000)
            .then( () => {
              return this.userState.reloadSelectedCompany();
            })
            .then( () => {
              this.$rootScope.$emit('risevision.company.planStarted');
            })
            .catch( (err) => {
              console.debug('Failed to reload company', err);
            })
            .finally( () => {
              this.purchase.reloadingCompany = false;
            });
        })
        .catch( (result) => {
          this.purchase.checkoutError = result && result.message ? result.message :
            'There was an unknown error with the payment.';
        })
        .finally( () => {
          this.loading = false;
        });
    };
}

angular.module('risevision.apps.purchase')
  .factory('purchaseFactory', downgradeInjectable(PurchaseService));