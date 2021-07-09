import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BroadcasterService } from './services/broadcaster.service';
import { ShownDirective } from './directives/shown.directive';


@NgModule({
  declarations: [
    ShownDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ShownDirective
  ]
})
export class SharedModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [  ]
  static providers = [ BroadcasterService ]
}
