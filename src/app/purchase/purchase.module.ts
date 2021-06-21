import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingService } from './services/pricing.service';
import { TaxExemptionService } from './services/tax-exemption.service';
import { StripeService } from './services/stripe.service';
import { StripeElementsService } from './services/stripe-elements.service';
import { CreditCardService } from './services/credit-card.service';
import { CardDescriptionPipe } from './pipes/card-description.pipe';
import { PaymentSourcesService } from './services/payment-sources.service';
import { UpdateSubscriptionService } from './services/update-subscription.service';
import { PurchaseService } from './services/purchase.service';

@NgModule({
  declarations: [
    CardDescriptionPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PurchaseModule {
  static providers = [ CreditCardService, PaymentSourcesService, PricingService, PurchaseService, StripeService, StripeElementsService, TaxExemptionService, UpdateSubscriptionService ]
}
