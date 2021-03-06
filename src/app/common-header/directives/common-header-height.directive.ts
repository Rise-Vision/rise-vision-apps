import { Component, Directive, ElementRef, HostBinding, OnDestroy } from '@angular/core';
import { BroadcasterService } from 'src/app/shared/services/broadcaster.service';
import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';

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

@Component({
  selector: 'commonHeaderHeight',
  template: `<ng-content></ng-content>`,
  providers: [CommonHeaderHeightDirective]
})
export class CommonHeaderHeightDirectiveWrapper {
  @HostBinding('attr.commonHeaderHeight') directive;
  constructor(directive: CommonHeaderHeightDirective){}
}

const allowAttribute = directiveFactory => [ '$injector', $injector =>
    Object.assign($injector.invoke(directiveFactory), {restrict: 'EA'})
];
angular.module('risevision.common.header.directives')
  .directive('commonHeaderHeight', allowAttribute(downgradeComponent({
    component: CommonHeaderHeightDirectiveWrapper,
  })));