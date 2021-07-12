import { Component } from '@angular/core';

import { ModalService } from 'src/app/components/modals/modal.service';
import { TemplateEditorService } from '../../services/template-editor.service';

@Component({
  selector: 'template-editor-toolbar',
  templateUrl: './template-editor-toolbar.component.html',
  styleUrls: ['./template-editor-toolbar.component.scss']
})
export class TemplateEditorToolbarComponent {

  constructor(private modalService: ModalService,
    public templateEditorFactory: TemplateEditorService) {}

  confirmDelete() {
    this.modalService.confirmDanger('Are you sure you want to delete this Presentation?',
      null,
      'Delete Forever'
    ).then(() => {
      this.templateEditorFactory.deletePresentation();
    });
  }

}
