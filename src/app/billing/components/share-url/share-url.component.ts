import { Component, Input, OnInit } from '@angular/core';
import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';


@Component({
  selector: 'app-share-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.scss']
})
export class ShareUrlComponent implements OnInit {

  @Input() closeAction: Function;

  constructor() { }

  ngOnInit(): void {
  }

  getUrl() {
    return window.location.href;
  }

  copyToClipboard(text) {
    if (window.navigator.clipboard) {
      window.navigator.clipboard.writeText(text);
    }
  }

  onTextFocus(event) {
    event.target.select();
  }

  dismiss() {
    this.closeAction();
  }

}

angular.module('risevision.apps.billing.controllers')
  .directive(
    'shareUrl', 
    downgradeComponent({
      component: ShareUrlComponent
    }) as angular.IDirectiveFactory
  );
