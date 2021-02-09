import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LastRevisedComponent } from './components/last-revised/last-revised.component.js';
import { UsernamePipe } from './pipes/username.pipe.js';

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
