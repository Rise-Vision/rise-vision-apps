import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { CommonHeaderModule } from './common-header/common-header.module';
import { EditorModule } from './editor/editor.module';
import { $stateProvider, $transitionsProvider, addressServiceProvider, analyticsFactoryProvider, billingProvider, canvaTypePickerProvider, confirmModalProvider, contactServiceProvider, plansServiceProvider, processErrorCodeProvider, purchaseFlowTrackerProvider, storeServiceProvider, subscriptionFactoryProvider, templateEditorFactoryProvider, componentsFactoryProvider, presentationUtilsProvider, userAuthFactoryProvider, userStateProvider } from './ajs-upgraded-providers';
import { TemplateEditorModule } from './template-editor/template-editor.module';
import { PurchaseModule } from './purchase/purchase.module';
import { environment } from 'src/environments/environment';
import * as angular from 'angular';
import { ComponentsModule } from './components/components.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    UpgradeModule,
    HttpClientModule,

    ModalModule.forRoot(),

    SharedModule,
    CommonHeaderModule,
    ComponentsModule,
    EditorModule,
    PurchaseModule,
    TemplateEditorModule
  ],
  declarations: [
  ],
  entryComponents: [
  ],
  providers: [
    $stateProvider,
    $transitionsProvider,
    addressServiceProvider,
    analyticsFactoryProvider,
    contactServiceProvider,
    billingProvider,
    canvaTypePickerProvider,
    confirmModalProvider,
    plansServiceProvider,
    processErrorCodeProvider,
    purchaseFlowTrackerProvider,
    storeServiceProvider,
    subscriptionFactoryProvider,
    templateEditorFactoryProvider,
    componentsFactoryProvider,
    presentationUtilsProvider,
    userAuthFactoryProvider,
    userStateProvider
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

angular.module('risevision.common.config')
  .value('environment', environment);
