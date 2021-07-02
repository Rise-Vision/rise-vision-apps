import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastRevisedComponent } from './components/last-revised/last-revised.component';
import { UsernamePipe } from './pipes/username.pipe';
import { ProductDetailsModalComponent } from './components/product-details-modal/product-details-modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LastRevisedComponent, 
    ProductDetailsModalComponent,
    UsernamePipe
  ]
})
export class EditorModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [ LastRevisedComponent, ProductDetailsModalComponent ]
}
