import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricingService } from './services/pricing.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class PurchaseModule {
  static providers = [ PricingService ]
}
