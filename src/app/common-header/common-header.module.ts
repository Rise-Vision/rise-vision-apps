import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeaderHeightDirective } from './directives/common-header-height.directive';

@NgModule({
  declarations: [
    CommonHeaderHeightDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonHeaderHeightDirective
  ]
})
export class CommonHeaderModule { }
