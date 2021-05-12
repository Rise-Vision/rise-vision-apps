import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { EditorModule } from './editor/editor.module';
import { analyticsFactoryProvider, canvaTypePickerProvider } from './ajs-upgraded-providers';
import { TemplateEditorModule } from './template-editor/template-editor.module';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule,
    EditorModule,
    TemplateEditorModule
  ],
  declarations: [
  ],
  entryComponents: [
  ],
  providers: [
    analyticsFactoryProvider,
    canvaTypePickerProvider
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
