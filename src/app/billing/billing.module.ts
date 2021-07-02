import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareUrlComponent } from './components/share-url/share-url.component';



@NgModule({
  declarations: [
    ShareUrlComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BillingModule {
  static entryComponents = [ ShareUrlComponent ]
}
