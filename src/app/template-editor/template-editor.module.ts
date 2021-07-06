import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeaderModule } from '../common-header/common-header.module';
import { CanvaButtonComponent } from './components/canva-button/canva-button.component';
import { BroadcasterService } from './services/broadcaster.service';
import { AttributeDataService } from './services/attribute-data.service';
import { BlueprintService } from './services/blueprint.service';
import { TemplateEditorFooterComponent } from './components/template-editor-footer/template-editor-footer.component';
import { TemplateEditorComponent } from './components/template-editor/template-editor.component';
import { TemplateEditorToolbarComponent } from './components/template-editor-toolbar/template-editor-toolbar.component';
import { TemplateAttributeEditorComponent } from './components/template-attribute-editor/template-attribute-editor.component';
import { TemplateEditorPreviewHolderComponent } from './components/template-editor-preview-holder/template-editor-preview-holder.component';

@NgModule({
  imports: [
    CommonModule,
    CommonHeaderModule
  ],
  declarations: [
    CanvaButtonComponent,
    TemplateEditorFooterComponent,
    TemplateEditorComponent,
    TemplateEditorToolbarComponent,
    TemplateAttributeEditorComponent,
    TemplateEditorPreviewHolderComponent
  ]
})
export class TemplateEditorModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [ CanvaButtonComponent, TemplateEditorComponent ]
  static providers = [ BroadcasterService, AttributeDataService, BlueprintService ]
}
