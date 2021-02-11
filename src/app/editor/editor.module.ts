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
  ],
  entryComponents: [
    LastRevisedComponent
  ]
})
export class EditorModule { }
