import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as angular from 'angular';
import { setAngularJSGlobal } from '@angular/upgrade/static';

import { SelectorModule } from './app/storage-selector.module';
import { environment } from './environments/environment';

setAngularJSGlobal(angular);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SelectorModule)
  .catch(err => console.log(err));
