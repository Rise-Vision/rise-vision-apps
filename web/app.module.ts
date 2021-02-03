import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HiComponent } from './hi.component.js';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule,
  ],
  declarations: [
  	HiComponent
  ],
  entryComponents: [
  	HiComponent
  ]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  
  ngDoBootstrap() {
  	console.log('XXXXXX');
    this.upgrade.bootstrap(document.documentElement, ['risevision.apps']);
  }
}