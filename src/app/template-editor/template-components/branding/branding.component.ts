import { Directive, Input, Output, EventEmitter, Injector, ElementRef } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

// This Angular directive will act as an interface to the "upgraded" AngularJS component
@Directive({selector: 'template-component-branding'})
export class BrandingComponent extends UpgradeComponent {
  // The names of the input and output properties here must match the names of the
  // `<` and `&` bindings in the AngularJS component that is being wrapped
  // @Input() hero!: String;
  // @Output() onRemove!: EventEmitter<void>;

  constructor(elementRef: ElementRef, injector: Injector) {
    // We must pass the name of the directive as used by AngularJS to the super
    super('templateComponentBranding', elementRef, injector);
  }

}
