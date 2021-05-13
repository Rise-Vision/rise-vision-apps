import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvaButtonComponent } from './components/canva-button/canva-button.component';
import { AttributeDataService } from './services/attribute-data.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CanvaButtonComponent
  ]
})
export class TemplateEditorModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [ CanvaButtonComponent ]
  static providers = [ AttributeDataService ]
}
