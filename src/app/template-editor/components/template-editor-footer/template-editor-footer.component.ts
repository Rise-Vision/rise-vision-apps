import { Component } from '@angular/core';

import { TemplateEditorService } from '../../services/template-editor.service';

@Component({
  selector: 'template-editor-footer',
  templateUrl: './template-editor-footer.component.html',
  styleUrls: ['./template-editor-footer.component.scss']
})
export class TemplateEditorFooterComponent {

  constructor(public templateEditorFactory: TemplateEditorService) {}

}
