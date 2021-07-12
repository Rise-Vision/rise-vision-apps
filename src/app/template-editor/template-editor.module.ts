import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonHeaderModule } from '../common-header/common-header.module';
import { CanvaButtonComponent } from './components/canva-button/canva-button.component';
import { AttributeDataService } from './services/attribute-data.service';
import { BlueprintService } from './services/blueprint.service';
import { FinancialLicenseService } from './services/financial-license.service';
import { TemplateEditorFooterComponent } from './components/template-editor-footer/template-editor-footer.component';
import { TemplateEditorComponent } from './components/template-editor/template-editor.component';
import { TemplateEditorToolbarComponent } from './components/template-editor-toolbar/template-editor-toolbar.component';
import { TemplateAttributeEditorComponent } from './components/template-attribute-editor/template-attribute-editor.component';
import { TemplateEditorPreviewHolderComponent } from './components/template-editor-preview-holder/template-editor-preview-holder.component';
import { EncodeLinkPipe } from './pipes/encode-link.pipe';
import { WorldTimezonesService } from './template-components/services/world-timezones.service';
import { TwitterCredentialsValidationService } from './template-components/services/twitter-credentials-validation.service';
import { SlidesUrlValidationServiceService } from './template-components/services/slides-url-validation-service.service';
import { RssFeedValidationService } from './template-components/services/rss-feed-validation.service';

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
    TemplateEditorPreviewHolderComponent,
    EncodeLinkPipe
  ]
})
export class TemplateEditorModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [ CanvaButtonComponent, TemplateEditorComponent, EncodeLinkPipe ]
  static providers = [ AttributeDataService, BlueprintService, FinancialLicenseService, RssFeedValidationService, SlidesUrlValidationServiceService, TwitterCredentialsValidationService, WorldTimezonesService ]
}
