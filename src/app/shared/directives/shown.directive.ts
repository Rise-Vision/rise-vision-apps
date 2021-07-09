import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[shown]'
})
export class ShownDirective {

  @Input() public shown: boolean;

  @HostBinding('attr.hidden')
  public get attrHidden(): string | null {
    return this.shown ? null : 'hidden';
  }

}
