import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingService } from './services/pricing.service';
import { TaxExemptionService } from './services/tax-exemption.service';
import { StripeService } from './services/stripe.service';
import { StripeElementsService } from './services/stripe-elements.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PurchaseModule {
  static providers = [ PricingService, StripeService, StripeElementsService, TaxExemptionService ]
}
