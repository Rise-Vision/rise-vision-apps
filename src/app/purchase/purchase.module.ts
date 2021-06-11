import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingService } from './services/pricing.service';
import { TaxExemptionService } from './services/tax-exemption.service';
import { StripeService } from './services/stripe.service';
import { StripeElementsService } from './services/stripe-elements.service';
import { CreditCardService } from './services/credit-card.service';
import { CardDescriptionPipe } from './pipes/card-description.pipe';
import { PaymentSourcesService } from './services/payment-sources.service';

@NgModule({
  declarations: [
    CardDescriptionPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PurchaseModule {
  static providers = [ CreditCardService, PaymentSourcesService, PricingService, StripeService, StripeElementsService, TaxExemptionService ]
}
