// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import * as angular from 'angular';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

declare global {
  /*
   WebStorm produces a warning for Editor -> introspection -> TypeScript
   Reference to a UMD global: Report the use of references to a UMD global if the current file is a module.
   You can turn off this introspection to remove the weak warnings in your tests, however the this will also do the
   same in your production code.
   */
  const sinon: sinon.SinonStatic;
}
export {};

angular.module('risevision.common.components',[])
angular.module('risevision.apps.services',[])
angular.module('risevision.common.header.directives',[])
angular.module('risevision.apps.purchase',[])
angular.module('risevision.template-editor.controllers',[])
angular.module('risevision.template-editor.directives',[])
angular.module('risevision.template-editor.filters',[])
angular.module('risevision.template-editor.services',[])

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./app/', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
