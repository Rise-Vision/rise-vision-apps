import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
// import { AppComponent } from './src/app/app.module.js';
import { HiComponent } from './hi.component.js';
// import { AppComponent } from './src/app/app.module.js';

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
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  
  ngDoBootstrap() {
  	console.log('XXXXXX');
    this.upgrade.bootstrap(document.documentElement, ['risevision.apps']);
  }
}