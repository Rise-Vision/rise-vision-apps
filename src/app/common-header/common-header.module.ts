import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeaderHeightDirective, CommonHeaderHeightDirectiveWrapper } from './directives/common-header-height.directive';
import { RequireRoleDirective } from './directives/require-role.directive';

@NgModule({
  declarations: [
    CommonHeaderHeightDirective,
    RequireRoleDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonHeaderHeightDirective,
    RequireRoleDirective
  ]
})
export class CommonHeaderModule {
  static entryComponents = [ CommonHeaderHeightDirectiveWrapper ]
}
