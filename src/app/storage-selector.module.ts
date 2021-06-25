import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UpgradeModule } from '@angular/upgrade/static';
import { environment } from 'src/environments/environment';
import * as angular from 'angular';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
  ],
  declarations: [
  ],
  entryComponents: [
  ],
  providers: [
  ],
  bootstrap: []
})
export class SelectorModule {
  constructor(private upgrade: UpgradeModule) { }
  
  ngDoBootstrap() {
  	console.log('Bootstraping AngularJS');
    this.upgrade.bootstrap(document.documentElement, ['risevision.apps.storage.storage-selector']);
  }
}

angular.module('risevision.common.config')
  .value('environment', environment);
