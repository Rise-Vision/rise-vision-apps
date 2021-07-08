import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modals/modal.service';
import { MessageBoxComponent } from './modals/message-box/message-box.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { LastModifiedComponent } from './last-modified/last-modified/last-modified.component';
import { LastRevisedComponent } from './last-modified/last-revised/last-revised.component';
import { UsernamePipe } from './last-modified/username.pipe';
import { StreamlineIconComponent } from './streamline-icon/streamline-icon.component';

import { TemplateEditorModule } from '../template-editor/template-editor.module';

@NgModule({
  declarations: [
    MessageBoxComponent,
    ConfirmModalComponent,
    LastModifiedComponent,
    LastRevisedComponent, 
    UsernamePipe,
    StreamlineIconComponent
  ],
  imports: [
    CommonModule,
    TemplateEditorModule
  ],
  exports: [
    LastModifiedComponent,
    LastRevisedComponent,
    UsernamePipe,
    StreamlineIconComponent
  ]
})
export class ComponentsModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [ MessageBoxComponent, ConfirmModalComponent, LastModifiedComponent, LastRevisedComponent, UsernamePipe, StreamlineIconComponent ]
  static providers = [ ModalService ]
}
