import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientModule } from '@angular/common/http';
import { EditorModule } from './editor/editor.module';
import { analyticsFactoryProvider, canvaTypePickerProvider, templateEditorFactoryProvider, templateEditorUtilsProvider } from './ajs-upgraded-providers';
import { TemplateEditorModule } from './template-editor/template-editor.module';
import { PurchaseModule } from './purchase/purchase.module';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule,
    HttpClientModule,
    EditorModule,
    PurchaseModule,
    TemplateEditorModule
  ],
  declarations: [
  ],
  entryComponents: [
  ],
  providers: [
    analyticsFactoryProvider,
    canvaTypePickerProvider,
    templateEditorFactoryProvider,
    templateEditorUtilsProvider
  ],
  bootstrap: []
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  
  ngDoBootstrap() {
  	console.log('Bootstraping AngularJS');
    this.upgrade.bootstrap(document.documentElement, ['risevision.apps']);
  }
}
