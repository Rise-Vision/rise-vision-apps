import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';

import { EditorModule } from './editor/editor.module.js';

import { AppComponent } from './app/app.component.js';
import { HiComponent } from './hi.component.js';
import { HeroDetailDirective } from './hero-detail.component.js';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule,
    EditorModule
  ],
  declarations: [
  	HiComponent,
  	AppComponent,
  	HeroDetailDirective
  ],
  entryComponents: [
  	HiComponent,
  	AppComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  
  ngDoBootstrap() {
  	console.log('Bootstraping AngularJS');
    this.upgrade.bootstrap(document.documentElement, ['risevision.apps']);
  }
}
