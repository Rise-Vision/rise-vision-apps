import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { CommonHeaderModule } from '../common-header/common-header.module';
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';

import { CanvaButtonComponent } from './components/canva-button/canva-button.component';
import { AttributeDataService } from './services/attribute-data.service';
import { BlueprintService } from './services/blueprint.service';
import { FinancialLicenseService } from './services/financial-license.service';

import { TemplateEditorFooterComponent } from './components/template-editor-footer/template-editor-footer.component';
import { TemplateEditorComponent } from './components/template-editor/template-editor.component';
import { TemplateEditorToolbarComponent } from './components/template-editor-toolbar/template-editor-toolbar.component';
import { TemplateAttributeEditorComponent } from './components/template-attribute-editor/template-attribute-editor.component';
import { TemplateEditorPreviewHolderComponent } from './components/template-editor-preview-holder/template-editor-preview-holder.component';
import { TemplateAttributeListComponent } from './components/template-attribute-list/template-attribute-list.component';
import { TemplateComponentComponent } from './components/template-component/template-component.component';

import { EncodeLinkPipe } from './pipes/encode-link.pipe';
import { TwitterCredentialsValidationService } from './template-components/services/twitter-credentials-validation.service';
import { SlidesUrlValidationServiceService } from './template-components/services/slides-url-validation-service.service';
import { RssFeedValidationService } from './template-components/services/rss-feed-validation.service';
import { InstrumentSearchService } from './template-components/services/instrument-search.service';
import { ComponentUtilsService } from './template-components/services/component-utils.service';
import { FileMetadataUtilsService } from './template-components/services/file-metadata-utils.service';
import { BaseImageService } from './template-components/services/base-image.service';
import { LogoImageService } from './template-components/services/logo-image.service';
import { WeatherComponent } from './template-components/weather/weather.component';
import { FileExistenceCheckService } from './template-components/services/file-existence-check.service';
import { BrandingService } from './template-components/services/branding.service';
import { StorageManagerService } from './template-components/services/storage-manager.service';
import { PlaylistComponentService } from './template-components/services/playlist-component.service';
import { TimeDateComponent } from './template-components/time-date/time-date.component';

@NgModule({
  imports: [
    CommonModule,
    CommonHeaderModule,
    ComponentsModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    CanvaButtonComponent,
    TemplateEditorFooterComponent,
    TemplateEditorComponent,
    TemplateEditorToolbarComponent,
    TemplateAttributeEditorComponent,
    TemplateEditorPreviewHolderComponent,
    TemplateAttributeListComponent,
    TemplateComponentComponent,
    EncodeLinkPipe,
    WeatherComponent,
    TimeDateComponent
  ]
})
export class TemplateEditorModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [ CanvaButtonComponent, TemplateEditorComponent, EncodeLinkPipe ]
  static templateComponents = [ WeatherComponent, TimeDateComponent ]
  static providers = [ AttributeDataService, BaseImageService, BlueprintService, BrandingService, ComponentUtilsService, FileExistenceCheckService, FileMetadataUtilsService, FinancialLicenseService, InstrumentSearchService, LogoImageService, PlaylistComponentService, RssFeedValidationService, SlidesUrlValidationServiceService, StorageManagerService, TwitterCredentialsValidationService, WorldTimezonesService ]
}
