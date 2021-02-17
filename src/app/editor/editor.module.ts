import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastRevisedComponent } from './components/last-revised/last-revised.component';
import { UsernamePipe } from './pipes/username.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LastRevisedComponent, 
    UsernamePipe
  ]
})
export class EditorModule {
  //workaround for including downgraded components into build files
  //https://github.com/angular/angular/issues/35314#issuecomment-584821399
  static entryComponents = [ LastRevisedComponent ]
}
