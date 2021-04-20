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

  @Output() designPublished = new EventEmitter<any>();

  constructor(private canvaApi: CanvaApiService) { }

  designWithCanva(): void {
    this.canvaApi.createDesign();
    // this.canvaApi.createDesign().then((options) => {
    //   this.designPublished.emit(options);
    // }).catch(()=>{
    //   // Canva was likely closed - prevents Unhandled Promise rejection  
    // });
  }

}

angular.module('risevision.editor.directives')
  .directive(
    'canvaButton', 
    downgradeComponent({
      component: CanvaButtonComponent
    }) as angular.IDirectiveFactory
  );
