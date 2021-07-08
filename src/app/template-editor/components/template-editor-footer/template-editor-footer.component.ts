import { Component } from '@angular/core';

import { TemplateEditorFactory } from 'src/app/ajs-upgraded-providers';

@Component({
  selector: 'template-editor-footer',
  templateUrl: './template-editor-footer.component.html',
  styleUrls: ['./template-editor-footer.component.scss']
})
export class TemplateEditorFooterComponent {

  constructor(public templateEditorFactory: TemplateEditorFactory) {}

}
