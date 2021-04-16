import { Component, EventEmitter, Output } from '@angular/core';
import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';
import { CanvaApiService } from '../../services/canva-api.service';

@Component({
  selector: 'app-canva-button',
  templateUrl: './canva-button.component.html',
  styleUrls: ['./canva-button.component.scss']
})
export class CanvaButtonComponent {

  @Output() designPublished = new EventEmitter<string>();

  constructor(private canvaApi: CanvaApiService) { }

  designWithCanva(): void {
    this.canvaApi.createDesign().then((exportUrl: string) => {
      this.designPublished.emit(exportUrl);
    });  	
  }

}

angular.module('risevision.editor.directives')
  .directive(
    'canvaButton', 
    downgradeComponent({
      component: CanvaButtonComponent
    }) as angular.IDirectiveFactory
  );
