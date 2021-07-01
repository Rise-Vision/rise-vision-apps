import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBoxService } from './message-box/message-box.service';
import { MessageBoxComponent } from './message-box/message-box.component';

@NgModule({
  declarations: [
    MessageBoxComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [ MessageBoxComponent ]
  static providers = [ MessageBoxService ]
}
