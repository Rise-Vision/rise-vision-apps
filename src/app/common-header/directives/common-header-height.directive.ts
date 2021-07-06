import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { BroadcasterService } from 'src/app/template-editor/services/broadcaster.service';

@Directive({selector: '[common-header-height]'})
export class CommonHeaderHeightDirective implements OnDestroy {
  private subscription: any;

  constructor(private elementRef: ElementRef, private broadcaster: BroadcasterService) {
    this._updateHeight();
    this.subscription = this.broadcaster.subscribe((event: string) => {
      if (['risevision.company.selectedCompanyChanged',
          'risevision.company.updated'].indexOf(event) !== -1) {
        this._updateHeight();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  _updateHeight() {
    setTimeout(() => {
      var commonHeaderDiv = window.document.getElementById('commonHeaderDiv');
      var elemStyle = window.getComputedStyle(commonHeaderDiv);
      var currentHeightPx = elemStyle.getPropertyValue('height');
      var currentHeight = parseInt(currentHeightPx);

      this.elementRef.nativeElement.style.setProperty('--common-header-height', currentHeight + 'px');
    });
  }

}
