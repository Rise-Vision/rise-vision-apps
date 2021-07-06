import { Directive, Injector, ElementRef } from '@angular/core';
// import { UpgradeComponent } from '@angular/upgrade/static';

// This Angular directive will act as an interface to the "upgraded" AngularJS component
@Directive({selector: '[common-header-height]'})
export class CommonHeaderHeightDirective {

  // constructor(elementRef: ElementRef, injector: Injector) {
  //   // We must pass the name of the directive as used by AngularJS to the super
  //   super('', elementRef, injector);
  // }

}
