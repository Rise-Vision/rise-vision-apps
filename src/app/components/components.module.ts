import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modals/modal.service';
import { MessageBoxComponent } from './modals/message-box/message-box.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { TemplateEditorModule } from '../template-editor/template-editor.module';

@NgModule({
  declarations: [
    MessageBoxComponent,
    ConfirmModalComponent
  ],
  imports: [
    CommonModule,
    TemplateEditorModule
  ]
})
export class ComponentsModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [ MessageBoxComponent, ConfirmModalComponent ]
  static providers = [ ModalService ]
}
